"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, CalculationBreakdown } from "@/components/charts";
import { SCOTLAND_PROMPT } from "@/lib/prompts";

const LBTT_STANDARD_RATES = [
  { threshold: 0, rate: 0, label: "Up to £145,000" },
  { threshold: 145000, rate: 2, label: "£145,001 to £250,000" },
  { threshold: 250000, rate: 5, label: "£250,001 to £325,000" },
  { threshold: 325000, rate: 10, label: "£325,001 to £750,000" },
  { threshold: 750000, rate: 12, label: "Over £750,000" },
];

const LBTT_FTB_RATES = [
  { threshold: 0, rate: 0, label: "Up to £175,000" },
  { threshold: 175000, rate: 2, label: "£175,001 to £250,000" },
  { threshold: 250000, rate: 5, label: "£250,001 to £325,000" },
  { threshold: 325000, rate: 10, label: "£325,001 to £750,000" },
  { threshold: 750000, rate: 12, label: "Over £750,000" },
];

const LBTT_ADS_RATES = [
  { threshold: 0, rate: 6, label: "Up to £145,000" },
  { threshold: 145000, rate: 8, label: "£145,001 to £250,000" },
  { threshold: 250000, rate: 11, label: "£250,001 to £325,000" },
  { threshold: 325000, rate: 16, label: "£325,001 to £750,000" },
  { threshold: 750000, rate: 18, label: "Over £750,000" },
];

const FAQS = [
  {
    question: "What is LBTT?",
    answer:
      "Land and Buildings Transaction Tax (LBTT) is Scotland's equivalent of stamp duty. It replaced UK Stamp Duty Land Tax in Scotland from April 2015. LBTT is managed by Revenue Scotland, not HMRC.",
  },
  {
    question: "What is the Additional Dwelling Supplement (ADS)?",
    answer:
      "ADS is Scotland's surcharge for additional properties, similar to England's 5% surcharge but at 6%. It applies when you buy a second home, buy-to-let, or any additional residential property while already owning one. ADS is calculated on the total purchase price.",
  },
  {
    question: "Is there first-time buyer relief in Scotland?",
    answer:
      "Yes. First-time buyers in Scotland pay no LBTT on the first £175,000 (compared to £145,000 for other buyers). Unlike England, there's no maximum property price limit - you get the relief regardless of what the property costs.",
  },
  {
    question: "How is LBTT different from SDLT in England?",
    answer:
      "LBTT has different rate bands and thresholds than England's SDLT. Scotland's ADS is 6% vs England's 5%. Scotland has no price cap for first-time buyer relief. LBTT is administered by Revenue Scotland, while SDLT is managed by HMRC.",
  },
  {
    question: "Can I get a refund of ADS?",
    answer:
      "Yes. If you paid ADS when buying a new main residence but sold your previous main home within 18 months, you can apply for an ADS refund. This is shorter than England's 3-year window. You must apply within 5 years.",
  },
  {
    question: "When do I pay LBTT?",
    answer:
      "LBTT must be paid within 30 days of the 'effective date' of the transaction (usually completion). Your solicitor typically handles the LBTT return and payment as part of the conveyancing process.",
  },
];

const RELATED_PAGES = [
  {
    label: "England SDLT Calculator",
    href: "/",
    description: "Compare with England and Northern Ireland rates",
  },
  {
    label: "Wales LTT Calculator",
    href: "/wales",
    description: "Calculate Land Transaction Tax for Wales",
  },
  {
    label: "Second Home Calculator",
    href: "/second-home",
    description: "Calculate ADS for additional properties",
  },
  {
    label: "First-Time Buyer Calculator",
    href: "/first-time-buyer",
    description: "Compare FTB relief across UK regions",
  },
];

export default function ScotlandPage() {
  return (
    <PageLayout
      title="Scotland LBTT Calculator 2025"
      subtitle="Calculate Land and Buildings Transaction Tax for Scottish properties"
      systemPrompt={SCOTLAND_PROMPT}
      initialMessage="I can help you calculate LBTT for a Scottish property. What's the purchase price you're considering?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Scotland", href: "/scotland" }]}
      relatedPages={RELATED_PAGES}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator defaultRegion="scotland" />
      </section>

      {/* Key Info Box */}
      <section className="mb-8">
        <InfoBox variant="info" title="Land and Buildings Transaction Tax (LBTT)">
          <p>
            Scotland has its own property tax system called LBTT, managed by Revenue
            Scotland. Key differences from England's SDLT:
          </p>
          <ul>
            <li>
              <strong>Higher ADS:</strong> 6% surcharge vs England's 5%
            </li>
            <li>
              <strong>FTB relief:</strong> No price cap (England caps at £625k)
            </li>
            <li>
              <strong>Refund window:</strong> 18 months vs England's 3 years
            </li>
          </ul>
        </InfoBox>
      </section>

      {/* LBTT Rates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          LBTT Rates 2025
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SDLTRatesChart
            title="Standard Rates"
            bands={LBTT_STANDARD_RATES}
            note="For standard residential purchases"
            variant="scotland"
          />
          <SDLTRatesChart
            title="First-Time Buyer Rates"
            bands={LBTT_FTB_RATES}
            note="£30,000 higher nil rate band"
            variant="scotland"
          />
          <SDLTRatesChart
            title="With ADS (6%)"
            bands={LBTT_ADS_RATES}
            note="For additional properties"
            variant="scotland"
          />
        </div>
      </section>

      {/* ADS Explained */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Additional Dwelling Supplement (ADS)
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Scotland's ADS is a <strong>6% surcharge</strong> on additional
            residential properties. It's higher than England's 5% surcharge.
          </p>

          <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
            When ADS Applies:
          </h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Buying a second home while owning another property</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Purchasing a buy-to-let investment property</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Buying any additional residential property</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Properties owned anywhere in the world count</span>
            </li>
          </ul>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-purple-800 dark:text-purple-300 text-sm">
              <strong>Example:</strong> On a £300,000 second home in Scotland, you'd
              pay £4,600 LBTT plus £18,000 ADS (6% of £300,000) = £22,600 total.
            </p>
          </div>
        </div>
      </section>

      {/* Example Calculations */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Example Calculations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculationBreakdown
            propertyPrice={250000}
            buyerType="standard"
            region="scotland"
          />
          <CalculationBreakdown
            propertyPrice={400000}
            buyerType="additional"
            region="scotland"
          />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          LBTT vs England SDLT Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Property Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Scotland LBTT
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  England SDLT
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              {[200000, 300000, 400000, 500000, 750000].map((price) => {
                const lbtt = calculateLBTT(price);
                const sdlt = calculateSDLT(price);
                const diff = lbtt - sdlt;
                return (
                  <tr
                    key={price}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                      £{price.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-purple-600 dark:text-purple-400">
                      £{lbtt.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-blue-600 dark:text-blue-400">
                      £{sdlt.toLocaleString()}
                    </td>
                    <td
                      className={`p-4 text-right font-mono ${
                        diff > 0
                          ? "text-red-600 dark:text-red-400"
                          : diff < 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {diff > 0 ? "+" : ""}£{diff.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          Standard rates comparison. Scotland often has lower LBTT for properties
          under ~£330,000.
        </p>
      </section>

      {/* ADS Refund */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Claiming an ADS Refund
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            If you paid ADS when buying a new main home, you may be able to claim it
            back if you sell your previous main home within{" "}
            <strong>18 months</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                Eligibility
              </h3>
              <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                <li>• New property is your main residence</li>
                <li>• Old property was your main residence</li>
                <li>• Sold old property within 18 months</li>
                <li>• Claim within 5 years of buying</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                How to Claim
              </h3>
              <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                <li>• Submit claim to Revenue Scotland</li>
                <li>• Provide transaction details</li>
                <li>• Online or postal applications</li>
                <li>• Refund typically within 20 days</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              <strong>Note:</strong> Scotland's 18-month window is shorter than
              England's 3-year window. Plan your sale timing carefully.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Understanding LBTT in Scotland</h2>
        <p>
          Land and Buildings Transaction Tax (LBTT) is the Scottish equivalent of
          stamp duty, having replaced UK Stamp Duty Land Tax in Scotland from 1
          April 2015. It's a progressive tax, meaning you pay different rates on
          different portions of the purchase price.
        </p>

        <h3>How LBTT Differs from English SDLT</h3>
        <p>
          While the basic structure is similar, there are important differences.
          Scotland's rates and thresholds vary from England's, and the Additional
          Dwelling Supplement (ADS) at 6% is higher than England's 5% surcharge.
          First-time buyer relief in Scotland has no property price cap, unlike
          England's £625,000 limit.
        </p>

        <h3>Revenue Scotland</h3>
        <p>
          LBTT is administered by Revenue Scotland, not HMRC. This means different
          processes for filing returns, paying tax, and claiming refunds. Your
          Scottish solicitor will handle the LBTT return as part of the purchase
          process.
        </p>

        <h3>When to Use This Calculator</h3>
        <p>
          Use this calculator for any residential property purchase in Scotland.
          Remember to select the correct buyer type - first-time buyer, standard, or
          additional property - as this significantly affects the tax due.
        </p>
      </section>
    </PageLayout>
  );
}

// Helper functions
function calculateLBTT(price: number): number {
  let tax = 0;
  if (price > 145000) tax += Math.min(price - 145000, 105000) * 0.02;
  if (price > 250000) tax += Math.min(price - 250000, 75000) * 0.05;
  if (price > 325000) tax += Math.min(price - 325000, 425000) * 0.1;
  if (price > 750000) tax += (price - 750000) * 0.12;
  return Math.round(tax);
}

function calculateSDLT(price: number): number {
  let tax = 0;
  if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
  if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  return Math.round(tax);
}
