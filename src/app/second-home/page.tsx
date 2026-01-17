"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, RegionComparisonChart } from "@/components/charts";
import { SECOND_HOME_PROMPT } from "@/lib/prompts";

const SECOND_HOME_RATES_ENGLAND = [
  { threshold: 0, rate: 5, label: "Up to £250,000" },
  { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 17, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "What counts as a second home for stamp duty purposes?",
    answer:
      "A second home is any additional residential property you buy while still owning another residential property. This includes holiday homes, investment properties, buy-to-lets, and properties bought for family members. Even properties owned overseas count towards the surcharge.",
  },
  {
    question: "What is the second home stamp duty surcharge?",
    answer:
      "In England and Northern Ireland, you pay an additional 5% on top of standard SDLT rates when buying a second home. This applies to the entire purchase price, starting from £0. In Scotland, the Additional Dwelling Supplement (ADS) is 6%, and in Wales, the higher rate surcharge is 4%.",
  },
  {
    question: "Can I avoid the second home surcharge?",
    answer:
      "There are limited exemptions: properties under £40,000 are exempt, and you won't pay the surcharge if you're replacing your only or main residence (you must sell the old one within 3 years). Mobile homes, caravans, and houseboats are also exempt.",
  },
  {
    question: "Can I get a refund of the surcharge?",
    answer:
      "Yes, if you paid the 5% surcharge when buying your new main residence but then sold your previous main residence within 3 years, you can claim a refund. You must apply to HMRC within 12 months of selling your old property.",
  },
  {
    question: "Do married couples pay the surcharge on a second home?",
    answer:
      "Yes, married couples and civil partners are treated as one unit. If either partner owns a property, any new purchase will attract the surcharge unless the existing property is being replaced as your main residence.",
  },
  {
    question: "What is the Additional Dwelling Supplement (ADS) in Scotland?",
    answer:
      "Scotland's ADS is a 6% surcharge on additional properties, higher than England's 5%. It applies to the total purchase price of residential properties over £40,000 when the buyer already owns one or more properties.",
  },
];

const RELATED_PAGES = [
  {
    label: "Buy-to-Let Calculator",
    href: "/buy-to-let",
    description: "Calculate stamp duty for rental investment properties",
  },
  {
    label: "Holiday Let Calculator",
    href: "/holiday-let",
    description: "Stamp duty rates for furnished holiday let purchases",
  },
  {
    label: "Stamp Duty Refund",
    href: "/refund",
    description: "Check if you can reclaim the additional surcharge",
  },
  {
    label: "Scotland LBTT Calculator",
    href: "/scotland",
    description: "Calculate Scottish ADS at 6% surcharge rate",
  },
];

export default function SecondHomePage() {
  return (
    <PageLayout
      title="Second Home Stamp Duty Calculator 2025"
      subtitle="Calculate SDLT on additional properties including the 5% surcharge"
      systemPrompt={SECOND_HOME_PROMPT}
      initialMessage="I can help you calculate stamp duty for your second home. What's the property price and where is it located?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Second Home", href: "/second-home" }]}
      relatedPages={RELATED_PAGES}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator defaultBuyerType="additional" />
      </section>

      {/* Key Info Box */}
      <section className="mb-8">
        <InfoBox variant="warning" title="5% Additional Property Surcharge">
          <p>
            When buying a second home in England or Northern Ireland, you pay an
            additional <strong>5% surcharge</strong> on top of standard SDLT rates.
            This applies to the <strong>entire purchase price</strong>, starting from
            £0.
          </p>
          <ul>
            <li>England & NI: 5% surcharge on all bands</li>
            <li>Scotland: 6% Additional Dwelling Supplement (ADS)</li>
            <li>Wales: 4% higher rate surcharge</li>
          </ul>
        </InfoBox>
      </section>

      {/* Second Home Rates Chart */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Second Home SDLT Rates 2025
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          These rates apply when you already own a residential property and are
          buying an additional one. The surcharge is added to every band.
        </p>
        <SDLTRatesChart
          title="Second Home Stamp Duty Rates (England & NI)"
          bands={SECOND_HOME_RATES_ENGLAND}
          note="Includes 5% additional property surcharge. Scotland has 6% ADS, Wales has 4% higher rates."
          variant="england"
        />
      </section>

      {/* Regional Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Compare Second Home Rates by Region
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          See how stamp duty on a £400,000 second home compares across UK regions.
        </p>
        <RegionComparisonChart propertyPrice={400000} showAdditional={true} />
      </section>

      {/* Refund Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Claiming a Stamp Duty Refund
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            If you paid the 5% surcharge when buying your new main home, you may be
            eligible for a refund if you sell your previous main residence within 3
            years.
          </p>

          <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
            Eligibility Requirements:
          </h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>You paid the higher rate (surcharge) when buying your new home</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Your old property was your main residence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>You sold your old property within 3 years of buying the new one</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>You claim within 12 months of selling (or 12 months from the filing deadline)</span>
            </li>
          </ul>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-300 text-sm">
              <strong>Example:</strong> You buy a £500,000 second home while owning
              your old house. You pay £37,500 stamp duty (including £25,000
              surcharge). You sell your old house 18 months later. You can claim back
              the £25,000 surcharge from HMRC.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Second Home vs Standard Rates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Property Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Standard Rate
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Second Home
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Surcharge Paid
                </th>
              </tr>
            </thead>
            <tbody>
              {[250000, 350000, 500000, 750000, 1000000].map((price) => {
                const standard = calculateStandardSDLT(price);
                const secondHome = calculateSecondHomeSDLT(price);
                const surcharge = price * 0.05;
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
                    <td className="p-4 text-right font-mono text-red-600 dark:text-red-400">
                      £{secondHome.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-amber-600 dark:text-amber-400">
                      £{surcharge.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Exemptions */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          When the Surcharge Doesn't Apply
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              Low Value Properties
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Properties under £40,000 are exempt from the additional surcharge.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              Replacing Main Residence
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              If you're replacing your only/main residence and sell within 3 years,
              you can claim a refund.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              Mobile Homes & Caravans
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Caravans, mobile homes, and houseboats are not subject to the
              additional surcharge.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              Inherited Properties
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Properties inherited in the last 3 years (with less than 50% share)
              may be disregarded.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Understanding Second Home Stamp Duty in 2025</h2>
        <p>
          If you're buying a second home, holiday property, or any additional
          residential property in the UK, you'll face higher stamp duty rates than
          standard purchasers. The government introduced the additional dwelling
          surcharge in 2016 to help cool the property market and give first-time
          buyers a better chance.
        </p>

        <h3>The 5% Surcharge Explained</h3>
        <p>
          In England and Northern Ireland, the surcharge is 5% and applies to the
          entire purchase price. Unlike standard stamp duty bands which apply to
          portions of the price, the 5% surcharge is calculated on the whole amount.
          For a £500,000 property, that's an extra £25,000 in tax.
        </p>

        <h3>Regional Differences</h3>
        <p>
          Scotland's Additional Dwelling Supplement (ADS) is 6% - higher than
          England. Wales applies a 4% higher rate to additional properties. These
          rates are set by the devolved governments and may change independently of
          England's SDLT rates.
        </p>

        <h3>Planning Ahead</h3>
        <p>
          If you're buying a new main residence before selling your old one, consider
          the timing carefully. The 3-year window for refunds gives you flexibility,
          but market conditions may affect how quickly you can sell. Our calculator
          helps you understand the full cost so you can plan accordingly.
        </p>
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

function calculateSecondHomeSDLT(price: number): number {
  const surcharge = price * 0.05;
  return calculateStandardSDLT(price) + surcharge;
}
