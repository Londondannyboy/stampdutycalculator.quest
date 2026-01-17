"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, CalculationBreakdown } from "@/components/charts";
import { FIRST_TIME_BUYER_PROMPT } from "@/lib/prompts";

const FTB_RATES_ENGLAND = [
  { threshold: 0, rate: 0, label: "Up to £425,000" },
  { threshold: 425000, rate: 5, label: "£425,001 to £625,000" },
];

const STANDARD_RATES = [
  { threshold: 0, rate: 0, label: "Up to £250,000" },
  { threshold: 250000, rate: 5, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 10, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 12, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "What is first-time buyer stamp duty relief?",
    answer:
      "First-time buyer relief means you pay no stamp duty on the first £425,000 of a property purchase in England and Northern Ireland. You then pay 5% on the portion between £425,001 and £625,000. This relief can save you up to £11,250 compared to standard rates.",
  },
  {
    question: "Who qualifies as a first-time buyer?",
    answer:
      "To qualify, you must never have owned a property or a share in a property anywhere in the world. This includes inherited properties. If you're buying jointly, BOTH buyers must be first-time buyers - if one person has owned property before, neither can claim the relief.",
  },
  {
    question: "Is there a price limit for first-time buyer relief?",
    answer:
      "Yes. In England and NI, the property must cost £625,000 or less to qualify for any first-time buyer relief. If your property costs £625,001 or more, you pay standard stamp duty rates on the entire purchase - no relief applies at all.",
  },
  {
    question: "Does first-time buyer relief apply in Scotland?",
    answer:
      "Yes, but with different thresholds. In Scotland, first-time buyers pay no LBTT on the first £175,000 (vs £145,000 for other buyers). There's no maximum property price limit in Scotland.",
  },
  {
    question: "Does Wales offer first-time buyer relief?",
    answer:
      "No. Wales does not have specific first-time buyer relief for Land Transaction Tax (LTT). First-time buyers in Wales pay the same rates as everyone else.",
  },
  {
    question: "Can I claim relief if I'm buying a buy-to-let as a first-time buyer?",
    answer:
      "No. First-time buyer relief only applies to properties you intend to live in as your main residence. Buy-to-lets and investment properties don't qualify, even if it's your first property purchase.",
  },
];

const RELATED_PAGES = [
  {
    label: "Standard Calculator",
    href: "/",
    description: "Compare with standard SDLT rates",
  },
  {
    label: "Scotland LBTT Calculator",
    href: "/scotland",
    description: "Scottish first-time buyer relief with LBTT",
  },
  {
    label: "Wales LTT Calculator",
    href: "/wales",
    description: "Wales has no FTB relief - check standard rates",
  },
  {
    label: "London Calculator",
    href: "/london",
    description: "Calculate SDLT for London property purchases",
  },
];

export default function FirstTimeBuyerPage() {
  return (
    <PageLayout
      title="First-Time Buyer Stamp Duty Calculator 2025"
      subtitle="Calculate your SDLT savings with first-time buyer relief"
      systemPrompt={FIRST_TIME_BUYER_PROMPT}
      initialMessage="I can help you calculate stamp duty as a first-time buyer. What's the property price you're considering?"
      faqs={FAQS}
      breadcrumbs={[{ label: "First-Time Buyer", href: "/first-time-buyer" }]}
      relatedPages={RELATED_PAGES}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator defaultBuyerType="first-time" />
      </section>

      {/* Key Info Box */}
      <section className="mb-8">
        <InfoBox variant="success" title="First-Time Buyer Relief">
          <p>
            As a first-time buyer in England or Northern Ireland, you pay{" "}
            <strong>no stamp duty</strong> on the first £425,000 of your property
            purchase. You only pay 5% on the portion between £425,001 and £625,000.
          </p>
          <ul>
            <li>
              <strong>Maximum saving:</strong> £11,250 compared to standard rates
            </li>
            <li>
              <strong>Price limit:</strong> Properties over £625,000 don't qualify
            </li>
            <li>
              <strong>Joint purchases:</strong> Both buyers must be first-time buyers
            </li>
          </ul>
        </InfoBox>
      </section>

      {/* Savings Calculator */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          How Much Could You Save?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Property Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Standard SDLT
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  FTB Rate
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  You Save
                </th>
              </tr>
            </thead>
            <tbody>
              {[300000, 400000, 425000, 500000, 625000].map((price) => {
                const standard = calculateStandardSDLT(price);
                const ftb = calculateFTBSDLT(price);
                const saving = standard - ftb;
                return (
                  <tr
                    key={price}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                      £{price.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-900 dark:text-zinc-100">
                      £{standard.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-green-600 dark:text-green-400">
                      £{ftb.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-green-600 dark:text-green-400">
                      £{saving.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          Note: Properties over £625,000 do not qualify for first-time buyer relief
          and pay standard rates.
        </p>
      </section>

      {/* FTB vs Standard Rates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          First-Time Buyer vs Standard Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SDLTRatesChart
            title="First-Time Buyer Rates"
            bands={FTB_RATES_ENGLAND}
            note="Applies to properties up to £625,000 only"
            variant="england"
          />
          <SDLTRatesChart
            title="Standard Rates"
            bands={STANDARD_RATES}
            note="Applies if you don't qualify for FTB relief"
            variant="england"
          />
        </div>
      </section>

      {/* Example Calculations */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Example Calculations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculationBreakdown
            propertyPrice={450000}
            buyerType="ftb"
            region="england"
          />
          <CalculationBreakdown
            propertyPrice={600000}
            buyerType="ftb"
            region="england"
          />
        </div>
      </section>

      {/* Eligibility Checklist */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Do You Qualify for First-Time Buyer Relief?
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Check all that apply to confirm your eligibility:
          </p>
          <div className="space-y-3">
            {[
              "I have never owned a property or share in a property anywhere in the world",
              "My co-buyer (if any) has also never owned property",
              "The property costs £625,000 or less",
              "I intend to live in the property as my main residence",
              "The property is in England or Northern Ireland (Scotland has different rules)",
            ].map((item, index) => (
              <label
                key={index}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
                  {item}
                </span>
              </label>
            ))}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 italic">
            If all boxes are checked, you likely qualify for first-time buyer relief.
            Always confirm with a solicitor.
          </p>
        </div>
      </section>

      {/* Regional Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          First-Time Buyer Relief by Region
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
              England & NI
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• £0 tax up to £425,000</li>
              <li>• 5% on £425,001-£625,000</li>
              <li>• Max price: £625,000</li>
              <li>• Max saving: £11,250</li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">
              Scotland
            </h3>
            <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
              <li>• £0 tax up to £175,000</li>
              <li>• Standard LBTT above</li>
              <li>• No max price limit</li>
              <li>• Max saving: £600</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800">
            <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">Wales</h3>
            <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
              <li>• No FTB relief</li>
              <li>• Standard LTT rates apply</li>
              <li>• Same as other buyers</li>
              <li>• £0 saving</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>First-Time Buyer Stamp Duty Relief Explained</h2>
        <p>
          The UK government introduced first-time buyer stamp duty relief to help
          people get onto the property ladder. If you've never owned property before
          and you're buying your first home, you could save up to £11,250 in stamp
          duty compared to standard rates.
        </p>

        <h3>How the Relief Works</h3>
        <p>
          In England and Northern Ireland, first-time buyers pay no Stamp Duty Land
          Tax (SDLT) on the first £425,000 of a property purchase. If the property
          costs between £425,001 and £625,000, you pay 5% on just the amount above
          £425,000.
        </p>
        <p>
          <strong>Important:</strong> If your property costs more than £625,000, you
          don't get any first-time buyer relief at all. You pay the full standard
          rates on the entire purchase price.
        </p>

        <h3>Joint Purchases</h3>
        <p>
          If you're buying with someone else, both of you must be first-time buyers
          to claim the relief. If your partner has owned property before (even if
          they sold it years ago), neither of you can claim the relief.
        </p>

        <h3>Properties That Don't Qualify</h3>
        <ul>
          <li>Buy-to-let or investment properties</li>
          <li>Properties over £625,000 in England/NI</li>
          <li>Properties in Wales (no FTB relief available)</li>
          <li>Properties you won't live in as your main home</li>
        </ul>
      </section>
    </PageLayout>
  );
}

// Helper functions
function calculateStandardSDLT(price: number): number {
  let tax = 0;
  if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
  if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  return Math.round(tax);
}

function calculateFTBSDLT(price: number): number {
  if (price > 625000) {
    // No FTB relief for properties over £625,000
    return calculateStandardSDLT(price);
  }
  let tax = 0;
  if (price > 425000) {
    tax = (price - 425000) * 0.05;
  }
  return Math.round(tax);
}
