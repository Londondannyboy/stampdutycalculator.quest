"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { VoiceProvider, useVoice } from "@humeai/voice-react";

interface VoiceInputProps {
  onMessage: (text: string, role: "user" | "assistant") => void;
  userName?: string | null;
}

// Session storage keys for anti-re-greeting
const SESSION_GREETED_KEY = 'hume_greeted_session';
const SESSION_LAST_INTERACTION_KEY = 'hume_last_interaction';

function getSessionValue(key: string, defaultValue: number | boolean): number | boolean {
  if (typeof window === 'undefined') return defaultValue;
  const stored = sessionStorage.getItem(key);
  if (stored === null) return defaultValue;
  return key.includes('time') ? parseInt(stored, 10) : stored === 'true';
}

function setSessionValue(key: string, value: number | boolean): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(key, String(value));
}

// Inner component using voice hook
function VoiceButton({ onMessage, userName }: VoiceInputProps) {
  const { connect, disconnect, status, messages, error, sendUserInput } = useVoice();
  const [isPending, setIsPending] = useState(false);
  const lastSentMsgId = useRef<string | null>(null);

  const greetedThisSession = useRef(getSessionValue(SESSION_GREETED_KEY, false) as boolean);
  const lastInteractionTime = useRef(getSessionValue(SESSION_LAST_INTERACTION_KEY, 0) as number);

  // Debug logging
  useEffect(() => {
    console.log("🔊 Voice status:", status.value, error);
  }, [status, error]);

  // Forward messages to CopilotKit
  useEffect(() => {
    const conversationMsgs = messages.filter(
      (m: unknown) => {
        const msg = m as { type?: string; message?: { content?: string } };
        return (msg.type === "user_message" || msg.type === "assistant_message") && msg.message?.content;
      }
    );

    if (conversationMsgs.length > 0) {
      const lastMsg = conversationMsgs[conversationMsgs.length - 1] as {
        id?: string;
        type?: string;
        message?: { content?: string };
      };
      const msgId = lastMsg?.id || `${conversationMsgs.length}-${lastMsg?.message?.content?.slice(0, 20)}`;

      if (lastMsg?.message?.content && msgId !== lastSentMsgId.current) {
        const isUser = lastMsg.type === "user_message";
        console.log(`🎤 Forwarding ${isUser ? 'user' : 'assistant'} to CopilotKit:`, lastMsg.message.content.slice(0, 50));
        lastSentMsgId.current = msgId;
        onMessage(lastMsg.message.content, isUser ? "user" : "assistant");
      }
    }
  }, [messages, onMessage]);

  const handleToggle = useCallback(async () => {
    if (status.value === "connected") {
      const now = Date.now();
      lastInteractionTime.current = now;
      setSessionValue(SESSION_LAST_INTERACTION_KEY, now);
      disconnect();
    } else {
      setIsPending(true);
      try {
        console.log("🎤 Fetching Hume token...");
        const res = await fetch("/api/hume-token");
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || data.details || "Failed to get Hume token");
        }

        const { accessToken } = data;
        if (!accessToken) {
          throw new Error("No access token returned from Hume");
        }
        console.log("🎤 Got access token");

        // Detect quick reconnect
        const timeSinceLastInteraction = lastInteractionTime.current > 0
          ? Date.now() - lastInteractionTime.current
          : Infinity;
        const isQuickReconnect = timeSinceLastInteraction < 5 * 60 * 1000;
        const wasGreeted = greetedThisSession.current;

        // Build greeting instruction
        let greetingInstruction = "";
        if (wasGreeted || isQuickReconnect) {
          greetingInstruction = `DO NOT GREET - this user was already greeted. Just continue the conversation.`;
        } else {
          greetingInstruction = userName
            ? `This is the first connection. Say "Hi ${userName}!" once, then never re-greet.`
            : `This is the first connection. Give a brief warm greeting, then never re-greet.`;
        }

        const systemPrompt = `## YOUR ROLE
You are a friendly UK stamp duty calculator assistant with voice capabilities.
Help users understand how much stamp duty they'll pay when buying property in the UK.

## KEY KNOWLEDGE
- England & Northern Ireland use SDLT (Stamp Duty Land Tax)
- Scotland uses LBTT (Land and Buildings Transaction Tax)
- Wales uses LTT (Land Transaction Tax)

## USER PROFILE
${userName ? `Name: ${userName}` : 'Guest user'}

## GREETING RULES
${greetingInstruction}

## HOW TO HELP
1. Ask about their property purchase price if not mentioned
2. Confirm the location (England, Scotland, or Wales)
3. Ask if they're a first-time buyer
4. Ask if this is an additional property (second home/buy-to-let)
5. Use the calculateStampDuty action to compute the duty
6. Explain the calculation breakdown clearly
7. Offer to compare scenarios (e.g., first-time buyer vs standard)

## IMPORTANT NOTES
- First-time buyer relief in England only applies to properties up to £625,000
- Wales does NOT offer first-time buyer relief
- Additional properties have surcharges (3% in England, 6% ADS in Scotland)

## BEHAVIOR
- Keep responses short for voice - 1-2 sentences unless they ask for details
- Be accurate with tax information
- Explain in plain English, avoid jargon
- Confirm calculations before giving final answers`;

        const customSessionId = `stamp_duty_${Date.now()}`;

        const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || "6b8b3912-ce29-45c6-ab6a-0902d7278a68";
        console.log("🎤 Connecting with configId:", configId);

        if (!configId) {
          throw new Error("Missing Hume config ID");
        }

        await connect({
          auth: { type: "accessToken", value: accessToken },
          configId: configId,
          sessionSettings: {
            type: "session_settings",
            systemPrompt: systemPrompt,
            customSessionId: customSessionId,
          }
        });
        console.log("🎤 Connected successfully");

        // Mark as greeted and trigger initial greeting
        if (!wasGreeted && !isQuickReconnect && userName) {
          setTimeout(() => {
            greetedThisSession.current = true;
            setSessionValue(SESSION_GREETED_KEY, true);
            sendUserInput(`Hello, my name is ${userName}`);
          }, 500);
        } else {
          greetedThisSession.current = true;
          setSessionValue(SESSION_GREETED_KEY, true);
        }
      } catch (e) {
        console.error("Voice connect error:", e);
      } finally {
        setIsPending(false);
      }
    }
  }, [connect, disconnect, status.value, userName, sendUserInput]);

  const isConnected = status.value === "connected";

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
        isConnected
          ? "bg-red-500 hover:bg-red-600 animate-pulse"
          : isPending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      title={isConnected ? "Stop listening" : "Start voice input"}
      aria-label={isConnected ? "Stop listening" : "Start voice input"}
    >
      {isPending ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isConnected ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10h6v4H9z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          )}
        </svg>
      )}
    </button>
  );
}

// Stable callbacks for VoiceProvider
const handleVoiceError = (err: unknown) => {
  const error = err as { message?: string };
  console.error("🔴 Hume Error:", error?.message || err);
};
const handleVoiceOpen = () => console.log("🟢 Hume connected");
const handleVoiceClose = (e: unknown) => {
  const event = e as { code?: string; reason?: string };
  console.log("🟡 Hume closed:", event?.code, event?.reason);
};

// Exported component with VoiceProvider
export function VoiceInput({ onMessage, userName }: VoiceInputProps) {
  return (
    <VoiceProvider
      onError={handleVoiceError}
      onOpen={handleVoiceOpen}
      onClose={handleVoiceClose}
    >
      <VoiceButton onMessage={onMessage} userName={userName} />
    </VoiceProvider>
  );
}
