"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { VoiceInput } from "@/components/VoiceInput";
import {
  SDLTRatesChart,
  RegionComparisonChart,
  CalculationBreakdown,
  InfoBox,
} from "@/components/charts";
import { useCallback, useState, useEffect } from "react";
import Link from "next/link";

const SYSTEM_PROMPT = `You are an expert UK stamp duty assistant. You help users understand their stamp duty obligations when buying property in the UK.

Key information you know:
- England & Northern Ireland use SDLT (Stamp Duty Land Tax)
- Scotland uses LBTT (Land and Buildings Transaction Tax)
- Wales uses LTT (Land Transaction Tax)

Current SDLT rates for England (2025):
- £0 to £250,000: 0%
- £250,001 to £925,000: 5%
- £925,001 to £1,500,000: 10%
- Over £1,500,000: 12%

First-time buyer relief (England):
- £0 to £425,000: 0%
- £425,001 to £625,000: 5%
- Only available for properties up to £625,000

Additional property surcharge: 5% (was 3% until October 2024)

When helping users:
1. Ask about their property purchase price if not provided
2. Confirm the property location (England, Scotland, or Wales)
3. Check if they're a first-time buyer (eligible for relief in England and Scotland)
4. Ask if this is an additional property (second home or buy-to-let)
5. Use the calculateStampDuty action to compute the duty
6. Explain each band of the calculation clearly
7. Offer to compare different scenarios

Always be helpful, accurate, and explain things in plain English.`;

// SDLT Rate Data
const SDLT_STANDARD_RATES = [
  { threshold: 0, rate: 0, label: "Up to £250,000" },
  { threshold: 250000, rate: 5, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 10, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 12, label: "Over £1.5m" },
];

const SDLT_FTB_RATES = [
  { threshold: 0, rate: 0, label: "Up to £425,000" },
  { threshold: 425000, rate: 5, label: "£425,001 to £625,000" },
];

const SDLT_ADDITIONAL_RATES = [
  { threshold: 0, rate: 5, label: "Up to £250,000" },
  { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 17, label: "Over £1.5m" },
];

// FAQ Data
const FAQS = [
  {
    question: "What is stamp duty?",
    answer:
      "Stamp duty (officially Stamp Duty Land Tax or SDLT) is a tax you pay when buying property or land over a certain price in England and Northern Ireland. Scotland has LBTT and Wales has LTT - similar taxes with different rates. The tax is calculated in bands, meaning you pay different rates on different portions of the purchase price.",
  },
  {
    question: "How much stamp duty will I pay on a £300,000 house?",
    answer:
      "For a standard buyer purchasing a £300,000 main residence in England: £0 on the first £250,000 + 5% on the remaining £50,000 = £2,500. First-time buyers pay £0 (eligible for full relief). For additional properties, add the 5% surcharge: £15,000 + £2,500 = £17,500.",
  },
  {
    question: "How much stamp duty will I pay on a £400,000 house?",
    answer:
      "For a standard buyer on a £400,000 property in England: £0 on the first £250,000 + 5% on £150,000 = £7,500. First-time buyers pay £0 on £425,000 = £0 stamp duty. For additional properties: 5% on full price (£20,000) + £7,500 = £27,500.",
  },
  {
    question: "How much stamp duty will I pay on a £500,000 house?",
    answer:
      "For a standard buyer on a £500,000 property: £0 on £250,000 + 5% on £250,000 = £12,500. First-time buyers pay £0 on £425,000 + 5% on £75,000 = £3,750. For additional properties: 5% surcharge on £500,000 (£25,000) + £12,500 = £37,500.",
  },
  {
    question: "Do first-time buyers pay stamp duty?",
    answer:
      "In England, first-time buyers pay no stamp duty on the first £425,000 of properties worth up to £625,000. Above £625,000, you pay standard rates. Scotland offers FTB relief up to £175,000 with no price cap. Wales has no first-time buyer relief - all buyers pay the same rates.",
  },
  {
    question: "What is the additional property surcharge?",
    answer:
      "If you're buying a second home, buy-to-let, or any additional residential property while owning another, you pay a 5% surcharge on top of standard SDLT rates in England (increased from 3% in October 2024). Scotland charges 6% ADS and Wales has higher LTT rates for additional properties.",
  },
  {
    question: "When do I pay stamp duty?",
    answer:
      "SDLT must be paid within 14 days of completing your property purchase. Your solicitor or conveyancer typically handles this as part of the conveyancing process, submitting the return and payment to HMRC on your behalf.",
  },
  {
    question: "Can I get a stamp duty refund?",
    answer:
      "Yes, in certain circumstances. If you paid the higher rate surcharge because you owned two properties, but sell your previous main home within 3 years, you can claim a refund of the extra stamp duty paid. You must apply to HMRC within 12 months of selling.",
  },
  {
    question: "What's the difference between SDLT, LBTT, and LTT?",
    answer:
      "SDLT (Stamp Duty Land Tax) applies in England and Northern Ireland. LBTT (Land and Buildings Transaction Tax) applies in Scotland. LTT (Land Transaction Tax) applies in Wales. Each has different rates and thresholds, though they work similarly as progressive property taxes.",
  },
  {
    question: "Is stamp duty different in London?",
    answer:
      "No, SDLT rates are the same across England regardless of location. However, with higher average property prices in London, buyers typically pay more stamp duty in absolute terms. A £600,000 London flat incurs the same SDLT as a £600,000 house anywhere else in England.",
  },
];

// Price examples for comparison table
const PRICE_EXAMPLES = [
  { price: 250000, standard: 0, ftb: 0, additional: 12500 },
  { price: 300000, standard: 2500, ftb: 0, additional: 17500 },
  { price: 400000, standard: 7500, ftb: 0, additional: 27500 },
  { price: 500000, standard: 12500, ftb: 3750, additional: 37500 },
  { price: 625000, standard: 18750, ftb: 10000, additional: 50000 },
  { price: 750000, standard: 25000, ftb: 25000, additional: 62500 },
  { price: 1000000, standard: 41250, ftb: 41250, additional: 91250 },
];

// Authoritative external links - BBC, Wikipedia, then GOV.UK
const AUTHORITATIVE_LINKS = [
  {
    href: "https://www.bbc.co.uk/news/business-49106250",
    label: "BBC News - Stamp Duty Guide",
    description: "BBC explanation of how stamp duty works in the UK",
    badge: "BBC",
    badgeColor: "bg-red-600",
  },
  {
    href: "https://en.wikipedia.org/wiki/Stamp_duty_in_the_United_Kingdom",
    label: "Wikipedia - Stamp Duty UK",
    description: "Comprehensive history and overview of UK stamp duty",
    badge: "Wikipedia",
    badgeColor: "bg-gray-600",
  },
  {
    href: "https://www.gov.uk/stamp-duty-land-tax",
    label: "HMRC - Official SDLT Guide",
    description: "Official government guidance on Stamp Duty Land Tax",
    badge: "GOV.UK",
    badgeColor: "bg-emerald-600",
  },
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates",
    label: "Current SDLT Rates",
    description: "Official HMRC stamp duty rates for residential property",
    badge: "GOV.UK",
    badgeColor: "bg-emerald-600",
  },
  {
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-relief-for-first-time-buyers",
    label: "First-Time Buyer Relief",
    description: "HMRC guidance on first-time buyer stamp duty relief",
    badge: "GOV.UK",
    badgeColor: "bg-emerald-600",
  },
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/higher-rates-for-additional-properties",
    label: "Additional Property Rates",
    description: "5% surcharge guidance for second homes and buy-to-lets",
    badge: "GOV.UK",
    badgeColor: "bg-emerald-600",
  },
  {
    href: "https://revenue.scot/taxes/land-buildings-transaction-tax",
    label: "Revenue Scotland - LBTT",
    description: "Official LBTT information for Scottish properties",
    badge: "GOV.SCOT",
    badgeColor: "bg-blue-600",
  },
  {
    href: "https://www.gov.wales/land-transaction-tax-guide",
    label: "Welsh Revenue Authority - LTT",
    description: "Official Land Transaction Tax guide for Wales",
    badge: "GOV.WALES",
    badgeColor: "bg-red-700",
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [voiceMessage, setVoiceMessage] = useState("");
  const { appendMessage } = useCopilotChat();
  const { data: session } = authClient.useSession();

  const user = session?.user;
  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || null;

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
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with gradient */}
      <section className="relative w-full py-16 px-4 gradient-hero border-b border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Updated January 2025
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                UK Stamp Duty Calculator
                <span className="text-blue-400"> 2025</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl">
                Free AI-powered calculator for SDLT (England), LBTT (Scotland) & LTT (Wales).
                Accurate calculations for first-time buyers, second homes, and buy-to-let properties.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SignedIn>
                <span className="text-sm text-emerald-400 hidden sm:block">
                  {firstName || user?.email || "Signed in"}
                </span>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => (window.location.href = "/auth/sign-in")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Sign in
                </button>
              </SignedOut>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified HMRC Rates
            </span>
            <span className="flex items-center gap-2 text-slate-300">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              All UK Regions
            </span>
            <span className="flex items-center gap-2 text-slate-300">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Free
            </span>
            <span className="flex items-center gap-2 text-slate-300">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              AI Assistant
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 py-12 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Calculator Section */}
          <section className="mb-16">
            <div className="gradient-card rounded-2xl p-8 glow-blue">
              <StampDutyCalculator />
            </div>
          </section>

          {/* What is Stamp Duty Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              What is Stamp Duty Land Tax (SDLT)?
            </h2>
            <div className="gradient-card rounded-2xl p-8">
              <p className="text-lg text-slate-300 leading-relaxed mb-4">
                Stamp Duty Land Tax (SDLT) is a property transaction tax charged on residential
                and commercial property purchases in England and Northern Ireland. When you buy
                a property above a certain threshold, you must pay stamp duty to HM Revenue and
                Customs (HMRC) within 14 days of completing the purchase. The tax is calculated
                on a progressive basis, meaning you pay different rates on different portions of
                the purchase price - similar to how income tax works.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Scotland and Wales have their own property taxes: Land and Buildings Transaction
                Tax (LBTT) in Scotland, and Land Transaction Tax (LTT) in Wales. While similar in
                structure, each has different rates and thresholds. Our calculator supports all
                three tax systems, helping you understand exactly what you&apos;ll pay regardless of
                where you&apos;re buying in the UK.
              </p>
            </div>
          </section>

          {/* Current SDLT Rates Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Current Stamp Duty Rates 2025
            </h2>
            <p className="text-slate-400 mb-8">
              The following SDLT rates apply to residential property purchases in England and
              Northern Ireland. Note that first-time buyer relief thresholds are changing from April 2025 - check our{" "}
              <Link href="/first-time-buyer" className="text-blue-400 hover:text-blue-300 underline">
                first-time buyer calculator
              </Link>{" "}
              for details.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="gradient-card rounded-2xl p-1">
                <SDLTRatesChart
                  title="Standard Rates"
                  bands={SDLT_STANDARD_RATES}
                  note="Main residence purchases"
                  variant="england"
                />
              </div>
              <div className="gradient-card rounded-2xl p-1">
                <SDLTRatesChart
                  title="First-Time Buyer"
                  bands={SDLT_FTB_RATES}
                  note="Properties up to £625,000"
                  variant="england"
                />
              </div>
              <div className="gradient-card rounded-2xl p-1">
                <SDLTRatesChart
                  title="Additional Property (+5%)"
                  bands={SDLT_ADDITIONAL_RATES}
                  note="Second homes & buy-to-lets"
                  variant="england"
                />
              </div>
            </div>
          </section>

          {/* Important Update Box */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-2">October 2024 & April 2025 Rate Changes</h3>
                  <p className="text-slate-300 mb-3">
                    From October 2024, the additional property surcharge increased from <strong className="text-white">3% to 5%</strong>.
                    This affects second homes, buy-to-let properties, and any purchase where you already own
                    another residential property.
                  </p>
                  <p className="text-slate-400">
                    From April 2025, first-time buyer thresholds will change. The nil-rate band reduces
                    from £425,000 to £300,000, and the maximum property value for relief drops from
                    £625,000 to £500,000.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stamp Duty Examples Table */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Stamp Duty Calculator Examples 2025
            </h2>
            <p className="text-slate-400 mb-8">
              Quick reference table showing stamp duty payable at common property prices. These
              calculations are for properties in England. Use our calculator above for precise
              amounts based on your specific situation.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
              <table className="w-full text-sm table-dark">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="text-left p-4 font-semibold text-slate-300">
                      Property Price
                    </th>
                    <th className="text-right p-4 font-semibold text-slate-300">
                      Standard Rate
                    </th>
                    <th className="text-right p-4 font-semibold text-slate-300">
                      First-Time Buyer
                    </th>
                    <th className="text-right p-4 font-semibold text-slate-300">
                      Additional Property
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICE_EXAMPLES.map((example, index) => (
                    <tr
                      key={example.price}
                      className={`border-t border-slate-700/50 hover:bg-blue-500/5 transition-colors ${
                        index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/10"
                      }`}
                    >
                      <td className="p-4 font-medium text-white">
                        £{example.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-blue-400">
                        £{example.standard.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-400">
                        £{example.ftb.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-red-400">
                        £{example.additional.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              * First-time buyer rates only apply to properties up to £625,000. Above this, standard rates apply.
            </p>
          </section>

          {/* First-Time Buyer Section */}
          <section className="mb-16" id="first-time-buyer">
            <h2 className="text-3xl font-bold text-white mb-6">
              First-Time Buyer Stamp Duty Calculator
            </h2>
            <div className="gradient-card rounded-2xl p-8">
              <p className="text-slate-300 mb-6">
                First-time buyers in England benefit from generous stamp duty relief. If you&apos;ve
                never owned property before (anywhere in the world), you may be eligible for
                reduced or zero stamp duty on your first home purchase.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                  <h3 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Current FTB Relief (Until April 2025)
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      0% on the first £425,000
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      5% from £425,001 to £625,000
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Max property price: £625,000
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                  <h3 className="font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    New FTB Relief (From April 2025)
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      0% on the first £300,000
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      5% from £300,001 to £500,000
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      Max property price: £500,000
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/first-time-buyer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
              >
                Use First-Time Buyer Calculator
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Second Home Section */}
          <section className="mb-16" id="second-home">
            <h2 className="text-3xl font-bold text-white mb-6">
              Second Home Stamp Duty Calculator
            </h2>
            <div className="gradient-card rounded-2xl p-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">5% Surcharge Applies</h3>
                    <p className="text-slate-300">
                      Since October 2024, buying a second home or additional property incurs a <strong className="text-white">5%
                      surcharge</strong> on top of standard SDLT rates. This increased from the previous 3% rate.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-white mb-4">When Does the Surcharge Apply?</h3>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  </span>
                  You already own a residential property (anywhere in the world)
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  </span>
                  Buying a second home, holiday home, or investment property
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  </span>
                  Purchasing buy-to-let property
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  </span>
                  Buying before selling your current home (refund possible within 3 years)
                </li>
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CalculationBreakdown
                  propertyPrice={400000}
                  buyerType="standard"
                  region="england"
                />
                <CalculationBreakdown
                  propertyPrice={400000}
                  buyerType="additional"
                  region="england"
                />
              </div>

              <Link
                href="/second-home"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
              >
                Use Second Home Calculator
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Buy-to-Let Section */}
          <section className="mb-16" id="buy-to-let">
            <h2 className="text-3xl font-bold text-white mb-6">
              Buy-to-Let Stamp Duty Calculator
            </h2>
            <div className="gradient-card rounded-2xl p-8">
              <p className="text-slate-300 mb-6">
                Buy-to-let properties are subject to the same 5% additional property surcharge as
                second homes. This applies whether you&apos;re an individual landlord or purchasing
                through a limited company. The increased stamp duty is a significant cost to factor
                into your investment calculations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Purchase
                  </h3>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li>• Standard SDLT rates + 5% surcharge</li>
                    <li>• Rental income taxed at your marginal rate</li>
                    <li>• Limited mortgage interest relief</li>
                    <li>• Capital gains tax on sale (up to 28%)</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company Purchase (SPV)
                  </h3>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li>• Same SDLT rates apply (+ 5% surcharge)</li>
                    <li>• Full mortgage interest relief</li>
                    <li>• Corporation tax on profits (25%)</li>
                    <li>• 15% SDLT on properties over £500k in some cases</li>
                  </ul>
                </div>
              </div>

              <Link
                href="/buy-to-let"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
              >
                Use Buy-to-Let Calculator
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Regional Comparison Section */}
          <section className="mb-16" id="regional">
            <h2 className="text-3xl font-bold text-white mb-6">
              UK Regional Stamp Duty Comparison
            </h2>
            <p className="text-slate-400 mb-8">
              The UK has three different property tax systems. England and Northern Ireland use
              SDLT (Stamp Duty Land Tax), Scotland uses LBTT (Land and Buildings Transaction Tax),
              and Wales uses LTT (Land Transaction Tax). Each has different rates and thresholds.
            </p>

            <div className="gradient-card rounded-2xl p-8 mb-8">
              <RegionComparisonChart propertyPrice={400000} showFTB={true} showAdditional={true} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* England Card */}
              <div className="gradient-card rounded-2xl p-6 card-hover">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></span>
                  England & NI (SDLT)
                </h3>
                <ul className="text-sm text-slate-400 space-y-2 mb-4">
                  <li>• Nil rate: £250,000</li>
                  <li>• FTB nil rate: £425,000</li>
                  <li>• Additional surcharge: 5%</li>
                </ul>
                <Link
                  href="/"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                >
                  SDLT Calculator
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Scotland Card */}
              <div className="gradient-card rounded-2xl p-6 card-hover">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></span>
                  Scotland (LBTT)
                </h3>
                <ul className="text-sm text-slate-400 space-y-2 mb-4">
                  <li>• Nil rate: £145,000</li>
                  <li>• FTB nil rate: £175,000</li>
                  <li>• Additional surcharge: 6% (ADS)</li>
                </ul>
                <Link
                  href="/scotland"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
                >
                  LBTT Calculator
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Wales Card */}
              <div className="gradient-card rounded-2xl p-6 card-hover">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
                  Wales (LTT)
                </h3>
                <ul className="text-sm text-slate-400 space-y-2 mb-4">
                  <li>• Nil rate: £225,000</li>
                  <li>• No FTB relief</li>
                  <li>• Additional surcharge: 4%</li>
                </ul>
                <Link
                  href="/wales"
                  className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1"
                >
                  LTT Calculator
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* London Section */}
          <section className="mb-16" id="london">
            <h2 className="text-3xl font-bold text-white mb-6">
              London Stamp Duty Calculator
            </h2>
            <div className="gradient-card rounded-2xl p-8">
              <p className="text-slate-300 mb-6">
                While stamp duty rates are the same across England, London&apos;s higher property
                prices mean buyers typically pay significantly more in absolute terms. The
                average London property price is around £530,000 - well above the UK average
                of £290,000.
              </p>

              <h3 className="font-bold text-white mb-4">Typical London Stamp Duty by Area</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { area: "Zone 1-2", price: "£750,000", duty: "£25,000", color: "blue" },
                  { area: "Zone 3-4", price: "£550,000", duty: "£15,000", color: "purple" },
                  { area: "Zone 5-6", price: "£450,000", duty: "£10,000", color: "emerald" },
                  { area: "Greater London", price: "£350,000", duty: "£5,000", color: "amber" },
                ].map((item) => (
                  <div
                    key={item.area}
                    className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50"
                  >
                    <p className="text-xs text-slate-500 mb-1">{item.area}</p>
                    <p className="font-bold text-white text-lg">{item.price}</p>
                    <p className={`text-${item.color}-400 font-mono text-sm`}>
                      SDLT: {item.duty}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/london"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
              >
                Use London Calculator
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* All Calculators Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              All Stamp Duty Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: "/first-time-buyer", title: "First-Time Buyer", desc: "Calculate FTB relief savings", icon: "🏠", color: "emerald" },
                { href: "/second-home", title: "Second Home", desc: "Additional property surcharge", icon: "🏡", color: "red" },
                { href: "/buy-to-let", title: "Buy-to-Let", desc: "Landlord & investor calculator", icon: "📊", color: "orange" },
                { href: "/scotland", title: "Scotland LBTT", desc: "Land & Buildings Transaction Tax", icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", color: "purple" },
                { href: "/wales", title: "Wales LTT", desc: "Land Transaction Tax", icon: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", color: "red" },
                { href: "/london", title: "London Calculator", desc: "London property examples", icon: "🌆", color: "blue" },
                { href: "/commercial", title: "Commercial Property", desc: "Non-residential SDLT rates", icon: "🏢", color: "slate" },
                { href: "/holiday-let", title: "Holiday Let", desc: "Short-term rental properties", icon: "🏖️", color: "teal" },
                { href: "/refund", title: "Refund Calculator", desc: "Claim back overpaid SDLT", icon: "💰", color: "emerald" },
              ].map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="gradient-card rounded-xl p-5 card-hover group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{calc.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {calc.title}
                      </h3>
                      <p className="text-sm text-slate-400">{calc.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQs Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Stamp Duty FAQ
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="gradient-card rounded-xl group"
                >
                  <summary className="flex justify-between items-center cursor-pointer p-5 font-medium text-white">
                    {faq.question}
                    <span className="ml-2 transition-transform group-open:rotate-180 text-slate-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-400 border-t border-slate-700/50 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Authoritative External Resources Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Official & Authoritative Resources
            </h2>
            <p className="text-slate-400 mb-6">
              For official guidance and comprehensive information, we recommend these authoritative sources:
            </p>
            <div className="gradient-card rounded-2xl divide-y divide-slate-700/50">
              {AUTHORITATIVE_LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 hover:bg-blue-500/5 transition-colors group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700/50">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-3">
                      {link.label}
                      <span className={`text-xs font-medium px-2 py-0.5 ${link.badgeColor} text-white rounded`}>
                        {link.badge}
                      </span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {link.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* How Stamp Duty Works Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              How Stamp Duty is Calculated
            </h2>
            <div className="gradient-card rounded-2xl p-8">
              <p className="text-slate-300 mb-6">
                Stamp Duty Land Tax works on a tiered or &quot;slice&quot; system. You don&apos;t pay a single
                rate on the entire purchase price. Instead, you pay different rates on different
                portions of the property value. This is similar to how income tax bands work.
              </p>

              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-white mb-4">Example: £500,000 Property (Standard Rate)</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>£0 - £250,000 @ 0%</span>
                    <span className="text-emerald-400">£0</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>£250,001 - £500,000 @ 5%</span>
                    <span className="text-blue-400">£12,500</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-bold">
                    <span>Total SDLT</span>
                    <span className="text-xl">£12,500</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-400">
                This progressive system means the effective tax rate increases with property value,
                but even expensive properties benefit from the lower rates on the initial portion.
                A £1 million property pays 0% on the first £250,000 and 5% on the next £675,000,
                not 10% on everything.
              </p>
            </div>
          </section>

          {/* Related Property Tools */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Related Property Calculators
            </h2>
            <p className="text-slate-400 mb-6">
              Planning your property purchase? These calculators can help you understand the full costs:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://mortgagecalculator.quest"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-card rounded-xl p-5 card-hover group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🏦</span>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Mortgage Calculator
                    </h3>
                    <p className="text-sm text-slate-400">Calculate monthly payments, compare rates, and understand affordability</p>
                  </div>
                </div>
              </a>
              <a
                href="https://rentvsbuycalculator.quest"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-card rounded-xl p-5 card-hover group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      Rent vs Buy Calculator
                    </h3>
                    <p className="text-sm text-slate-400">Compare the true cost of renting versus buying over time</p>
                  </div>
                </div>
              </a>
              <a
                href="https://childcarecalculator.quest"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-card rounded-xl p-5 card-hover group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">👶</span>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      Childcare Calculator
                    </h3>
                    <p className="text-sm text-slate-400">Calculate childcare costs and tax-free childcare entitlement</p>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-16">
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Disclaimer
              </h3>
              <p className="text-sm text-slate-500">
                This stamp duty calculator provides estimates based on current SDLT, LBTT, and LTT
                rates and thresholds. While we strive to keep information accurate and up-to-date,
                tax rules can change. This calculator is for guidance only and should not be
                considered professional tax advice. Always consult with a qualified solicitor,
                conveyancer, or tax professional for official guidance on your specific situation.
              </p>
              <p className="text-sm text-slate-600 mt-3">
                Last updated: January 2025. Rates verified against official HMRC, Revenue Scotland,
                and Welsh Revenue Authority sources.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Voice transcript notification */}
      {voiceMessage && (
        <div className="fixed bottom-40 right-6 z-50 max-w-xs bg-slate-800 rounded-lg shadow-lg p-4 border border-slate-700">
          <p className="text-xs text-slate-500 mb-1">Voice:</p>
          <p className="text-sm text-slate-300">{voiceMessage}</p>
        </div>
      )}

      {/* Floating action buttons - bottom right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Chat button to open sidebar */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
            title="Open AI Assistant"
            aria-label="Open AI Assistant"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}

        {/* Voice Input */}
        <VoiceInput
          onMessage={handleVoiceMessage}
          userName={firstName}
          userId={user?.id}
          userEmail={user?.email}
        />
      </div>

      {/* CopilotSidebar - collapsed by default */}
      <CopilotSidebar
        instructions={SYSTEM_PROMPT}
        labels={{
          title: "Stamp Duty Assistant",
          initial: firstName
            ? `Hi ${firstName}! I can help you calculate stamp duty for your property purchase. Tell me the price and location.`
            : "Hi! I can help you calculate stamp duty for your property purchase. Tell me the property price and location, and I'll work out what you'll pay.",
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
        onSetOpen={setSidebarOpen}
      />
    </div>
  );
}
