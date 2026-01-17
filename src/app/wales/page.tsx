"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox } from "@/components/charts";
import { WALES_PROMPT } from "@/lib/prompts";

const LTT_STANDARD_RATES = [
  { threshold: 0, rate: 0, label: "Up to £225,000" },
  { threshold: 225000, rate: 6, label: "£225,001 to £400,000" },
  { threshold: 400000, rate: 7.5, label: "£400,001 to £750,000" },
  { threshold: 750000, rate: 10, label: "£750,001 to £1.5m" },
  { threshold: 1500000, rate: 12, label: "Over £1.5m" },
];

const LTT_HIGHER_RATES = [
  { threshold: 0, rate: 4, label: "Up to £225,000" },
  { threshold: 225000, rate: 10, label: "£225,001 to £400,000" },
  { threshold: 400000, rate: 11.5, label: "£400,001 to £750,000" },
  { threshold: 750000, rate: 14, label: "£750,001 to £1.5m" },
  { threshold: 1500000, rate: 16, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "What is Land Transaction Tax (LTT)?",
    answer:
      "Land Transaction Tax is Wales's property tax, replacing UK Stamp Duty from April 2018. It's managed by the Welsh Revenue Authority (WRA), not HMRC. LTT applies to all residential and commercial property purchases in Wales.",
  },
  {
    question: "Is there first-time buyer relief in Wales?",
    answer:
      "No. Unlike England and Scotland, Wales does not offer first-time buyer relief. All buyers pay the same standard LTT rates regardless of whether they've owned property before.",
  },
  {
    question: "What are the higher rates for additional properties?",
    answer:
      "Wales adds 4% to each LTT band for additional properties (second homes, buy-to-lets). This is lower than Scotland's 6% ADS but comparable to England's pre-October 2024 rates.",
  },
  {
    question: "How does Welsh LTT compare to English SDLT?",
    answer:
      "Wales has a higher nil-rate band (£225,000 vs £250,000) but generally higher rates above that. The additional property surcharge is 4% vs England's 5%. Wales has no first-time buyer relief.",
  },
  {
    question: "When do I need to pay LTT?",
    answer:
      "LTT must be paid within 30 days of the transaction completing. Your solicitor handles the return and payment. Late filing incurs penalties and interest.",
  },
];

const RELATED_PAGES = [
  {
    label: "England SDLT Calculator",
    href: "/",
    description: "Compare with English stamp duty rates",
  },
  {
    label: "Scotland LBTT Calculator",
    href: "/scotland",
    description: "Scottish property tax comparison",
  },
  {
    label: "Second Home Calculator",
    href: "/second-home",
    description: "Calculate higher rates for additional properties",
  },
  {
    label: "First-Time Buyer Info",
    href: "/first-time-buyer",
    description: "Note: Wales has no FTB relief",
  },
];

const EXTERNAL_LINKS = [
  {
    href: "https://www.gov.wales/land-transaction-tax-guide",
    label: "Welsh Revenue Authority - LTT",
    description: "Official LTT guidance from the Welsh Government",
  },
  {
    href: "https://www.gov.wales/land-transaction-tax-rates",
    label: "LTT Rates",
    description: "Current Land Transaction Tax rates for Wales",
  },
  {
    href: "https://www.gov.wales/land-transaction-tax-higher-rates-guide",
    label: "Higher Rates for Additional Properties",
    description: "WRA guidance on higher LTT rates",
  },
];

export default function WalesPage() {
  return (
    <PageLayout
      title="Wales LTT Calculator 2025"
      subtitle="Calculate Land Transaction Tax for Welsh property purchases"
      systemPrompt={WALES_PROMPT}
      initialMessage="I can help you calculate LTT for a Welsh property. What's the purchase price?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Wales", href: "/wales" }]}
      relatedPages={RELATED_PAGES}
      externalLinks={EXTERNAL_LINKS}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator defaultRegion="wales" />
      </section>

      {/* Key Info Box */}
      <section className="mb-8">
        <InfoBox variant="error" title="No First-Time Buyer Relief in Wales">
          <p>
            Unlike England and Scotland, <strong>Wales does not offer</strong>{" "}
            first-time buyer relief. All buyers pay the same standard LTT rates.
          </p>
          <ul>
            <li>Same rates for first-time and repeat buyers</li>
            <li>Higher rates apply for additional properties (+4%)</li>
            <li>Managed by Welsh Revenue Authority, not HMRC</li>
          </ul>
        </InfoBox>
      </section>

      {/* LTT Rates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Welsh LTT Rates 2025
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SDLTRatesChart
            title="Standard Rates"
            bands={LTT_STANDARD_RATES}
            note="Applies to main residence purchases"
            variant="wales"
          />
          <SDLTRatesChart
            title="Higher Rates (+4%)"
            bands={LTT_HIGHER_RATES}
            note="For second homes and buy-to-lets"
            variant="wales"
          />
        </div>
      </section>

      {/* Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          LTT vs SDLT vs LBTT Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Property Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Wales LTT
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  England SDLT
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Scotland LBTT
                </th>
              </tr>
            </thead>
            <tbody>
              {[225000, 300000, 400000, 500000, 750000].map((price) => {
                const ltt = calculateLTT(price);
                const sdlt = calculateSDLT(price);
                const lbtt = calculateLBTT(price);
                return (
                  <tr
                    key={price}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                      £{price.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-red-600 dark:text-red-400">
                      £{ltt.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-blue-600 dark:text-blue-400">
                      £{sdlt.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-purple-600 dark:text-purple-400">
                      £{lbtt.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Understanding Land Transaction Tax in Wales</h2>
        <p>
          Land Transaction Tax (LTT) replaced UK Stamp Duty Land Tax in Wales from
          1 April 2018. It's one of three devolved property taxes in the UK,
          alongside Scotland's LBTT. LTT is managed by the Welsh Revenue Authority
          (WRA).
        </p>

        <h3>Key Differences from England</h3>
        <ul>
          <li>Higher nil-rate band: £225,000 vs £250,000</li>
          <li>No first-time buyer relief</li>
          <li>Lower additional property surcharge: 4% vs 5%</li>
          <li>Different rate bands above the nil-rate threshold</li>
        </ul>

        <h3>Welsh Revenue Authority</h3>
        <p>
          The WRA handles LTT returns and payments. Your solicitor submits the
          return electronically within 30 days of completion. The WRA has powers to
          investigate and audit transactions.
        </p>
      </section>
    </PageLayout>
  );
}

// Helper calculations
function calculateLTT(price: number): number {
  let tax = 0;
  if (price > 225000) tax += Math.min(price - 225000, 175000) * 0.06;
  if (price > 400000) tax += Math.min(price - 400000, 350000) * 0.075;
  if (price > 750000) tax += Math.min(price - 750000, 750000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  return Math.round(tax);
}

function calculateSDLT(price: number): number {
  let tax = 0;
  if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
  if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  return Math.round(tax);
}

function calculateLBTT(price: number): number {
  let tax = 0;
  if (price > 145000) tax += Math.min(price - 145000, 105000) * 0.02;
  if (price > 250000) tax += Math.min(price - 250000, 75000) * 0.05;
  if (price > 325000) tax += Math.min(price - 325000, 425000) * 0.1;
  if (price > 750000) tax += (price - 750000) * 0.12;
  return Math.round(tax);
}
