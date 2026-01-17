"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, CalculationBreakdown } from "@/components/charts";
import { BUY_TO_LET_PROMPT } from "@/lib/prompts";

const BTL_RATES = [
  { threshold: 0, rate: 5, label: "Up to £250,000" },
  { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 17, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "What is the buy-to-let stamp duty surcharge?",
    answer:
      "If you're buying a buy-to-let property and already own another property, you'll pay an additional 5% on top of standard SDLT rates. This surcharge applies to the entire purchase price, not just amounts above certain thresholds. For example, on a £300,000 buy-to-let, you'd pay the standard rate PLUS 5% of £300,000 (£15,000) as a surcharge.",
  },
  {
    question: "Do I pay the surcharge on my first buy-to-let?",
    answer:
      "Yes, if you already own a residential property (including your main home), you'll pay the 5% surcharge on any buy-to-let purchase. The surcharge applies whenever you'll own two or more properties after the purchase completes.",
  },
  {
    question: "Is it better to buy a BTL through a limited company?",
    answer:
      "Buying through a limited company has tax implications beyond stamp duty. Companies pay the 5% surcharge too, and for properties over £500,000, there's a potential 15% flat rate. However, companies can offset mortgage interest against profits, which individuals can't do as effectively since 2020. Consult a tax advisor for your specific situation.",
  },
  {
    question: "Can I claim first-time buyer relief on a buy-to-let?",
    answer:
      "No. First-time buyer relief only applies to properties you intend to live in as your main residence. Buy-to-let properties do not qualify, even if it's your first property purchase.",
  },
  {
    question: "What if I'm replacing my only buy-to-let property?",
    answer:
      "If you're selling your only buy-to-let and buying a replacement within 3 years, you can claim a refund of the 5% surcharge. You must have lived in your main residence throughout and the sold property must have been your only additional property.",
  },
  {
    question: "Do holiday lets pay the same stamp duty as buy-to-lets?",
    answer:
      "Yes, holiday lets are treated the same as buy-to-lets for stamp duty purposes. The 5% additional property surcharge applies. However, Furnished Holiday Lets (FHLs) have different income tax treatment.",
  },
];

const RELATED_PAGES = [
  {
    label: "Second Home Calculator",
    href: "/second-home",
    description: "Calculate stamp duty for second homes with the 5% surcharge",
  },
  {
    label: "Investment Property Calculator",
    href: "/investment-property",
    description: "Compare buy-to-let vs other investment property options",
  },
  {
    label: "Stamp Duty Refund",
    href: "/refund",
    description: "Check if you can claim back the additional 5% surcharge",
  },
  {
    label: "Scotland LBTT Calculator",
    href: "/scotland",
    description: "Scottish buy-to-let rates with 6% ADS surcharge",
  },
];

export default function BuyToLetPage() {
  return (
    <PageLayout
      title="Buy-to-Let Stamp Duty Calculator 2025"
      subtitle="Calculate SDLT on BTL property purchases including the 5% surcharge"
      systemPrompt={BUY_TO_LET_PROMPT}
      initialMessage="I can help you calculate stamp duty for your buy-to-let purchase. What's the property price you're considering?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Buy-to-Let", href: "/buy-to-let" }]}
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
            Buy-to-let purchases are subject to a <strong>5% surcharge</strong> on
            top of standard SDLT rates. This applies to the entire purchase price
            from £0, not just amounts above thresholds.
          </p>
          <ul>
            <li>Applies if you already own any residential property</li>
            <li>No first-time buyer relief available for BTL</li>
            <li>Same surcharge applies to second homes and holiday lets</li>
          </ul>
        </InfoBox>
      </section>

      {/* BTL Rates Chart */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Buy-to-Let SDLT Rates 2025
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          These rates include the 5% additional property surcharge that applies to
          all buy-to-let purchases when you already own property.
        </p>
        <SDLTRatesChart
          title="BTL Stamp Duty Rates (with 5% surcharge)"
          bands={BTL_RATES}
          note="Rates include the 5% additional property surcharge. Standard rates are 5% lower on each band."
          variant="england"
        />
      </section>

      {/* Example Calculations */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Example Buy-to-Let Calculations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculationBreakdown
            propertyPrice={250000}
            buyerType="additional"
            region="england"
          />
          <CalculationBreakdown
            propertyPrice={400000}
            buyerType="additional"
            region="england"
          />
        </div>
      </section>

      {/* Comparison Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          BTL vs Standard Rates Comparison
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
                  BTL Rate
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Extra Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {[200000, 300000, 400000, 500000, 750000, 1000000].map((price) => {
                const standard = calculateStandardSDLT(price);
                const btl = calculateBTLSDLT(price);
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
                      £{btl.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-amber-600 dark:text-amber-400">
                      +£{(btl - standard).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Company Purchase Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Buying Through a Limited Company
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Some landlords buy properties through a limited company (SPV). The stamp
            duty implications are:
          </p>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>
                <strong>5% surcharge still applies</strong> - companies pay the same
                additional rate as individuals
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>
                <strong>15% flat rate</strong> - applies to residential properties
                over £500,000 bought by companies (with some exemptions for
                property rental businesses)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>
                <strong>ATED</strong> - Annual Tax on Enveloped Dwellings may apply
                to company-owned properties over £500,000
              </span>
            </li>
          </ul>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 italic">
            Consult a tax advisor before deciding between personal and company
            ownership.
          </p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Understanding Buy-to-Let Stamp Duty in 2025</h2>
        <p>
          When purchasing a buy-to-let property in England or Northern Ireland,
          you'll pay Stamp Duty Land Tax (SDLT) at higher rates than standard
          residential purchases. The government introduced the 3% surcharge (now 5%
          from October 2024) to cool the buy-to-let market and help first-time
          buyers compete.
        </p>

        <h3>Who Pays the BTL Surcharge?</h3>
        <p>
          You'll pay the additional 5% stamp duty surcharge if, at the end of the
          day of purchase, you own two or more residential properties. This
          includes:
        </p>
        <ul>
          <li>Buying your first buy-to-let while owning your home</li>
          <li>Adding to an existing property portfolio</li>
          <li>Buying a second home or holiday home</li>
          <li>Properties owned abroad (they count too)</li>
        </ul>

        <h3>When the Surcharge Doesn't Apply</h3>
        <ul>
          <li>Properties worth less than £40,000</li>
          <li>Caravans, mobile homes, and houseboats</li>
          <li>Replacing your only or main residence (within 3 years)</li>
        </ul>

        <h3>Scotland and Wales</h3>
        <p>
          If your buy-to-let is in Scotland, you'll pay Land and Buildings
          Transaction Tax (LBTT) with a 6% Additional Dwelling Supplement (ADS) -
          higher than England's 5% surcharge.
        </p>
        <p>
          In Wales, you'll pay Land Transaction Tax (LTT) with a 4% higher rate
          for additional properties.
        </p>
      </section>
    </PageLayout>
  );
}

// Helper functions for the comparison table
function calculateStandardSDLT(price: number): number {
  let tax = 0;
  if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
  if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  return Math.round(tax);
}

function calculateBTLSDLT(price: number): number {
  // BTL adds 5% to entire price plus standard rates
  const surcharge = price * 0.05;
  return calculateStandardSDLT(price) + surcharge;
}
