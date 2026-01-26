"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, CalculationBreakdown } from "@/components/charts";
import { NON_RESIDENT_PROMPT } from "@/lib/prompts";

const NON_RESIDENT_STANDARD_RATES = [
  { threshold: 0, rate: 2, label: "Up to £250,000" },
  { threshold: 250000, rate: 7, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 12, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 14, label: "Over £1.5m" },
];

const NON_RESIDENT_ADDITIONAL_RATES = [
  { threshold: 0, rate: 7, label: "Up to £250,000" },
  { threshold: 250000, rate: 12, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 17, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 19, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "What is the non-resident stamp duty surcharge?",
    answer:
      "Non-UK residents pay an additional 2% surcharge on top of standard SDLT rates when buying residential property in England and Northern Ireland. This surcharge was introduced in April 2021 and applies to individuals who have not been UK resident for at least 183 days in the 12 months before the purchase.",
  },
  {
    question: "How much stamp duty do non-resident additional property buyers pay?",
    answer:
      "Non-residents buying additional properties face a combined 7% surcharge: the 5% additional property surcharge plus the 2% non-resident surcharge. This means the lowest band (up to £250,000) attracts 7% tax, compared to 0% for UK resident first-time buyers.",
  },
  {
    question: "Who qualifies as a non-resident for stamp duty purposes?",
    answer:
      "You are considered non-UK resident if you were not present in the UK for at least 183 days in the 12 months before your purchase. For joint purchases, if any buyer is non-resident, the surcharge applies to the entire purchase. Companies are non-resident if not UK incorporated or centrally managed.",
  },
  {
    question: "Can I get a refund of the non-resident surcharge?",
    answer:
      "Yes. If you become UK resident (spending 183+ days in the UK) within 2 years of the purchase, you can claim a refund of the 2% non-resident surcharge. You must apply to HMRC within 3 months of meeting the residency requirement.",
  },
  {
    question: "Does the non-resident surcharge apply in Scotland and Wales?",
    answer:
      "No. The 2% non-resident surcharge only applies to SDLT in England and Northern Ireland. Scotland's LBTT and Wales's LTT do not currently have a non-resident surcharge, making these regions potentially more attractive for overseas buyers.",
  },
  {
    question: "What if I'm a UK citizen living abroad?",
    answer:
      "UK citizenship does not exempt you from the surcharge. Residency is determined by physical presence - if you have not spent 183 days in the UK in the previous 12 months, you pay the surcharge regardless of citizenship or domicile status.",
  },
  {
    question: "How do companies pay the non-resident surcharge?",
    answer:
      "Companies that are not UK incorporated or not centrally managed and controlled in the UK are treated as non-resident. They pay the 2% surcharge in addition to any other rates. For high-value properties over £500,000, companies may also face the 15% flat rate.",
  },
  {
    question: "Does the surcharge apply to commercial property?",
    answer:
      "No. The non-resident surcharge only applies to residential property purchases. Commercial properties and mixed-use properties (where at least part is non-residential) are not subject to the 2% surcharge.",
  },
];

const RELATED_PAGES = [
  {
    label: "Second Home Calculator",
    href: "/second-home",
    description: "Calculate the 5% additional property surcharge",
  },
  {
    label: "Buy-to-Let Calculator",
    href: "/buy-to-let",
    description: "Stamp duty rates for investment property purchases",
  },
  {
    label: "Scotland LBTT Calculator",
    href: "/scotland",
    description: "No non-resident surcharge in Scotland",
  },
  {
    label: "Wales LTT Calculator",
    href: "/wales",
    description: "No non-resident surcharge in Wales",
  },
];

const EXTERNAL_LINKS = [
  {
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-surcharge-for-non-uk-residents",
    label: "HMRC Non-Resident Surcharge Guidance",
    description: "Official HMRC guidance on the 2% surcharge",
  },
  {
    href: "https://www.gov.uk/government/publications/stamp-duty-land-tax-surcharge-for-non-uk-residents",
    label: "Non-Resident SDLT Policy Paper",
    description: "Government policy paper on the surcharge",
  },
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates",
    label: "Current SDLT Rates",
    description: "Official HMRC SDLT residential rates",
  },
  {
    href: "https://www.gov.uk/tax-uk-income-live-abroad",
    label: "UK Tax for Non-Residents",
    description: "General guidance on UK tax for people living abroad",
  },
];

export default function NonResidentPage() {
  return (
    <PageLayout
      title="Non-Resident Stamp Duty Calculator UK 2025"
      subtitle="Calculate SDLT including the 2% overseas buyer surcharge for non-UK residents"
      systemPrompt={NON_RESIDENT_PROMPT}
      initialMessage="I can help you calculate stamp duty as a non-UK resident. What's the property price and will this be your only property or an additional one?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Non-Resident", href: "/non-resident" }]}
      relatedPages={RELATED_PAGES}
      externalLinks={EXTERNAL_LINKS}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator />
      </section>

      {/* Key Info Box */}
      <section className="mb-8">
        <InfoBox variant="warning" title="2% Non-Resident Surcharge">
          <p>
            Non-UK residents pay an additional <strong>2% surcharge</strong> on
            top of standard SDLT rates when buying residential property in
            England and Northern Ireland. This is added to every band.
          </p>
          <ul>
            <li>Standard purchase: Add 2% to all bands</li>
            <li>Additional property: 5% + 2% = 7% total surcharge</li>
            <li>Non-resident status based on 183-day presence test</li>
            <li>Refund available if you become UK resident within 2 years</li>
          </ul>
        </InfoBox>
      </section>

      {/* Non-Resident Rates Charts */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Non-Resident SDLT Rates 2025
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          These rates include the 2% non-resident surcharge. Additional property
          buyers pay the 5% surcharge on top.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SDLTRatesChart
            title="Non-Resident Standard Rates"
            bands={NON_RESIDENT_STANDARD_RATES}
            note="For non-residents buying their only property"
            variant="england"
          />
          <SDLTRatesChart
            title="Non-Resident Additional Property (+5%)"
            bands={NON_RESIDENT_ADDITIONAL_RATES}
            note="Combined 7% surcharge (2% + 5%)"
            variant="england"
          />
        </div>
      </section>

      {/* Who Qualifies Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Who Qualifies as a Non-Resident?
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            You are treated as non-UK resident for SDLT purposes if you meet
            these criteria:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                Individuals
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li>Not present in the UK for 183+ days in previous 12 months</li>
                <li>UK citizenship does NOT exempt you</li>
                <li>Applies even if you work in UK but live abroad</li>
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                Companies
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>Not incorporated in the UK</li>
                <li>Not centrally managed/controlled in UK</li>
                <li>May also face 15% flat rate for high-value properties</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Joint Purchases
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              If <strong>any</strong> buyer is non-resident, the surcharge
              applies to the entire purchase. For married couples or civil
              partners, both must be UK resident to avoid the surcharge.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          UK Resident vs Non-Resident SDLT Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Property Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  UK Resident
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Non-Resident
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Extra Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {[300000, 500000, 750000, 1000000, 1500000].map((price) => {
                const ukResident = calculateStandardSDLT(price);
                const nonResident = calculateNonResidentSDLT(price);
                return (
                  <tr
                    key={price}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                      £{price.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-blue-600 dark:text-blue-400">
                      £{ukResident.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-red-600 dark:text-red-400">
                      £{nonResident.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-amber-600 dark:text-amber-400">
                      +£{(nonResident - ukResident).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          Standard rates shown. Additional property purchases add a further 5%
          surcharge for both UK and non-UK residents.
        </p>
      </section>

      {/* Additional Property Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Non-Resident Additional Property: The 7% Combined Surcharge
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Non-residents buying additional properties face the highest stamp duty
            rates. The 5% additional property surcharge and 2% non-resident
            surcharge combine to add 7% to every band.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left p-3 text-zinc-600 dark:text-zinc-400">
                    Property Price
                  </th>
                  <th className="text-right p-3 text-zinc-600 dark:text-zinc-400">
                    UK Additional
                  </th>
                  <th className="text-right p-3 text-zinc-600 dark:text-zinc-400">
                    Non-Res Additional
                  </th>
                  <th className="text-right p-3 text-zinc-600 dark:text-zinc-400">
                    Extra Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {[300000, 500000, 750000, 1000000].map((price) => {
                  const ukAdditional = calculateAdditionalPropertySDLT(price);
                  const nonResAdditional = calculateNonResidentAdditionalSDLT(price);
                  return (
                    <tr
                      key={price}
                      className="border-b border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                        £{price.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-amber-600 dark:text-amber-400">
                        £{ukAdditional.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-red-600 dark:text-red-400">
                        £{nonResAdditional.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-zinc-600 dark:text-zinc-400">
                        +£{(nonResAdditional - ukAdditional).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Refund Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Claiming a Refund of the Non-Resident Surcharge
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            If you paid the 2% non-resident surcharge but then become UK
            resident within 2 years, you can claim a refund.
          </p>

          <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">
            Eligibility Requirements:
          </h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                You paid the 2% non-resident surcharge when buying
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                You spend 183+ days in the UK within 2 years of purchase
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                You apply within 3 months of meeting the residency requirement
              </span>
            </li>
          </ul>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-300 text-sm">
              <strong>Example:</strong> You buy a £600,000 property as a
              non-resident, paying £12,000 in non-resident surcharge. You then
              relocate to the UK and spend 200 days here within 2 years. You can
              claim back the £12,000 surcharge from HMRC.
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
            propertyPrice={500000}
            buyerType="standard"
            region="england"
          />
          <CalculationBreakdown
            propertyPrice={500000}
            buyerType="additional"
            region="england"
          />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          Note: Non-residents should add 2% of the total property price to
          these calculations.
        </p>
      </section>

      {/* Scotland and Wales Note */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Buying in Scotland or Wales as a Non-Resident
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              Scotland - No Non-Resident Surcharge
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Scotland's LBTT does not include a non-resident surcharge.
              Overseas buyers pay the same rates as UK residents. The 6% ADS
              still applies to additional properties.
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
              Wales - No Non-Resident Surcharge
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              Wales's LTT also has no non-resident surcharge. Overseas buyers
              pay standard rates, with the 4% higher rate for additional
              properties where applicable.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Understanding Non-Resident Stamp Duty in the UK</h2>
        <p>
          The non-resident stamp duty surcharge, introduced in April 2021, adds
          2% to standard SDLT rates for overseas buyers purchasing residential
          property in England and Northern Ireland. This was designed to help
          ensure the UK housing market works for UK residents and to raise
          revenue for affordable housing initiatives.
        </p>

        <h3>How the Non-Resident Surcharge Works</h3>
        <p>
          The 2% surcharge is added to each SDLT band. For example, the first
          £250,000 of a property purchase normally attracts 0% SDLT, but
          non-residents pay 2%. The surcharge applies regardless of property
          value and regardless of whether you intend to live in the property.
        </p>

        <h3>Combined Surcharges for Additional Properties</h3>
        <p>
          If you're a non-resident buying an additional property (second home,
          buy-to-let, etc.), you face a combined 7% surcharge on the first
          £250,000: the 5% additional property surcharge plus the 2%
          non-resident surcharge. This means significant additional costs
          compared to UK resident first-time buyers.
        </p>

        <h3>Planning for UK Residency</h3>
        <p>
          If you're planning to relocate to the UK, consider timing your
          property purchase. Waiting until you achieve UK resident status (183
          days in the UK) could save you the 2% surcharge. Alternatively, if you
          need to buy before becoming resident, the 2-year refund window
          provides flexibility - you can claim back the surcharge if you become
          resident within that period.
        </p>

        <h3>Non-Resident Stamp Duty Calculator UK</h3>
        <p>
          Our non resident stamp duty calculator uk tool helps overseas buyers
          understand the full cost of purchasing property in England and
          Northern Ireland. Whether you're an overseas buyer looking to invest
          in UK property or relocating to the UK, accurate stamp duty
          calculations are essential for financial planning. Use our overseas
          buyer stamp duty calculator above to get instant, accurate results.
        </p>
      </section>
    </PageLayout>
  );
}

// Helper functions for the comparison tables
function calculateStandardSDLT(price: number): number {
  let tax = 0;
  if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
  if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  return Math.round(tax);
}

function calculateNonResidentSDLT(price: number): number {
  const surcharge = price * 0.02;
  return calculateStandardSDLT(price) + surcharge;
}

function calculateAdditionalPropertySDLT(price: number): number {
  const surcharge = price * 0.05;
  return calculateStandardSDLT(price) + surcharge;
}

function calculateNonResidentAdditionalSDLT(price: number): number {
  const surcharge = price * 0.07; // 5% + 2%
  return calculateStandardSDLT(price) + surcharge;
}
