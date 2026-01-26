"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { VoiceProvider, useVoice } from "@humeai/voice-react";

interface VoiceInputProps {
  onMessage: (text: string, role?: "user" | "assistant") => void;
  userName?: string | null;
  userId?: string | null;
  userEmail?: string | null;
}

const MAX_GUEST_SESSIONS = 2;
const VOICE_SESSION_KEY = "voice-sessions-used";

function VoiceButton({ onMessage, userName, userId, isLoggedIn }: {
  onMessage: (text: string, role?: "user" | "assistant") => void;
  userName?: string | null;
  userId?: string | null;
  isLoggedIn: boolean;
}) {
  const { connect, disconnect, status, messages, sendUserInput } = useVoice();
  const [isPending, setIsPending] = useState(false);
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const lastSentMsgId = useRef<string | null>(null);

  // Load sessions used on mount
  useEffect(() => {
    if (!isLoggedIn) {
      const stored = localStorage.getItem(VOICE_SESSION_KEY);
      setSessionsUsed(stored ? parseInt(stored, 10) : 0);
    }
  }, [isLoggedIn]);

  // Build system prompt
  const buildSystemPrompt = () => {
    return `## USER CONTEXT
name: ${userName || 'Guest'}
user_id: ${userId || 'anonymous'}
status: ${userName ? 'authenticated' : 'guest'}

## GREETING INSTRUCTION
${userName ? `Greet them by name: "Hi ${userName}! I'm your stamp duty assistant."` : `Greet as guest: "Hello! I'm your stamp duty calculator assistant."`}

## YOUR IDENTITY
You are a friendly UK stamp duty calculator voice assistant.
Help users understand stamp duty for England, Scotland, and Wales.

## KEY KNOWLEDGE
- England & Northern Ireland: SDLT (Stamp Duty Land Tax)
- Scotland: LBTT (Land and Buildings Transaction Tax)
- Wales: LTT (Land Transaction Tax)
- First-time buyers: Relief in England (up to £625k) and Scotland (up to £175k)
- Wales has NO first-time buyer relief
- Additional properties: +5% England, +6% Scotland, +4% Wales

## VOICE RULES
- Keep responses SHORT for voice (1-2 sentences max)
- Ask about property price, location, buyer type
- Be conversational and helpful`;
  };

  // Forward conversation messages to parent
  useEffect(() => {
    const conversationMsgs = messages.filter(
      (m: any) => (m.type === "user_message" || m.type === "assistant_message") && m.message?.content
    );

    if (conversationMsgs.length > 0) {
      const lastMsg = conversationMsgs[conversationMsgs.length - 1] as any;
      const msgId = lastMsg?.id || `${conversationMsgs.length}-${lastMsg?.message?.content?.slice(0, 20)}`;

      if (lastMsg?.message?.content && msgId !== lastSentMsgId.current) {
        const isUser = lastMsg.type === "user_message";
        console.log(`🎤 ${isUser ? 'User' : 'Assistant'}:`, lastMsg.message.content.slice(0, 80));
        lastSentMsgId.current = msgId;
        onMessage(lastMsg.message.content, isUser ? "user" : "assistant");
      }
    }
  }, [messages, onMessage]);

  const handleToggle = useCallback(async () => {
    // Check if guest has exceeded sessions
    if (!isLoggedIn && sessionsUsed >= MAX_GUEST_SESSIONS) {
      setShowLoginPrompt(true);
      return;
    }

    if (status.value === "connected") {
      console.log("🎤 Disconnecting...");
      disconnect();
    } else {
      setIsPending(true);

      // Increment session count for guests
      if (!isLoggedIn) {
        const newCount = sessionsUsed + 1;
        localStorage.setItem(VOICE_SESSION_KEY, newCount.toString());
        setSessionsUsed(newCount);
      }

      try {
        console.log("🎤 Fetching Hume token...");
        const res = await fetch("/api/hume-token");
        const { accessToken } = await res.json();

        if (!accessToken) {
          throw new Error("No access token returned");
        }
        console.log("🎤 Got access token");

        const systemPrompt = buildSystemPrompt();
        const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || "6b8b3912-ce29-45c6-ab6a-0902d7278a68";
        const sessionId = userName ? `${userName}|${userId || Date.now()}` : `anon_${Date.now()}`;

        console.log("🎤 Connecting with configId:", configId);
        console.log("🎤 Session:", sessionId);

        await connect({
          auth: { type: 'accessToken' as const, value: accessToken },
          configId: configId,
          sessionSettings: {
            type: 'session_settings',
            systemPrompt: systemPrompt,
            customSessionId: sessionId,
          }
        });

        console.log("🎤 Connected successfully");

        setTimeout(() => {
          sendUserInput("speak your greeting");
        }, 500);

      } catch (e) {
        console.error("🔴 Voice connect error:", e);
      } finally {
        setIsPending(false);
      }
    }
  }, [connect, disconnect, status.value, sendUserInput, userId, userName, isLoggedIn, sessionsUsed]);

  const isConnected = status.value === "connected";
  const sessionsRemaining = MAX_GUEST_SESSIONS - sessionsUsed;

  // Login prompt modal
  if (showLoginPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-3">Sign In for Unlimited Voice</h3>
          <p className="text-slate-400 mb-6">
            You&apos;ve used your {MAX_GUEST_SESSIONS} free voice sessions. Sign in for unlimited access to our voice assistant.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="flex-1 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => window.location.href = "/auth/sign-in"}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
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

      {/* Session counter for guests */}
      {!isLoggedIn && !isConnected && sessionsRemaining > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {sessionsRemaining}
        </div>
      )}
    </div>
  );
}

export function VoiceInput({ onMessage, userName, userId }: VoiceInputProps) {
  const isLoggedIn = !!userId;

  return (
    <VoiceProvider
      onError={(err) => console.error("🔴 Hume Error:", err)}
      onOpen={() => console.log("🟢 Hume WebSocket connected")}
      onClose={(e) => console.log("🟡 Hume closed:", e?.code, e?.reason)}
    >
      <VoiceButton
        onMessage={onMessage}
        userName={userName}
        userId={userId}
        isLoggedIn={isLoggedIn}
      />
    </VoiceProvider>
  );
}
