"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, CalculationBreakdown } from "@/components/charts";
import { COMPANY_PURCHASE_PROMPT } from "@/lib/prompts";

const COMPANY_RATES = [
  { threshold: 0, rate: 5, label: "Up to £250,000" },
  { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 17, label: "Over £1.5m" },
];

const COMPANY_15_RATE = [
  { threshold: 0, rate: 15, label: "Entire purchase price" },
];

const ATED_BANDS = [
  { value: "£500,001 - £1 million", charge: "£4,400" },
  { value: "£1 million - £2 million", charge: "£9,000" },
  { value: "£2 million - £5 million", charge: "£31,050" },
  { value: "£5 million - £10 million", charge: "£72,700" },
  { value: "£10 million - £20 million", charge: "£145,950" },
  { value: "Over £20 million", charge: "£269,450" },
];

const FAQS = [
  {
    question: "What is an SPV for property investment?",
    answer:
      "A Special Purpose Vehicle (SPV) is a limited company set up specifically to hold property investments. It's commonly used by landlords to benefit from corporation tax rates on profits and to offset mortgage interest against rental income - something individual landlords can no longer do effectively since 2020.",
  },
  {
    question: "When does the 15% flat stamp duty rate apply?",
    answer:
      "The 15% flat rate applies when a company, partnership with a company member, or collective investment scheme purchases a residential property worth more than £500,000. This rate applies to the ENTIRE purchase price, not just the amount over £500,000. However, property rental businesses can claim an exemption.",
  },
  {
    question: "Can my property company avoid the 15% rate?",
    answer:
      "Yes, if your company qualifies as a property rental business. To claim the exemption, the property must be bought to be let commercially on the open market to unconnected parties. You cannot use it as a residence for shareholders, directors, or their families. The exemption must be claimed on your SDLT return.",
  },
  {
    question: "What is ATED and when does it apply?",
    answer:
      "Annual Tax on Enveloped Dwellings (ATED) is an annual charge on UK residential properties worth over £500,000 owned by companies. The charge ranges from £4,400 to £269,450 depending on property value. However, relief is available for genuine property rental businesses - you must submit an ATED return even if claiming relief.",
  },
  {
    question: "Should I buy property personally or through a company?",
    answer:
      "It depends on your circumstances. Company ownership offers mortgage interest relief, lower corporation tax rates (25% vs up to 45% income tax), and potential inheritance tax benefits. However, you face higher stamp duty, ATED obligations, and extraction of profits can be tax-inefficient. Always consult a tax advisor before deciding.",
  },
  {
    question: "Does first-time buyer relief apply to company purchases?",
    answer:
      "No. First-time buyer relief only applies to individuals purchasing their first residential property to live in. Companies cannot claim first-time buyer relief, even if the company is newly formed or has never owned property before.",
  },
  {
    question: "What stamp duty does a company pay on property under £500,000?",
    answer:
      "For residential properties under £500,000, companies pay the same rates as individuals buying additional properties - that's the standard SDLT rates plus the 5% additional property surcharge on the entire purchase price.",
  },
  {
    question: "Can I transfer my existing property into a company?",
    answer:
      "Yes, but the transfer is treated as a purchase at market value for stamp duty purposes. The company would pay SDLT on the property's current market value, potentially at the 15% rate if over £500,000. There may also be capital gains tax implications for you personally.",
  },
];

const RELATED_PAGES = [
  {
    label: "Stamp Duty Calculator",
    href: "/",
    description: "Calculate stamp duty for any UK property purchase",
  },
  {
    label: "Buy-to-Let Calculator",
    href: "/buy-to-let",
    description: "Calculate stamp duty for individual BTL purchases with 5% surcharge",
  },
  {
    label: "Investment Property Calculator",
    href: "/investment-property",
    description: "Compare investment property stamp duty scenarios",
  },
  {
    label: "Second Home Calculator",
    href: "/second-home",
    description: "Calculate stamp duty for second homes and holiday properties",
  },
];

const EXTERNAL_LINKS = [
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/corporate-bodies",
    label: "HMRC: SDLT for Corporate Bodies",
    description: "Official guidance on stamp duty for company property purchases",
  },
  {
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-corporate-bodies",
    label: "15% Rate Guidance",
    description: "When the 15% flat rate applies and exemptions available",
  },
  {
    href: "https://www.gov.uk/guidance/annual-tax-on-enveloped-dwellings-the-basics",
    label: "ATED Guidance",
    description: "Annual Tax on Enveloped Dwellings - rates, reliefs, and returns",
  },
  {
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-relief-for-property-rental-businesses",
    label: "Property Rental Business Relief",
    description: "How to claim exemption from the 15% rate for rental businesses",
  },
];

export default function CompanyPurchasePage() {
  return (
    <PageLayout
      title="SPV Stamp Duty Calculator 2025"
      subtitle="Calculate stamp duty for limited company and SPV property purchases"
      systemPrompt={COMPANY_PURCHASE_PROMPT}
      initialMessage="I can help you understand stamp duty for company property purchases. Are you buying through an existing company or considering setting up an SPV?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Company Purchase", href: "/company-purchase" }]}
      relatedPages={RELATED_PAGES}
      externalLinks={EXTERNAL_LINKS}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator defaultBuyerType="additional" />
      </section>

      {/* Key Info Box - 15% Rate Warning */}
      <section className="mb-8">
        <InfoBox variant="warning" title="15% Flat Rate for High-Value Properties">
          <p>
            Companies purchasing residential properties over <strong>£500,000</strong> may
            pay a <strong>15% flat rate</strong> on the entire purchase price - not the
            standard banded rates.
          </p>
          <ul>
            <li>Applies to companies, partnerships with company members, and collective investment schemes</li>
            <li>Property rental businesses can claim exemption if letting commercially</li>
            <li>Must be claimed on your SDLT return - seek professional advice</li>
          </ul>
        </InfoBox>
      </section>

      {/* ATED Info Box */}
      <section className="mb-8">
        <InfoBox variant="info" title="Annual Tax on Enveloped Dwellings (ATED)">
          <p>
            In addition to stamp duty, company-owned properties over £500,000 face an
            <strong> annual ATED charge</strong>. Relief is available for property rental
            businesses, but you must submit an ATED return each year even if claiming relief.
          </p>
        </InfoBox>
      </section>

      {/* Standard Company Rates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Company SDLT Rates (Under £500,000)
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          For properties under £500,000, companies pay the same rates as individuals
          buying additional properties - standard rates plus the 5% surcharge.
        </p>
        <SDLTRatesChart
          title="Standard Company Rates (with 5% surcharge)"
          bands={COMPANY_RATES}
          note="These rates apply to company purchases under £500,000 or qualifying property rental businesses."
          variant="england"
        />
      </section>

      {/* 15% Rate Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          15% Flat Rate (Over £500,000)
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          For residential properties over £500,000, companies face a punitive 15% flat rate
          unless they qualify as a property rental business.
        </p>
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-red-400">15%</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Flat Rate on Entire Price</h3>
              <p className="text-slate-400 text-sm">No thresholds - applied to full purchase price</p>
            </div>
          </div>
          <div className="space-y-2 text-slate-300">
            <p>
              <strong className="text-white">Example:</strong> A £750,000 property would cost{" "}
              <span className="text-red-400 font-mono">£112,500</span> in stamp duty at the 15% rate.
            </p>
            <p className="text-sm text-slate-400">
              Compare this to £52,500 for an individual buying an additional property at standard rates.
            </p>
          </div>
        </div>
      </section>

      {/* Example Calculations */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Example Company Purchase Calculations
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          These calculations show standard company rates (with 5% surcharge) for properties
          qualifying for property rental business relief.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculationBreakdown
            propertyPrice={350000}
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

      {/* Rate Comparison Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Company vs Personal Ownership: Stamp Duty Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Property Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Individual (Standard)
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Individual (Additional)
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Company (15% Rate)
                </th>
              </tr>
            </thead>
            <tbody>
              {[400000, 500000, 600000, 750000, 1000000, 1500000].map((price) => {
                const standard = calculateStandardSDLT(price);
                const additional = calculateAdditionalSDLT(price);
                const company15 = price > 500000 ? price * 0.15 : additional;
                const showsCompany15 = price > 500000;
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
                    <td className="p-4 text-right font-mono text-amber-600 dark:text-amber-400">
                      £{additional.toLocaleString()}
                    </td>
                    <td className={`p-4 text-right font-mono ${showsCompany15 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                      £{company15.toLocaleString()}
                      {showsCompany15 && <span className="text-xs ml-1">(15%)</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
          Note: Companies qualifying as property rental businesses pay the &quot;Additional&quot; rate, not the 15% rate.
        </p>
      </section>

      {/* ATED Bands Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          ATED Annual Charges 2024/25
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Company-owned residential properties over £500,000 face annual ATED charges.
          Relief is available for genuine property rental businesses.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-slate-900 text-white rounded-xl border border-slate-700">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-400">Property Value Band</th>
                <th className="text-right p-4 text-slate-400">Annual ATED Charge</th>
              </tr>
            </thead>
            <tbody>
              {ATED_BANDS.map((band, index) => (
                <tr key={index} className="border-b border-slate-800">
                  <td className="p-4 font-medium">{band.value}</td>
                  <td className="p-4 text-right font-mono text-amber-400">{band.charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* When to Use a Company */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Company vs Personal Ownership: Key Considerations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-800 dark:text-green-400 mb-3">
              Advantages of Company Ownership
            </h3>
            <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1">+</span>
                <span>Full mortgage interest relief against profits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">+</span>
                <span>Corporation tax at 25% (vs up to 45% income tax)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">+</span>
                <span>Potential inheritance tax planning benefits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">+</span>
                <span>Flexibility in profit extraction timing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">+</span>
                <span>Easier to add investors or transfer shares</span>
              </li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-800 dark:text-red-400 mb-3">
              Disadvantages of Company Ownership
            </h3>
            <ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1">-</span>
                <span>Potential 15% stamp duty rate on properties over £500k</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">-</span>
                <span>Annual ATED charges on high-value properties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">-</span>
                <span>Higher mortgage rates for company borrowing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">-</span>
                <span>Additional accounting and compliance costs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">-</span>
                <span>No CGT annual exemption on disposal</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Property Rental Business Exemption */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Claiming Property Rental Business Exemption
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            To avoid the 15% rate and pay standard company rates instead, your company must
            qualify as a property rental business:
          </p>
          <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0">1</span>
              <span>The property must be purchased for the purpose of a property rental business</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0">2</span>
              <span>It must be let commercially on the open market (not to connected persons)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0">3</span>
              <span>No shareholder, director, or their family can occupy the property</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0">4</span>
              <span>The exemption must be claimed on your SDLT return at the time of purchase</span>
            </li>
          </ul>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 italic">
            If conditions are not met within 3 years, you must notify HMRC and pay the additional tax.
          </p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>SPV Stamp Duty Calculator: Company Property Purchases Explained</h2>
        <p>
          Many property investors use a Special Purpose Vehicle (SPV) or limited company to
          purchase buy-to-let properties. While there can be significant tax advantages to
          company ownership, the stamp duty implications are often more complex than for
          individual purchases.
        </p>

        <h3>Understanding SPV Property Purchases</h3>
        <p>
          An SPV is typically a limited company set up specifically to hold property investments.
          Since the restriction of mortgage interest relief for individual landlords in 2020,
          many investors have moved to company structures to maintain full interest deductibility
          against rental profits.
        </p>
        <p>
          When using our <strong>SPV stamp duty calculator</strong>, remember that companies are
          always treated as additional property purchasers - there&apos;s no equivalent to first-time
          buyer relief for company purchases.
        </p>

        <h3>The 15% Flat Rate: When It Applies</h3>
        <p>
          The most significant stamp duty consideration for company purchases is the potential
          15% flat rate. This punitive rate was introduced to discourage the &quot;enveloping&quot; of
          high-value residential property in corporate structures.
        </p>
        <p>
          Using a <strong>stamp duty limited company property calculator</strong> correctly
          requires understanding when this rate applies:
        </p>
        <ul>
          <li>The property is residential and worth more than £500,000</li>
          <li>The buyer is a company, partnership with a company member, or collective investment scheme</li>
          <li>The buyer does not qualify for property rental business relief</li>
        </ul>

        <h3>Avoiding the 15% Rate</h3>
        <p>
          Most genuine property rental businesses can claim relief from the 15% rate. To qualify,
          your company must be purchasing the property for a property rental business, and it must
          be let commercially on the open market to parties not connected to the company.
        </p>

        <h3>ATED: The Annual Charge</h3>
        <p>
          Beyond stamp duty, company-owned residential properties worth over £500,000 face the
          Annual Tax on Enveloped Dwellings (ATED). This annual charge ranges from £4,400 for
          properties valued between £500,001 and £1 million, up to £269,450 for properties
          over £20 million.
        </p>
        <p>
          Property rental businesses can claim ATED relief, but an annual return must still
          be submitted to HMRC.
        </p>

        <h3>Should You Use a Company Structure?</h3>
        <p>
          The decision between personal and company ownership depends on many factors beyond
          stamp duty, including your income tax rate, plans for the property, mortgage
          availability, and long-term investment strategy. We strongly recommend consulting
          a qualified tax advisor before making this decision.
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

function calculateAdditionalSDLT(price: number): number {
  // Additional property adds 5% to entire price plus standard rates
  const surcharge = price * 0.05;
  return calculateStandardSDLT(price) + surcharge;
}
