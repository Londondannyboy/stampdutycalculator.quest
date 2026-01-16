"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { VoiceInput } from "@/components/VoiceInput";
import { useCallback, useState } from "react";

const SYSTEM_PROMPT = `You are an expert UK stamp duty assistant. You help users understand their stamp duty obligations when buying property in the UK.

Key information you know:
- England & Northern Ireland use SDLT (Stamp Duty Land Tax)
- Scotland uses LBTT (Land and Buildings Transaction Tax)
- Wales uses LTT (Land Transaction Tax)

When helping users:
1. Ask about their property purchase price if not provided
2. Confirm the property location (England, Scotland, or Wales)
3. Check if they're a first-time buyer (eligible for relief in England and Scotland)
4. Ask if this is an additional property (second home or buy-to-let)
5. Use the calculateStampDuty action to compute the duty
6. Explain each band of the calculation clearly
7. Offer to compare different scenarios (e.g., "What if you weren't a first-time buyer?")

Important notes:
- First-time buyer relief in England applies only to properties up to £625,000
- Wales does NOT offer specific first-time buyer relief
- Additional properties incur surcharges (3% in England, 6% ADS in Scotland, higher rates in Wales)
- All rates are for residential properties

Always be helpful, accurate, and explain things in plain English. If you're unsure about something, say so.`;

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const { appendMessage } = useCopilotChat();
  const { data: session } = authClient.useSession();

  // Get user from session
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || null;

  const handleVoiceMessage = useCallback((text: string, role: "user" | "assistant") => {
    // Open the sidebar
    setSidebarOpen(true);
    setVoiceMessage(text);

    // Forward message to CopilotKit
    const messageRole = role === "user" ? Role.User : Role.Assistant;
    appendMessage(new TextMessage({ content: text, role: messageRole }));

    // Clear notification after a delay
    setTimeout(() => setVoiceMessage(""), 5000);
  }, [appendMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              UK Stamp Duty Calculator
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Calculate SDLT, LBTT & LTT with AI assistance
            </p>
          </div>
          {/* Auth status indicator */}
          <div className="flex items-center gap-3">
            <SignedIn>
              <span className="text-sm text-green-600 dark:text-green-400">
                {firstName || user?.email || 'Signed in'}
              </span>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <button
                onClick={() => window.location.href = '/auth/sign-in'}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Sign in
              </button>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <StampDutyCalculator />

        {/* Info Section */}
        <div className="max-w-2xl mx-auto mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow">
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              About UK Property Taxes
            </h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong>England & Northern Ireland:</strong> Stamp Duty Land Tax
                (SDLT)
              </li>
              <li>
                <strong>Scotland:</strong> Land and Buildings Transaction Tax
                (LBTT)
              </li>
              <li>
                <strong>Wales:</strong> Land Transaction Tax (LTT)
              </li>
            </ul>
            <p className="mt-3 text-xs">
              Use the AI chat assistant to ask questions about stamp duty,
              compare scenarios, or get help understanding your calculation.
              Click the microphone button to use voice input.
            </p>
          </div>
        </div>
      </main>

      {/* Voice transcript notification */}
      {voiceMessage && (
        <div className="fixed bottom-40 right-6 z-50 max-w-xs bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <p className="text-xs text-zinc-400 mb-1">Voice:</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{voiceMessage}</p>
        </div>
      )}

      {/* Voice Input - centered at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <VoiceInput onMessage={handleVoiceMessage} userName={firstName} />
      </div>

      {/* CopilotSidebar */}
      <CopilotSidebar
        instructions={SYSTEM_PROMPT}
        labels={{
          title: "Stamp Duty Assistant",
          initial:
            "Hi! I can help you calculate stamp duty for your property purchase. Tell me the property price and location, and I'll work out what you'll pay.",
        }}
        defaultOpen={sidebarOpen}
        clickOutsideToClose={true}
        onSetOpen={setSidebarOpen}
      />
    </div>
  );
}
