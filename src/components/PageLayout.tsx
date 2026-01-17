"use client";

import { ReactNode, useCallback, useState, useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import { VoiceInput } from "@/components/VoiceInput";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
}

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  systemPrompt: string;
  initialMessage?: string;
  faqs?: FAQ[];
  showCalculator?: boolean;
  breadcrumbs?: { label: string; href: string }[];
  relatedPages?: { label: string; href: string; description: string }[];
}

export function PageLayout({
  children,
  title,
  subtitle,
  systemPrompt,
  initialMessage,
  faqs,
  breadcrumbs,
  relatedPages,
}: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [voiceMessage, setVoiceMessage] = useState("");
  const { appendMessage } = useCopilotChat();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || null;

  // Register user with agent for Zep memory
  useEffect(() => {
    if (user?.id) {
      const agentUrl =
        process.env.NEXT_PUBLIC_AGENT_URL ||
        "https://stamp-duty-agent-production.up.railway.app";
      fetch(`${agentUrl}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          name: user.name,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User registered with agent:", data))
        .catch((err) => console.log("Agent registration skipped:", err.message));
    }
  }, [user?.id, user?.email, user?.name]);

  const handleVoiceMessage = useCallback(
    (text: string, role?: "user" | "assistant") => {
      setSidebarOpen(true);
      setVoiceMessage(text);

      const messageRole = role === "assistant" ? Role.Assistant : Role.User;
      appendMessage(new TextMessage({ content: text, role: messageRole }));

      setTimeout(() => setVoiceMessage(""), 5000);
    },
    [appendMessage]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-3">
              <ol className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>/</span>
                    <Link
                      href={crumb.href}
                      className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">{subtitle}</p>
              )}
            </div>
            {/* Auth status */}
            <div className="flex items-center gap-3">
              <SignedIn>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {firstName || user?.email || "Signed in"}
                </span>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => (window.location.href = "/auth/sign-in")}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Sign in
                </button>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 pb-32">
        <div className="max-w-4xl mx-auto">
          {children}

          {/* FAQs Section */}
          {faqs && faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"
                  >
                    <summary className="flex justify-between items-center cursor-pointer p-4 font-medium text-zinc-900 dark:text-white">
                      {faq.question}
                      <span className="ml-2 transition-transform group-open:rotate-180">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-zinc-600 dark:text-zinc-400">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Pages */}
          {relatedPages && relatedPages.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
                Related Calculators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPages.map((page, index) => (
                  <Link
                    key={index}
                    href={page.href}
                    className="block p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                      {page.label}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {page.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
        <VoiceInput
          onMessage={handleVoiceMessage}
          userName={firstName}
          userId={user?.id}
          userEmail={user?.email}
        />
      </div>

      {/* CopilotSidebar */}
      <CopilotSidebar
        instructions={systemPrompt}
        labels={{
          title: "Stamp Duty Assistant",
          initial:
            initialMessage ||
            (firstName
              ? `Hi ${firstName}! I can help you calculate stamp duty. Tell me your property price and location.`
              : "Hi! Tell me your property price and location, and I'll calculate your stamp duty."),
        }}
        defaultOpen={true}
        clickOutsideToClose={false}
        onSetOpen={setSidebarOpen}
      />
    </div>
  );
}

export default PageLayout;
