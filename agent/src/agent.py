"""
UK Stamp Duty Calculator Agent
Pydantic AI agent with AG-UI and CLM endpoints for CopilotKit and Hume Voice.
Integrates with Zep for user memory and knowledge graphs.
"""

import os
import sys
import json
from typing import Optional
from dataclasses import dataclass

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.result import RunContext
from pydantic_ai.ag_ui import StateDeps

# Zep for user memory
from zep_cloud.client import Zep
from zep_cloud import NotFoundError

# Neon PostgreSQL
import psycopg2

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialize Zep client
ZEP_API_KEY = os.environ.get("ZEP_API_KEY")
ZEP_GRAPH_ID = "stamp_duty_calculator"
zep_client = Zep(api_key=ZEP_API_KEY) if ZEP_API_KEY else None

# Initialize Neon database
DATABASE_URL = os.environ.get("DATABASE_URL")
print(f"[INIT] Database URL configured: {bool(DATABASE_URL)}", file=sys.stderr)

# ============================================================================
# ZEP USER MEMORY HELPERS
# ============================================================================

async def get_or_create_zep_user(user_id: str, email: str = None, name: str = None):
    """Get or create a Zep user for memory tracking."""
    if not zep_client:
        return None

    try:
        user = zep_client.user.get(user_id)
        return user
    except NotFoundError:
        # Create new user
        first_name = name.split()[0] if name else None
        last_name = " ".join(name.split()[1:]) if name and len(name.split()) > 1 else None
        zep_client.user.add(
            user_id=user_id,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        return zep_client.user.get(user_id)
    except Exception as e:
        print(f"Zep user error: {e}")
        return None


async def get_user_context(user_id: str) -> str:
    """Get relevant context about a user from Zep knowledge graph."""
    if not zep_client:
        return ""

    try:
        # Get user facts from knowledge graph
        context = zep_client.user.get_context(user_id, min_score=0.5)
        if context and context.facts:
            facts = [f.fact for f in context.facts[:5]]  # Top 5 facts
            return "Known about this user: " + "; ".join(facts)
        return ""
    except Exception as e:
        print(f"Zep context error: {e}")
        return ""


async def add_conversation_to_zep(user_id: str, user_msg: str, assistant_msg: str):
    """Store conversation in Zep for memory."""
    if not zep_client:
        return

    try:
        # Add to user's graph (creates user graph if doesn't exist)
        zep_client.graph.add(
            user_id=user_id,
            type="message",
            data=f"User asked: {user_msg}\nAssistant answered: {assistant_msg}"
        )
        print(f"Zep: Stored conversation for user {user_id[:8]}...")
    except Exception as e:
        print(f"Zep add error: {e}")


# ============================================================================
# STAMP DUTY CALCULATION LOGIC
# ============================================================================

# England/NI SDLT Rates (2024/25)
ENGLAND_STANDARD_BANDS = [
    (250000, 0.0),      # 0% up to £250,000
    (925000, 0.05),     # 5% £250,001 to £925,000
    (1500000, 0.10),    # 10% £925,001 to £1,500,000
    (float('inf'), 0.12) # 12% above £1,500,000
]

ENGLAND_FIRST_TIME_BANDS = [
    (425000, 0.0),      # 0% up to £425,000 (first-time buyers)
    (625000, 0.05),     # 5% £425,001 to £625,000
]

ENGLAND_ADDITIONAL_SURCHARGE = 0.05  # 5% surcharge on additional properties (increased from 3%)

# Scotland LBTT Rates
SCOTLAND_STANDARD_BANDS = [
    (145000, 0.0),      # 0% up to £145,000
    (250000, 0.02),     # 2% £145,001 to £250,000
    (325000, 0.05),     # 5% £250,001 to £325,000
    (750000, 0.10),     # 10% £325,001 to £750,000
    (float('inf'), 0.12) # 12% above £750,000
]

SCOTLAND_FIRST_TIME_BANDS = [
    (175000, 0.0),      # 0% up to £175,000 (first-time buyers)
    (250000, 0.02),
    (325000, 0.05),
    (750000, 0.10),
    (float('inf'), 0.12)
]

SCOTLAND_ADS = 0.06  # Additional Dwelling Supplement

# Wales LTT Rates
WALES_STANDARD_BANDS = [
    (225000, 0.0),      # 0% up to £225,000
    (400000, 0.06),     # 6% £225,001 to £400,000
    (750000, 0.075),    # 7.5% £400,001 to £750,000
    (1500000, 0.10),    # 10% £750,001 to £1,500,000
    (float('inf'), 0.12) # 12% above £1,500,000
]

WALES_HIGHER_RATES_SURCHARGE = 0.04  # 4% surcharge for additional properties


def calculate_stamp_duty(
    price: float,
    region: str,
    buyer_type: str
) -> dict:
    """
    Calculate UK stamp duty based on price, region, and buyer type.

    Args:
        price: Property purchase price in GBP
        region: 'england', 'scotland', or 'wales'
        buyer_type: 'standard', 'first-time', or 'additional'

    Returns:
        Dict with total_tax, effective_rate, and breakdown
    """
    region = region.lower()
    buyer_type = buyer_type.lower()

    # Select appropriate bands and surcharge
    if region == 'england':
        if buyer_type == 'first-time' and price <= 625000:
            bands = ENGLAND_FIRST_TIME_BANDS
            surcharge = 0.0
        elif buyer_type == 'additional':
            bands = ENGLAND_STANDARD_BANDS
            surcharge = ENGLAND_ADDITIONAL_SURCHARGE
        else:
            bands = ENGLAND_STANDARD_BANDS
            surcharge = 0.0

    elif region == 'scotland':
        if buyer_type == 'first-time':
            bands = SCOTLAND_FIRST_TIME_BANDS
            surcharge = 0.0
        elif buyer_type == 'additional':
            bands = SCOTLAND_STANDARD_BANDS
            surcharge = SCOTLAND_ADS
        else:
            bands = SCOTLAND_STANDARD_BANDS
            surcharge = 0.0

    elif region == 'wales':
        # Wales doesn't have first-time buyer relief
        bands = WALES_STANDARD_BANDS
        surcharge = WALES_HIGHER_RATES_SURCHARGE if buyer_type == 'additional' else 0.0

    else:
        return {"error": f"Unknown region: {region}. Use 'england', 'scotland', or 'wales'."}

    # Calculate tax for each band
    breakdown = []
    total_tax = 0.0
    previous_threshold = 0

    for threshold, rate in bands:
        if price > previous_threshold:
            taxable_in_band = min(price, threshold) - previous_threshold
            if taxable_in_band > 0:
                effective_rate = rate + surcharge
                tax_in_band = taxable_in_band * effective_rate
                total_tax += tax_in_band

                breakdown.append({
                    "band": f"£{previous_threshold:,.0f} - £{threshold:,.0f}" if threshold != float('inf') else f"Above £{previous_threshold:,.0f}",
                    "rate": f"{effective_rate * 100:.1f}%",
                    "taxable_amount": taxable_in_band,
                    "tax_due": tax_in_band
                })

        previous_threshold = threshold
        if price <= threshold:
            break

    effective_rate = (total_tax / price * 100) if price > 0 else 0

    return {
        "purchase_price": price,
        "region": region.title(),
        "buyer_type": buyer_type.replace('-', ' ').title(),
        "total_tax": round(total_tax, 2),
        "effective_rate": round(effective_rate, 2),
        "breakdown": breakdown
    }


# ============================================================================
# PYDANTIC AI AGENT
# ============================================================================

class UserProfile(BaseModel):
    """User profile for personalization."""
    id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None


class AppState(BaseModel):
    """Shared state between frontend and agent."""
    current_price: float = 0
    current_region: str = "england"
    current_buyer_type: str = "standard"
    last_calculation: Optional[dict] = None
    user: Optional[UserProfile] = None
    zep_context: str = ""


# Create the agent
agent = Agent(
    model=GoogleModel('gemini-2.0-flash'),
    deps_type=StateDeps[AppState]
)


@agent.system_prompt
async def dynamic_system_prompt(ctx: RunContext[StateDeps[AppState]]) -> str:
    """Build system prompt with user context."""
    state = ctx.deps.state

    # Build user context section
    user_section = ""
    if state.user and state.user.name:
        user_section = f"""
## USER CONTEXT
- **Name**: {state.user.name}
- **User ID**: {state.user.id or 'Unknown'}
When greeting or addressing the user, use their name: {state.user.name}
"""

    # Build Zep memory section
    memory_section = ""
    if state.zep_context:
        memory_section = f"""
## MEMORY (What I know about this user)
{state.zep_context}
Use this context to personalize your responses.
"""

    return f"""You are an expert UK stamp duty assistant. Help users understand their stamp duty obligations when buying property in the UK.
{user_section}
{memory_section}

## KEY KNOWLEDGE
- **England & Northern Ireland**: SDLT (Stamp Duty Land Tax)
  - Standard: 0% up to £250k, 5% to £925k, 10% to £1.5M, 12% above
  - First-time buyers: 0% up to £425k, 5% to £625k (only if total price ≤ £625k)
  - Additional properties: +5% surcharge on all bands

- **Scotland**: LBTT (Land and Buildings Transaction Tax)
  - Standard: 0% to £145k, 2% to £250k, 5% to £325k, 10% to £750k, 12% above
  - First-time buyers: 0% to £175k, then standard rates
  - Additional properties: +6% ADS (Additional Dwelling Supplement)

- **Wales**: LTT (Land Transaction Tax)
  - Standard: 0% to £225k, 6% to £400k, 7.5% to £750k, 10% to £1.5M, 12% above
  - NO first-time buyer relief in Wales
  - Additional properties: +4% surcharge

## TOOLS AVAILABLE

### Calculation Tools
- `calculate_stamp_duty_tool`: Calculate stamp duty for a specific scenario
- `compare_buyer_types`: Compare costs across different buyer types

### User Profile & Memory Tools
- `get_user_profile`: Get user's saved preferences and calculation history
- `save_user_preference`: Save user preferences (region, buyer_type, price_range)
- `save_calculation`: Save a calculation to user's history
- `get_zep_memory`: Get what you remember about the user from past conversations

## BEHAVIOR

### When calculating:
1. When user mentions a price/location, use calculate_stamp_duty_tool immediately
2. Always explain the breakdown clearly
3. Offer to compare scenarios
4. After calculating, offer to save it: "Want me to save this calculation?"

### When user shares preferences:
- "I'm a first-time buyer" → save_user_preference("buyer_type", "first-time")
- "I'm looking in Scotland" → save_user_preference("preferred_region", "scotland")
- "My budget is around 500k" → save_user_preference("price_range", "500000")

### When user asks about their profile:
- "What do you know about me?" → get_user_profile()
- "What do you remember?" → get_zep_memory()
- "My past calculations" → get_user_profile() and show calculation_history

### Important:
- Be concise but accurate
- Mention important caveats (e.g., first-time buyer £625k limit)
- Use the user's name when you know it
- Reference their saved preferences when relevant
"""


@agent.tool
async def calculate_stamp_duty_tool(
    ctx: RunContext[StateDeps[AppState]],
    purchase_price: float,
    region: str,
    buyer_type: str
) -> dict:
    """
    Calculate UK stamp duty for a property purchase.

    Args:
        purchase_price: Property price in GBP (pounds)
        region: 'england' (includes NI), 'scotland', or 'wales'
        buyer_type: 'standard', 'first-time', or 'additional'

    Returns:
        Calculation result with total tax, effective rate, and breakdown
    """
    result = calculate_stamp_duty(purchase_price, region, buyer_type)

    # Update state
    ctx.deps.state.current_price = purchase_price
    ctx.deps.state.current_region = region
    ctx.deps.state.current_buyer_type = buyer_type
    ctx.deps.state.last_calculation = result

    return result


@agent.tool
async def compare_buyer_types(
    ctx: RunContext[StateDeps[AppState]],
    purchase_price: float,
    region: str
) -> dict:
    """
    Compare stamp duty across all buyer types for a given price and region.

    Args:
        purchase_price: Property price in GBP
        region: 'england', 'scotland', or 'wales'

    Returns:
        Comparison of standard, first-time, and additional property costs
    """
    buyer_types = ['standard', 'first-time', 'additional']
    comparisons = []

    for bt in buyer_types:
        result = calculate_stamp_duty(purchase_price, region, bt)
        comparisons.append({
            "buyer_type": bt.replace('-', ' ').title(),
            "total_tax": result["total_tax"],
            "effective_rate": result["effective_rate"]
        })

    # Calculate savings
    standard_tax = comparisons[0]["total_tax"]
    first_time_tax = comparisons[1]["total_tax"]
    savings = standard_tax - first_time_tax if first_time_tax < standard_tax else 0

    return {
        "purchase_price": purchase_price,
        "region": region.title(),
        "comparisons": comparisons,
        "first_time_buyer_savings": savings
    }


# ============================================================================
# USER PROFILE & MEMORY TOOLS
# ============================================================================

@agent.tool
async def get_user_profile(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """
    Get the current user's profile information from Neon database and Zep memory.
    Call this when user asks 'what do you know about me', 'my profile', 'my preferences', etc.

    Returns their name, saved preferences (region, buyer type), and any Zep memory facts.
    """
    state = ctx.deps.state
    user = state.user

    if not user or not user.id:
        return {"logged_in": False, "message": "User is not logged in. Sign in to save your preferences."}

    profile = {
        "logged_in": True,
        "user_id": user.id,
        "name": user.name or "Unknown",
        "preferences": {},
        "calculation_history": [],
        "zep_facts": []
    }

    # Fetch from Neon database
    if DATABASE_URL:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cur = conn.cursor()

            # Get user preferences
            cur.execute("""
                SELECT item_type, value, metadata, created_at
                FROM user_profile_items
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (user.id,))
            items = cur.fetchall()

            for item_type, value, metadata, created_at in items:
                if item_type in ['preferred_region', 'buyer_type', 'price_range']:
                    profile["preferences"][item_type] = value
                elif item_type == 'calculation':
                    profile["calculation_history"].append({
                        "value": value,
                        "metadata": metadata,
                        "date": str(created_at)
                    })

            cur.close()
            conn.close()
            print(f"[TOOL] get_user_profile: Found {len(items)} items for user {user.id[:8]}...", file=sys.stderr)
        except Exception as e:
            print(f"[TOOL] get_user_profile DB error: {e}", file=sys.stderr)

    # Fetch Zep memory facts
    if zep_client and user.id:
        try:
            context = zep_client.user.get_context(user.id, min_score=0.5)
            if context and context.facts:
                profile["zep_facts"] = [f.fact for f in context.facts[:5]]
        except Exception as e:
            print(f"[TOOL] get_user_profile Zep error: {e}", file=sys.stderr)

    return profile


@agent.tool
async def save_user_preference(
    ctx: RunContext[StateDeps[AppState]],
    preference_type: str,
    value: str
) -> dict:
    """
    Save a user preference to their profile in Neon database.

    Use this when user mentions their preferences:
    - "I'm a first-time buyer" → save_user_preference("buyer_type", "first-time")
    - "I'm looking in Scotland" → save_user_preference("preferred_region", "scotland")
    - "My budget is 500k" → save_user_preference("price_range", "500000")

    Args:
        preference_type: One of 'preferred_region', 'buyer_type', 'price_range'
        value: The value to save

    Returns:
        Confirmation of saved preference
    """
    state = ctx.deps.state
    user = state.user

    if not user or not user.id:
        return {"saved": False, "message": "User not logged in. Sign in to save preferences."}

    if not DATABASE_URL:
        return {"saved": False, "message": "Database not configured"}

    # Normalize values
    VALID_REGIONS = ['england', 'scotland', 'wales']
    VALID_BUYER_TYPES = ['standard', 'first-time', 'additional']

    normalized_value = value.lower().strip()

    if preference_type == "preferred_region":
        if normalized_value not in VALID_REGIONS:
            return {"saved": False, "error": f"Invalid region. Use: {', '.join(VALID_REGIONS)}"}
        normalized_value = normalized_value.title()

    elif preference_type == "buyer_type":
        # Handle variations
        if 'first' in normalized_value:
            normalized_value = 'first-time'
        elif 'additional' in normalized_value or 'second' in normalized_value:
            normalized_value = 'additional'
        else:
            normalized_value = 'standard'

    elif preference_type == "price_range":
        # Extract number from price
        import re
        numbers = re.findall(r'[\d,]+', normalized_value.replace('£', ''))
        if numbers:
            normalized_value = numbers[0].replace(',', '')

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Check for existing preference of same type
        cur.execute("""
            SELECT id, value FROM user_profile_items
            WHERE user_id = %s AND item_type = %s
            LIMIT 1
        """, (user.id, preference_type))
        existing = cur.fetchone()

        old_value = None
        if existing:
            old_value = existing[1]
            # Delete old value (single-value fields)
            cur.execute("""
                DELETE FROM user_profile_items
                WHERE user_id = %s AND item_type = %s
            """, (user.id, preference_type))

        # Insert new value
        cur.execute("""
            INSERT INTO user_profile_items (user_id, item_type, value, metadata, confirmed)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (user_id, item_type, value) DO UPDATE SET updated_at = NOW()
            RETURNING id
        """, (user.id, preference_type, normalized_value, '{"source": "voice"}', True))

        conn.commit()
        cur.close()
        conn.close()

        print(f"[TOOL] save_user_preference: {preference_type}={normalized_value} for user {user.id[:8]}...", file=sys.stderr)

        if old_value:
            return {"saved": True, "preference": preference_type, "value": normalized_value, "replaced": old_value}
        return {"saved": True, "preference": preference_type, "value": normalized_value}

    except Exception as e:
        print(f"[TOOL] save_user_preference error: {e}", file=sys.stderr)
        return {"saved": False, "error": str(e)}


@agent.tool
async def save_calculation(
    ctx: RunContext[StateDeps[AppState]],
    price: float,
    region: str,
    buyer_type: str,
    stamp_duty: float
) -> dict:
    """
    Save a stamp duty calculation to the user's history.
    Call this AFTER calculating stamp duty to save it for the user.

    Args:
        price: Property price
        region: Region (england, scotland, wales)
        buyer_type: Buyer type (standard, first-time, additional)
        stamp_duty: Calculated stamp duty amount

    Returns:
        Confirmation of saved calculation
    """
    state = ctx.deps.state
    user = state.user

    if not user or not user.id:
        return {"saved": False, "message": "User not logged in"}

    if not DATABASE_URL:
        return {"saved": False, "message": "Database not configured"}

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        metadata = json.dumps({
            "price": price,
            "region": region,
            "buyer_type": buyer_type,
            "stamp_duty": stamp_duty,
            "source": "voice"
        })

        cur.execute("""
            INSERT INTO user_profile_items (user_id, item_type, value, metadata, confirmed)
            VALUES (%s, 'calculation', %s, %s, TRUE)
        """, (user.id, f"£{price:,.0f} in {region.title()}", metadata))

        conn.commit()
        cur.close()
        conn.close()

        print(f"[TOOL] save_calculation: £{price:,.0f} {region} for user {user.id[:8]}...", file=sys.stderr)
        return {"saved": True, "calculation": f"£{price:,.0f} property in {region.title()}"}

    except Exception as e:
        print(f"[TOOL] save_calculation error: {e}", file=sys.stderr)
        return {"saved": False, "error": str(e)}


@agent.tool
async def get_zep_memory(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """
    Get what the AI remembers about the user from Zep knowledge graph.
    Call this when user asks 'what do you remember', 'what do you know about me'.

    Returns facts extracted from past conversations.
    """
    state = ctx.deps.state
    user = state.user

    if not user or not user.id:
        return {"has_memory": False, "message": "Sign in to enable memory."}

    if not zep_client:
        return {"has_memory": False, "message": "Memory not configured."}

    try:
        context = zep_client.user.get_context(user.id, min_score=0.3)
        if context and context.facts:
            facts = [{"fact": f.fact, "score": f.score} for f in context.facts[:10]]
            return {
                "has_memory": True,
                "user_id": user.id,
                "facts_count": len(facts),
                "facts": facts
            }
        return {"has_memory": True, "facts_count": 0, "message": "No memories yet. Keep chatting!"}
    except Exception as e:
        print(f"[TOOL] get_zep_memory error: {e}", file=sys.stderr)
        return {"has_memory": False, "error": str(e)}


# ============================================================================
# FASTAPI APP WITH AG-UI AND CLM ENDPOINTS
# ============================================================================

# Create main FastAPI app
main_app = FastAPI(title="Stamp Duty Calculator Agent")

# Add CORS middleware
main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create AG-UI app from agent
ag_ui_app = agent.to_ag_ui(deps=StateDeps(AppState()))


# Store last CLM request for debugging
_last_clm_request = {}

# Health check
@main_app.get("/")
async def health():
    return {
        "status": "ok",
        "service": "stamp-duty-calculator-agent",
        "endpoints": ["/agui/", "/chat/completions", "/user", "/debug"],
        "zep_enabled": zep_client is not None
    }


# Debug endpoint to see last CLM request
@main_app.get("/debug")
async def debug_endpoint():
    """Returns the last CLM request for debugging what Hume sends."""
    return _last_clm_request


# User registration endpoint for frontend
@main_app.post("/user")
async def register_user(request: Request):
    """Register or update a user in Zep for memory tracking."""
    if not zep_client:
        return {"status": "zep_not_configured"}

    try:
        body = await request.json()
        user_id = body.get("user_id")
        email = body.get("email")
        name = body.get("name")

        if not user_id:
            return {"error": "user_id required"}, 400

        user = await get_or_create_zep_user(user_id, email, name)
        return {
            "status": "ok",
            "user_id": user_id,
            "zep_user": user is not None
        }
    except Exception as e:
        return {"error": str(e)}


# ============================================================================
# CLM ENDPOINT FOR HUME VOICE
# ============================================================================

def extract_session_id(request: Request, body: dict) -> Optional[str]:
    """Extract session ID from various sources (Hume sends it in body)."""
    # Check body first (Hume's primary method)
    session_id = body.get("custom_session_id") or body.get("customSessionId") or body.get("session_id")
    if session_id:
        return session_id

    # Check metadata
    metadata = body.get("metadata", {})
    session_id = metadata.get("custom_session_id") or metadata.get("session_id")
    if session_id:
        return session_id

    # Check headers as fallback
    for header in ["x-hume-session-id", "x-custom-session-id", "x-session-id"]:
        session_id = request.headers.get(header)
        if session_id:
            return session_id

    return None


def parse_session_id(session_id: Optional[str]) -> dict:
    """
    Parse custom session ID format: "userName|userId"
    Returns dict with user_name and user_id.
    """
    if not session_id:
        return {"user_name": "", "user_id": ""}

    # Handle anonymous sessions
    if session_id.startswith("anon_"):
        return {"user_name": "", "user_id": ""}

    parts = session_id.split("|")
    user_name = parts[0] if len(parts) > 0 else ""
    user_id = parts[1] if len(parts) > 1 else ""

    return {"user_name": user_name, "user_id": user_id}


def extract_user_from_messages(messages: list) -> dict:
    """
    Extract user name and id from system messages.
    Hume may forward sessionSettings.variables as system message content.
    Looks for patterns like:
    - "first_name: Dan" or "name: Dan"
    - "user_id: abc123"
    """
    import re
    user_name = ""
    user_id = ""

    for msg in messages:
        if msg.get("role") == "system":
            content = msg.get("content", "")
            if isinstance(content, str):
                # Look for first_name or name
                match = re.search(r'\b(?:first_name|name):\s*(\w+)', content, re.IGNORECASE)
                if match and match.group(1).lower() not in ['unknown', 'none', '']:
                    user_name = match.group(1)
                    print(f"[CLM] Found name in system message: {user_name}", file=sys.stderr)

                # Look for user_id or id (various formats)
                match = re.search(r'\b(?:user_id|id):\s*([^\s,\n]+)', content, re.IGNORECASE)
                if match and match.group(1).lower() not in ['unknown', 'none', 'anonymous', '']:
                    user_id = match.group(1)
                    print(f"[CLM] Found user_id in system message: {user_id}", file=sys.stderr)

    return {"user_name": user_name, "user_id": user_id}


async def stream_sse_response(content: str, msg_id: str):
    """Stream OpenAI-compatible SSE chunks for Hume."""
    import asyncio
    words = content.split(' ')
    for i, word in enumerate(words):
        chunk = {
            "id": msg_id,
            "object": "chat.completion.chunk",
            "choices": [{
                "index": 0,
                "delta": {"content": word + (' ' if i < len(words) - 1 else '')},
                "finish_reason": None
            }]
        }
        yield f"data: {json.dumps(chunk)}\n\n"
        await asyncio.sleep(0.01)  # Small delay for natural streaming

    # Final chunk
    yield f"data: {json.dumps({'id': msg_id, 'choices': [{'delta': {}, 'finish_reason': 'stop'}]})}\n\n"
    yield "data: [DONE]\n\n"


async def run_agent_for_clm(user_message: str, state: AppState, conversation_history: list = None) -> str:
    """
    Run the Pydantic AI agent and return text response for CLM.
    This gives voice the SAME brain as CopilotKit chat.
    """
    try:
        from pydantic_ai.messages import ModelMessage, ModelRequest, UserPromptPart, ModelResponse, TextPart

        deps = StateDeps(state)

        # Build message history for multi-turn context
        message_history = []
        if conversation_history:
            for msg in conversation_history[:-1]:  # Exclude current message
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if isinstance(content, str) and content.strip():
                    if role == "user":
                        message_history.append(
                            ModelRequest(parts=[UserPromptPart(content=content)])
                        )
                    elif role == "assistant":
                        message_history.append(
                            ModelResponse(parts=[TextPart(content=content)])
                        )

        print(f"[CLM] Running agent with {len(message_history)} history messages", file=sys.stderr)
        print(f"[CLM] State: user={state.user}, zep_context={state.zep_context[:50] if state.zep_context else 'None'}...", file=sys.stderr)

        # Run the agent with full context
        result = await agent.run(
            user_message,
            deps=deps,
            message_history=message_history if message_history else None
        )

        # Extract text from result
        if hasattr(result, 'data') and result.data:
            return str(result.data)
        elif hasattr(result, 'output'):
            return str(result.output)
        else:
            return str(result)

    except Exception as e:
        print(f"[CLM] Agent error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return ""


@main_app.post("/chat/completions")
async def clm_endpoint(request: Request):
    """
    OpenAI-compatible CLM endpoint for Hume EVI voice.
    This gives voice the SAME brain as CopilotKit chat - full agent with tools.
    """
    import asyncio
    import time

    global _last_clm_request

    try:
        body = await request.json()
        messages = body.get("messages", [])

        # Store for debugging
        _last_clm_request = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "body_keys": list(body.keys()),
            "custom_session_id": body.get("custom_session_id"),
            "customSessionId": body.get("customSessionId"),
            "session_id": body.get("session_id"),
            "metadata": body.get("metadata", {}),
            "headers": {k: v for k, v in request.headers.items() if "session" in k.lower() or "hume" in k.lower()},
            "messages": [{"role": m.get("role"), "content_preview": str(m.get("content", ""))[:500]} for m in messages]
        }

        print(f"[CLM] === REQUEST ===", file=sys.stderr)

        # Extract session ID (format: "userName|userId")
        session_id = extract_session_id(request, body)
        parsed = parse_session_id(session_id)
        user_name = parsed["user_name"]
        user_id = parsed["user_id"]

        # Fallback: extract from system messages
        if not user_name or not user_id:
            msg_parsed = extract_user_from_messages(messages)
            if not user_name and msg_parsed["user_name"]:
                user_name = msg_parsed["user_name"]
            if not user_id and msg_parsed["user_id"]:
                user_id = msg_parsed["user_id"]

        print(f"[CLM] User: name={user_name}, id={user_id}", file=sys.stderr)

        # Extract user message
        user_msg = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_msg = msg.get("content", "")
                break

        if not user_msg:
            user_msg = "Hello"

        print(f"[CLM] Message: {user_msg[:80]}...", file=sys.stderr)

        # Get Zep context for the user
        zep_context = ""
        if user_id and zep_client:
            try:
                await get_or_create_zep_user(user_id, None, user_name)
                zep_context = await get_user_context(user_id)
                if zep_context:
                    print(f"[CLM] Zep context: {zep_context[:100]}...", file=sys.stderr)
            except Exception as e:
                print(f"[CLM] Zep error: {e}", file=sys.stderr)

        # Build state with user profile and Zep context
        user_profile = UserProfile(
            id=user_id if user_id else None,
            name=user_name if user_name else None,
        ) if user_id or user_name else None

        state = AppState(
            current_price=0,
            current_region="england",
            current_buyer_type="standard",
            last_calculation=None,
            user=user_profile,
            zep_context=zep_context
        )

        # Run the actual Pydantic AI agent with full context
        response_text = await run_agent_for_clm(user_msg, state, conversation_history=messages)

        # Fallback if agent fails
        if not response_text:
            if user_name:
                response_text = f"Hi {user_name}! I can help you calculate stamp duty. What property price and location are you looking at?"
            else:
                response_text = "I can help you calculate stamp duty for properties in England, Scotland, or Wales. What's the property price?"

        print(f"[CLM] Response: {response_text[:80]}...", file=sys.stderr)

        # Store to Zep memory (fire and forget)
        if user_id and zep_client and user_msg:
            asyncio.create_task(add_conversation_to_zep(user_id, user_msg, response_text))

        msg_id = f"clm-{hash(user_msg) % 100000}"
        return StreamingResponse(
            stream_sse_response(response_text, msg_id),
            media_type="text/event-stream"
        )

    except Exception as e:
        print(f"[CLM] ERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        error_response = f"Sorry, I encountered an error. Please try again."
        return StreamingResponse(
            stream_sse_response(error_response, "error"),
            media_type="text/event-stream"
        )


# Mount AG-UI app
main_app.mount("/agui", ag_ui_app)

# Export for uvicorn
app = main_app
