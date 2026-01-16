"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { VoiceProvider, useVoice } from "@humeai/voice-react";

interface VoiceInputProps {
  onMessage: (text: string, role?: "user" | "assistant") => void;
  userName?: string | null;
  userId?: string | null;
  userEmail?: string | null;
}

function VoiceButton({ onMessage, userName, userId }: {
  onMessage: (text: string, role?: "user" | "assistant") => void;
  userName?: string | null;
  userId?: string | null;
}) {
  const { connect, disconnect, status, messages, sendUserInput } = useVoice();
  const [isPending, setIsPending] = useState(false);
  const lastSentMsgId = useRef<string | null>(null);

  // Build system prompt
  const buildSystemPrompt = () => {
    return `USER_CONTEXT:
name: ${userName || 'Guest'}
id: ${userId || 'anonymous'}
status: ${userName ? 'authenticated' : 'guest'}

GREETING:
${userName ? `Greet them: "Hi ${userName}! I'm your stamp duty assistant."` : `Greet them: "Hello! I'm your stamp duty calculator assistant."`}

IDENTITY:
- You are a friendly UK stamp duty calculator assistant
- Help users understand stamp duty for England, Scotland, and Wales

KEY KNOWLEDGE:
- England & Northern Ireland: SDLT (Stamp Duty Land Tax)
- Scotland: LBTT (Land and Buildings Transaction Tax)
- Wales: LTT (Land Transaction Tax)
- First-time buyers: Relief in England (up to £625k) and Scotland (up to £175k)
- Wales has NO first-time buyer relief
- Additional properties: +5% England, +6% Scotland, +4% Wales

RULES:
- Keep responses SHORT for voice (1-2 sentences)
- Ask about property price, location, buyer type
- Be helpful and accurate`;
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
    if (status.value === "connected") {
      console.log("🎤 Disconnecting...");
      disconnect();
    } else {
      setIsPending(true);

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

        // Connect with sessionSettings (matches lost.london-v2 pattern)
        await connect({
          auth: { type: 'accessToken' as const, value: accessToken },
          configId: configId,
          sessionSettings: {
            type: 'session_settings' as const,
            systemPrompt,
            customSessionId: sessionId,
          },
        });

        console.log("🎤 Connected successfully");

        // Trigger greeting after connection
        setTimeout(() => {
          sendUserInput("speak your greeting");
        }, 500);

      } catch (e) {
        console.error("🔴 Voice connect error:", e);
      } finally {
        setIsPending(false);
      }
    }
  }, [connect, disconnect, status.value, sendUserInput, userId, userName]);

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

export function VoiceInput({ onMessage, userName, userId }: VoiceInputProps) {
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
      />
    </VoiceProvider>
  );
}
