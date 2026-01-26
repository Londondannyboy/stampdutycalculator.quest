"use client";

import { PageLayout } from "@/components/PageLayout";
import { SDLTRatesChart, InfoBox } from "@/components/charts";
import { MIXED_USE_PROMPT } from "@/lib/prompts";
import { useState } from "react";
import { formatCurrency } from "@/lib/calculations";

const COMMERCIAL_RATES = [
  { threshold: 0, rate: 0, label: "Up to £150,000" },
  { threshold: 150000, rate: 2, label: "£150,001 to £250,000" },
  { threshold: 250000, rate: 5, label: "Over £250,000" },
];

const RESIDENTIAL_WITH_SURCHARGE = [
  { threshold: 0, rate: 5, label: "Up to £250,000 (+5% surcharge)" },
  { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 17, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "What is a mixed-use property for stamp duty purposes?",
    answer:
      "A mixed-use property combines residential and non-residential elements in a single transaction. Common examples include a shop with a flat above, a pub with living quarters, a farm with a farmhouse, or an office building with a residential flat. The key requirement is that there must be a genuine commercial or non-residential element alongside the residential use.",
  },
  {
    question: "Why are commercial SDLT rates beneficial for mixed-use properties?",
    answer:
      "Commercial rates are often significantly lower than residential rates, especially for additional property purchases. Commercial rates have a 0% band up to £150,000, with 2% up to £250,000 and 5% above. Crucially, there's no 5% additional property surcharge that applies to residential purchases, which can save tens of thousands of pounds.",
  },
  {
    question: "What qualifies as a genuine commercial element?",
    answer:
      "HMRC looks for a genuine business use, not just a token commercial element. This could include a retail shop, office space, workshop, commercial storage, or agricultural land. The commercial element must be actively used for business purposes or have clear commercial potential. A garden shed used for occasional storage would not qualify.",
  },
  {
    question: "Can I claim mixed-use rates for a property with a home office?",
    answer:
      "Generally no. A home office within a residential property does not make it mixed-use. The non-residential element must be genuinely separate or distinct from the dwelling, such as a purpose-built commercial unit or separate business premises. HMRC has successfully challenged claims based on home offices.",
  },
  {
    question: "What about a property with agricultural land?",
    answer:
      "Properties with agricultural land often qualify for mixed-use rates. Even a modest amount of farmland or grazing land attached to a house may qualify the transaction for commercial SDLT rates. However, a large residential garden does not count as agricultural land - it must be genuinely used for agricultural purposes.",
  },
  {
    question: "Can HMRC challenge a mixed-use classification?",
    answer:
      "Yes, HMRC actively challenges mixed-use claims they believe are incorrect. They may review the property details, check how the commercial element is being used, and look at whether the commercial use is genuine or contrived. Penalties and interest may apply if a claim is found to be incorrect. Always seek professional advice.",
  },
  {
    question: "How much can I save with mixed-use SDLT rates?",
    answer:
      "Savings can be substantial. For a £500,000 property, commercial rates would be £14,500 vs £12,500 residential (standard) or £37,500 residential with the 5% surcharge. The savings increase with higher-value properties and are especially significant for additional property purchases where the surcharge would otherwise apply.",
  },
];

const RELATED_PAGES = [
  {
    label: "Commercial Calculator",
    href: "/commercial",
    description: "Full commercial property SDLT rates",
  },
  {
    label: "Investment Property",
    href: "/investment-property",
    description: "Compare with residential investment rates",
  },
  {
    label: "Buy-to-Let Calculator",
    href: "/buy-to-let",
    description: "Residential buy-to-let calculations",
  },
  {
    label: "Company Purchase",
    href: "/company-purchase",
    description: "SDLT for company property purchases",
  },
];

const EXTERNAL_LINKS = [
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates",
    label: "HMRC SDLT Residential Rates",
    description: "Official guidance on residential stamp duty rates",
  },
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/nonresidential-and-mixed-use-rates",
    label: "HMRC Non-Residential & Mixed-Use Rates",
    description: "Official HMRC guidance on commercial and mixed-use SDLT",
  },
  {
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-buying-multiple-properties",
    label: "Multiple Dwellings Relief",
    description: "HMRC guidance on MDR (now abolished but relevant for historic claims)",
  },
];

export default function MixedUsePage() {
  const [price, setPrice] = useState<number>(0);
  const [priceInput, setPriceInput] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPriceInput(value);
    setPrice(parseInt(value) || 0);
  };

  const commercialTax = calculateCommercialSDLT(price);
  const residentialTax = calculateResidentialSDLT(price);
  const residentialWithSurcharge = residentialTax + price * 0.05;

  return (
    <PageLayout
      title="Mixed-Use Property Stamp Duty Calculator"
      subtitle="Calculate SDLT for properties with commercial and residential elements"
      systemPrompt={MIXED_USE_PROMPT}
      initialMessage="I can help calculate stamp duty for mixed-use properties. What type of property are you considering?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Mixed-Use", href: "/mixed-use" }]}
      relatedPages={RELATED_PAGES}
      externalLinks={EXTERNAL_LINKS}
    >
      {/* Calculator */}
      <section className="mb-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Mixed-Use SDLT Calculator
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Property Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">
                  £
                </span>
                <input
                  type="text"
                  value={priceInput}
                  onChange={handlePriceChange}
                  placeholder="Enter property price"
                  className="w-full pl-8 pr-4 py-3 text-lg border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            {price > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <div className="text-center mb-6">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    Mixed-Use (Commercial) SDLT
                  </p>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(commercialTax)}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Effective rate: {((commercialTax / price) * 100).toFixed(2)}%
                  </p>
                </div>

                {/* Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 text-center">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                      Residential (Standard)
                    </p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">
                      {formatCurrency(residentialTax)}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                      Residential + Surcharge
                    </p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(residentialWithSurcharge)}
                    </p>
                  </div>
                </div>

                {/* Savings highlight */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400 mb-1">
                    Potential Savings vs Residential + Surcharge
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(residentialWithSurcharge - commercialTax)}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mt-4">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    Commercial Rate Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Up to £150,000 @ 0%
                      </span>
                      <span className="font-mono">£0</span>
                    </div>
                    {price > 150000 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          £150,001-£250,000 @ 2%
                        </span>
                        <span className="font-mono">
                          {formatCurrency(Math.min(price - 150000, 100000) * 0.02)}
                        </span>
                      </div>
                    )}
                    {price > 250000 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Over £250,000 @ 5%
                        </span>
                        <span className="font-mono">
                          {formatCurrency((price - 250000) * 0.05)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Info */}
      <section className="mb-8">
        <InfoBox variant="success" title="Commercial Rates = No Surcharge">
          <p>
            Mixed-use properties are taxed at <strong>commercial SDLT rates</strong>,
            which means you avoid the 5% additional property surcharge that applies
            to residential purchases. This can save you tens of thousands of pounds,
            especially on higher-value properties.
          </p>
        </InfoBox>
      </section>

      {/* What Qualifies Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          What Qualifies as Mixed-Use Property?
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            A property must have a genuine non-residential element to qualify for
            commercial SDLT rates. Common qualifying examples include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Likely to Qualify
              </h3>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  Shop with flat above
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  Pub or restaurant with living quarters
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  Farm with farmhouse
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  Property with attached workshop/studio
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  Office building with residential flat
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">•</span>
                  House with genuine agricultural land
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                Unlikely to Qualify
              </h3>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Home office in residential property
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Garden shed used for storage
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Granny flat or annexe
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Large garden without agricultural use
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Garage let to tenants
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Unused or derelict commercial space
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rates Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Mixed-Use (Commercial) vs Residential Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SDLTRatesChart
            title="Commercial / Mixed-Use Rates"
            bands={COMMERCIAL_RATES}
            note="No additional property surcharge"
            variant="england"
          />
          <SDLTRatesChart
            title="Residential + Surcharge"
            bands={RESIDENTIAL_WITH_SURCHARGE}
            note="Includes 5% additional property surcharge"
            variant="england"
          />
        </div>
      </section>

      {/* Savings Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Potential Stamp Duty Savings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Mixed-Use
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Residential
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Res + Surcharge
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Max Saving
                </th>
              </tr>
            </thead>
            <tbody>
              {[300000, 500000, 750000, 1000000, 1500000].map((p) => {
                const commercial = calculateCommercialSDLT(p);
                const residential = calculateResidentialSDLT(p);
                const withSurcharge = residential + p * 0.05;
                const saving = withSurcharge - commercial;
                return (
                  <tr
                    key={p}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="p-4 font-medium">£{p.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-green-600 dark:text-green-400">
                      £{commercial.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-blue-600 dark:text-blue-400">
                      £{residential.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-red-600 dark:text-red-400">
                      £{withSurcharge.toLocaleString()}
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
          Max Saving shows the difference between mixed-use rates and residential
          rates with the 5% additional property surcharge.
        </p>
      </section>

      {/* Warning */}
      <section className="mb-8">
        <InfoBox variant="warning" title="HMRC Scrutiny of Mixed-Use Claims">
          <p>
            HMRC actively investigates mixed-use SDLT claims. If a claim is found
            to be incorrect, you may face:
          </p>
          <ul>
            <li>Additional SDLT at the correct (higher) rate</li>
            <li>Interest on the unpaid tax from the original transaction date</li>
            <li>Potential penalties of up to 100% of the underpaid tax</li>
          </ul>
          <p className="mt-2">
            <strong>Always seek professional advice</strong> from a solicitor or
            tax advisor before claiming mixed-use rates.
          </p>
        </InfoBox>
      </section>

      {/* Tax Advantages Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Tax Advantages of Commercial Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
            <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">
              No Surcharge
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              The 5% additional property surcharge does not apply to commercial
              or mixed-use properties, even if you already own residential property.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
              Lower Top Rate
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Commercial rates max out at 5% (above £250k), compared to 12% for
              residential properties over £1.5m. The effective rate is often lower.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">
              Higher 0% Band
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Commercial properties have a 0% band up to £150,000, vs £250,000 for
              residential. But the overall rates are typically more favourable.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Mixed-Use Property Stamp Duty Explained</h2>
        <p>
          Mixed-use properties offer a significant stamp duty advantage because they
          are taxed at commercial SDLT rates rather than residential rates. This can
          result in substantial savings, particularly for buyers who would otherwise
          pay the 5% additional property surcharge on residential purchases.
        </p>

        <h3>What Makes a Property Mixed-Use?</h3>
        <p>
          A mixed-use property combines residential accommodation with a genuine
          commercial or non-residential element. The commercial element must be more
          than incidental - it needs to be a genuine business use or have clear
          commercial characteristics.
        </p>
        <p>
          Common examples include shops with flats above, pubs with living quarters,
          farms with farmhouses, and properties with attached commercial workshops
          or studios. The key is that the commercial element must be genuine and
          actively used (or capable of being used) for non-residential purposes.
        </p>

        <h3>Agricultural Land and Mixed-Use</h3>
        <p>
          Properties with agricultural land often qualify for mixed-use treatment.
          Even a relatively small amount of genuine agricultural land - such as
          grazing land, paddocks used for livestock, or arable land - can make the
          entire transaction subject to commercial SDLT rates.
        </p>
        <p>
          However, a large residential garden does not qualify as agricultural land.
          The land must be genuinely used for agricultural purposes, not simply be
          rural or green space.
        </p>

        <h3>How to Calculate Mixed-Use SDLT</h3>
        <p>
          Mixed-use properties use the commercial SDLT rates: 0% up to £150,000, 2%
          from £150,001 to £250,000, and 5% on the portion above £250,000. There is
          no additional property surcharge, regardless of whether you already own
          other properties.
        </p>

        <h3>Professional Advice is Essential</h3>
        <p>
          Given HMRC's scrutiny of mixed-use claims and the potential penalties for
          incorrect claims, it's essential to seek professional advice before
          claiming mixed-use SDLT rates. A specialist property solicitor or tax
          advisor can assess whether your property genuinely qualifies and help you
          structure the transaction appropriately.
        </p>
      </section>
    </PageLayout>
  );
}

function calculateCommercialSDLT(price: number): number {
  let tax = 0;
  if (price > 150000) tax += Math.min(price - 150000, 100000) * 0.02;
  if (price > 250000) tax += (price - 250000) * 0.05;
  return Math.round(tax);
}

function calculateResidentialSDLT(price: number): number {
  let tax = 0;
  if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
  if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  return Math.round(tax);
}
