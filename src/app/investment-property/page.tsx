"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, CalculationBreakdown } from "@/components/charts";
import { INVESTMENT_PROPERTY_PROMPT } from "@/lib/prompts";

const INVESTMENT_RATES = [
  { threshold: 0, rate: 5, label: "Up to £250,000" },
  { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 17, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "What is the stamp duty on investment property?",
    answer:
      "Investment properties are subject to the 5% additional property surcharge on top of standard SDLT rates. This surcharge applies to the entire purchase price from £0, not just amounts above certain thresholds. For example, on a £400,000 investment property, you'd pay £20,000 (5%) as a surcharge plus the standard SDLT amount.",
  },
  {
    question: "Is investment property stamp duty the same as buy-to-let?",
    answer:
      "Yes, investment properties and buy-to-let properties are treated identically for stamp duty purposes. Both attract the 5% additional property surcharge. The key factor is that you'll own more than one residential property after the purchase, regardless of whether you intend to let it out or hold it for capital appreciation.",
  },
  {
    question: "Can I avoid the 5% surcharge on investment property?",
    answer:
      "The surcharge applies if you'll own two or more residential properties after the purchase. The only ways to avoid it are: buying a property under £40,000 (exempt), buying commercial or mixed-use property (different rates apply), or selling your existing property before completing on the new one so you only own one property.",
  },
  {
    question: "Should I buy investment property personally or through a company?",
    answer:
      "Both options have the 5% surcharge, but companies face a potential 15% flat rate for properties over £500,000 (with exemptions for genuine property rental businesses). Companies can offset mortgage interest against profits, which individuals can't do as effectively since 2020. Consider Capital Gains Tax implications too - consult a tax advisor for your specific situation.",
  },
  {
    question: "Does the investment property surcharge apply to my first property?",
    answer:
      "If you're buying your very first property and intend to live in it, no surcharge applies. However, if you're buying an investment property as your first purchase while intending to live elsewhere (e.g., renting your home), the surcharge would apply. The property you intend to occupy as your main residence is the key factor.",
  },
  {
    question: "How does stamp duty affect investment property yields?",
    answer:
      "Stamp duty is a significant upfront cost that reduces your effective yield, especially in the first few years. For example, £22,500 stamp duty on a £300,000 property adds 7.5% to your purchase costs. This is money that could otherwise generate returns, so factor it into your yield calculations when comparing investment opportunities.",
  },
];

const RELATED_PAGES = [
  {
    label: "Stamp Duty Calculator",
    href: "/",
    description: "Calculate stamp duty for any property type in England",
  },
  {
    label: "Buy-to-Let Calculator",
    href: "/buy-to-let",
    description: "Specific calculator for buy-to-let property purchases",
  },
  {
    label: "Second Home Calculator",
    href: "/second-home",
    description: "Calculate stamp duty for second homes with the 5% surcharge",
  },
  {
    label: "Stamp Duty Refund",
    href: "/refund",
    description: "Check if you can claim back the additional 5% surcharge",
  },
];

const EXTERNAL_LINKS = [
  {
    label: "HMRC: Stamp Duty Land Tax",
    href: "https://www.gov.uk/stamp-duty-land-tax",
    description: "Official government guidance on SDLT rates and rules",
  },
  {
    label: "HMRC: Higher rates for additional properties",
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-buying-an-additional-residential-property",
    description: "Detailed guidance on the 5% surcharge",
  },
  {
    label: "HMRC: SDLT relief for property investors",
    href: "https://www.gov.uk/guidance/sdlt-relief-for-property-investors",
    description: "Available reliefs for property investors",
  },
];

export default function InvestmentPropertyPage() {
  return (
    <PageLayout
      title="Investment Property Stamp Duty Calculator 2025"
      subtitle="Calculate SDLT on investment property purchases including the 5% surcharge"
      systemPrompt={INVESTMENT_PROPERTY_PROMPT}
      initialMessage="I can help you calculate stamp duty for your investment property purchase. What's the property price you're considering?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Investment Property", href: "/investment-property" }]}
      relatedPages={RELATED_PAGES}
      externalLinks={EXTERNAL_LINKS}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator defaultBuyerType="additional" />
      </section>

      {/* Key Info Box */}
      <section className="mb-8">
        <InfoBox variant="warning" title="5% Investment Property Surcharge">
          <p>
            Investment property purchases are subject to a <strong>5% surcharge</strong> on
            top of standard SDLT rates. This applies to the entire purchase price
            from £0, not just amounts above thresholds.
          </p>
          <ul>
            <li>Applies if you already own any residential property</li>
            <li>Same rate as buy-to-let and second homes</li>
            <li>No first-time buyer relief available</li>
            <li>Companies may face 15% rate on properties over £500,000</li>
          </ul>
        </InfoBox>
      </section>

      {/* Investment Property Rates Chart */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Investment Property SDLT Rates 2025
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          These rates include the 5% additional property surcharge that applies to
          all investment property purchases when you already own property.
        </p>
        <SDLTRatesChart
          title="Investment Property Stamp Duty Rates (with 5% surcharge)"
          bands={INVESTMENT_RATES}
          note="Rates include the 5% additional property surcharge. Standard rates are 5% lower on each band."
          variant="england"
        />
      </section>

      {/* Example Calculations */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Example Investment Property Calculations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculationBreakdown
            propertyPrice={300000}
            buyerType="additional"
            region="england"
          />
          <CalculationBreakdown
            propertyPrice={500000}
            buyerType="additional"
            region="england"
          />
        </div>
      </section>

      {/* Investment Property vs BTL Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Investment Property vs Buy-to-Let: Stamp Duty Comparison
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            From a stamp duty perspective, investment properties and buy-to-let properties
            are treated identically. Both attract the same 5% surcharge:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                    Factor
                  </th>
                  <th className="text-center p-4 text-zinc-600 dark:text-zinc-400">
                    Investment Property
                  </th>
                  <th className="text-center p-4 text-zinc-600 dark:text-zinc-400">
                    Buy-to-Let
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-4 text-zinc-900 dark:text-zinc-100">
                    5% Surcharge
                  </td>
                  <td className="p-4 text-center text-green-600 dark:text-green-400">Yes</td>
                  <td className="p-4 text-center text-green-600 dark:text-green-400">Yes</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-4 text-zinc-900 dark:text-zinc-100">
                    First-Time Buyer Relief
                  </td>
                  <td className="p-4 text-center text-red-600 dark:text-red-400">No</td>
                  <td className="p-4 text-center text-red-600 dark:text-red-400">No</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-4 text-zinc-900 dark:text-zinc-100">
                    Company 15% Rate (over £500k)
                  </td>
                  <td className="p-4 text-center text-amber-600 dark:text-amber-400">Possible</td>
                  <td className="p-4 text-center text-amber-600 dark:text-amber-400">Possible</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-4 text-zinc-900 dark:text-zinc-100">
                    Refund if Replacing Main Residence
                  </td>
                  <td className="p-4 text-center text-red-600 dark:text-red-400">No</td>
                  <td className="p-4 text-center text-red-600 dark:text-red-400">No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 italic">
            The main differences between investment property and buy-to-let relate to income tax
            treatment, not stamp duty. Consult a tax advisor for guidance on ongoing tax implications.
          </p>
        </div>
      </section>

      {/* Stamp Duty Cost Comparison Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Investment Property Stamp Duty Costs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-slate-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Property Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Standard Rate
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Investment Rate
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Surcharge Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {[200000, 300000, 400000, 500000, 750000, 1000000].map((price) => {
                const standard = calculateStandardSDLT(price);
                const investment = calculateInvestmentSDLT(price);
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
                      £{investment.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-amber-600 dark:text-amber-400">
                      +£{(investment - standard).toLocaleString()}
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
          Buying Investment Property Through a Limited Company
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Many property investors consider purchasing through a Special Purpose Vehicle (SPV)
            limited company. The stamp duty implications are:
          </p>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>
                <strong>5% surcharge still applies</strong> - companies pay the same
                additional rate as individuals on residential property
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>
                <strong>15% flat rate</strong> - applies to residential properties
                over £500,000 bought by companies (with exemptions for
                genuine property rental businesses running on a commercial basis)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>
                <strong>ATED</strong> - Annual Tax on Enveloped Dwellings may apply
                to company-owned properties valued over £500,000
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>
                <strong>Mortgage interest</strong> - companies can fully offset mortgage
                interest against rental profits, unlike individuals
              </span>
            </li>
          </ul>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 italic">
            The decision between personal and company ownership depends on your tax situation,
            investment strategy, and long-term plans. Always consult a qualified tax advisor.
          </p>
        </div>
      </section>

      {/* External Resources */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Official Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-slate-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                {link.label}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Understanding Investment Property Stamp Duty in 2025</h2>
        <p>
          When purchasing an investment property in England or Northern Ireland,
          you'll pay Stamp Duty Land Tax (SDLT) at higher rates than standard
          residential purchases. The 5% additional property surcharge (increased from 3%
          in October 2024) applies to all investment properties, regardless of whether
          you intend to let them out or hold them for capital appreciation.
        </p>

        <h3>What Counts as an Investment Property?</h3>
        <p>
          For stamp duty purposes, an investment property is any residential property
          that won't be your main residence. This includes:
        </p>
        <ul>
          <li>Buy-to-let properties rented to tenants</li>
          <li>Properties held for capital growth without letting</li>
          <li>Holiday lets and short-term rental properties</li>
          <li>Second homes and holiday homes</li>
          <li>Properties bought through limited companies or SPVs</li>
        </ul>

        <h3>The 5% Investment Property Surcharge</h3>
        <p>
          The additional 5% surcharge applies if, at the end of the day of purchase,
          you'll own two or more residential properties. Unlike the standard SDLT bands,
          this surcharge is added to every band, starting from £0. This means:
        </p>
        <ul>
          <li>On a £300,000 investment property: £15,000 surcharge alone (5% of £300,000)</li>
          <li>The surcharge is added ON TOP of the standard SDLT calculation</li>
          <li>Properties owned anywhere in the world count towards the two-property test</li>
        </ul>

        <h3>Investment Property Stamp Duty Calculator: How It Works</h3>
        <p>
          Our investment property stamp duty calculator applies the correct rates
          automatically when you select "Additional Property" as your buyer type.
          The calculation includes:
        </p>
        <ul>
          <li>Standard SDLT rates applied in bands</li>
          <li>5% surcharge on the entire purchase price</li>
          <li>Clear breakdown showing the surcharge component</li>
        </ul>

        <h3>Stamp Duty Calculator Investment Property: Regional Differences</h3>
        <p>
          If your investment property is in Scotland, you'll pay Land and Buildings
          Transaction Tax (LBTT) with a 6% Additional Dwelling Supplement (ADS) -
          higher than England's 5% surcharge.
        </p>
        <p>
          In Wales, you'll pay Land Transaction Tax (LTT) with a 4% higher rate
          for additional properties - lower than both England and Scotland.
        </p>

        <h3>Can You Reduce Investment Property Stamp Duty?</h3>
        <p>
          Unlike main residence purchases, there's no first-time buyer relief for
          investment properties. However, some strategies may help:
        </p>
        <ul>
          <li><strong>Mixed-use properties:</strong> Commercial rates may apply if the
          property has a commercial element, potentially reducing the overall tax</li>
          <li><strong>Multiple Dwellings Relief:</strong> Buying multiple properties in
          one transaction may qualify for relief (being phased out in 2024)</li>
          <li><strong>Timing:</strong> Selling your only other property before completing
          means you won't own two properties simultaneously</li>
        </ul>

        <h3>Investment Property vs Buy-to-Let: Tax Implications</h3>
        <p>
          While stamp duty is identical for investment properties and buy-to-lets,
          the ongoing tax treatment differs:
        </p>
        <ul>
          <li><strong>Rental income:</strong> Taxed as income for both, but allowable
          expenses differ between personal and company ownership</li>
          <li><strong>Capital gains:</strong> Personal ownership benefits from annual
          CGT allowance; companies pay corporation tax on gains</li>
          <li><strong>Mortgage interest:</strong> Companies can fully deduct mortgage
          interest; individuals receive only a 20% tax credit</li>
        </ul>

        <p>
          Use our stamp duty calculator for investment property to see exactly how much
          you'll pay, then consult a tax advisor for comprehensive planning advice covering
          income tax, capital gains, and inheritance tax implications.
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

function calculateInvestmentSDLT(price: number): number {
  // Investment property adds 5% to entire price plus standard rates
  const surcharge = price * 0.05;
  return calculateStandardSDLT(price) + surcharge;
}
