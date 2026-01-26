"use client";

import { PageLayout } from "@/components/PageLayout";
import { SDLTRatesChart, InfoBox } from "@/components/charts";
import { LAND_PROMPT } from "@/lib/prompts";
import { useState } from "react";
import { formatCurrency } from "@/lib/calculations";

const RESIDENTIAL_LAND_RATES = [
  { threshold: 0, rate: 0, label: "Up to £250,000" },
  { threshold: 250000, rate: 5, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 10, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 12, label: "Over £1.5m" },
];

const NON_RESIDENTIAL_LAND_RATES = [
  { threshold: 0, rate: 0, label: "Up to £150,000" },
  { threshold: 150000, rate: 2, label: "£150,001 to £250,000" },
  { threshold: 250000, rate: 5, label: "Over £250,000" },
];

type LandType = "residential" | "agricultural" | "development";

const FAQS = [
  {
    question: "What is stamp duty on land purchase in the UK?",
    answer:
      "Stamp Duty Land Tax (SDLT) applies to land purchases in England and Northern Ireland, just as it does to property purchases. The rate you pay depends on whether the land is classified as residential or non-residential (commercial/agricultural). Agricultural land and bare development land typically use non-residential rates, while land with residential planning permission may be treated as residential.",
  },
  {
    question: "How is agricultural land taxed for stamp duty?",
    answer:
      "Agricultural land is classified as non-residential property for SDLT purposes. This means you pay 0% on the first £150,000, 2% on £150,001-£250,000, and 5% on anything over £250,000. There's no additional property surcharge for pure agricultural land, making it more tax-efficient than residential property.",
  },
  {
    question: "Does development land pay residential or commercial SDLT rates?",
    answer:
      "It depends on the planning status. Bare land without planning permission typically uses non-residential rates. However, land with residential planning permission or where residential development has begun may be treated as residential land, attracting higher rates and potentially the 5% additional property surcharge.",
  },
  {
    question: "Is there an additional property surcharge on land purchases?",
    answer:
      "The 5% additional property surcharge only applies to residential property and residential land. Agricultural land, commercial land, and development land without residential planning permission are exempt from the surcharge. If you're buying land with residential planning permission as an additional property, the surcharge would apply.",
  },
  {
    question: "What counts as residential land for SDLT?",
    answer:
      "Land counts as residential if: it has buildings used as dwellings, it's being developed for residential use and construction has begun, it's in the garden or grounds of a dwelling, or it has planning permission for residential development that's being acted upon. Land with only outline residential planning permission is usually still non-residential.",
  },
  {
    question: "How do I calculate stamp duty on a land purchase?",
    answer:
      "First, determine if the land is residential or non-residential for SDLT purposes. Then apply the relevant rates in bands (SDLT is calculated progressively, not as a flat rate). For non-residential land, rates are 0% up to £150,000, 2% on £150,001-£250,000, and 5% above £250,000.",
  },
  {
    question: "Is there stamp duty relief for farmland purchases?",
    answer:
      "There's no specific farmland relief, but agricultural land benefits from non-residential rates which are lower than residential rates. Transfers between certain family members may qualify for other reliefs. If buying a farm as a going concern with existing business, seek professional advice on whether relief applies.",
  },
  {
    question: "What about mixed-use land with residential and agricultural elements?",
    answer:
      "Mixed-use transactions (combining residential and non-residential elements) are typically taxed at non-residential rates, which can be advantageous. For example, buying a farmhouse with extensive agricultural land may qualify for non-residential rates on the entire purchase, even though part is residential.",
  },
];

const RELATED_PAGES = [
  {
    label: "Stamp Duty Calculator",
    href: "/",
    description: "Calculate stamp duty for residential property purchases",
  },
  {
    label: "Commercial Property Calculator",
    href: "/commercial",
    description: "Calculate SDLT for commercial and non-residential property",
  },
  {
    label: "Investment Property Calculator",
    href: "/investment-property",
    description: "SDLT for investment and buy-to-let property",
  },
  {
    label: "Company Purchase Calculator",
    href: "/company-purchase",
    description: "SDLT when buying through a limited company",
  },
];

const EXTERNAL_LINKS = [
  {
    label: "HMRC: SDLT on Land Transactions",
    href: "https://www.gov.uk/stamp-duty-land-tax",
    description: "Official HMRC guidance on Stamp Duty Land Tax",
  },
  {
    label: "HMRC: Non-Residential Property Rates",
    href: "https://www.gov.uk/stamp-duty-land-tax/nonresidential-and-mixed-use-rates",
    description: "Detailed rates for non-residential land and property",
  },
  {
    label: "HMRC: Mixed-Use Property Guidance",
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-mixed-use-property",
    description: "How mixed residential and non-residential purchases are taxed",
  },
];

export default function LandPage() {
  const [price, setPrice] = useState<number>(0);
  const [priceInput, setPriceInput] = useState("");
  const [landType, setLandType] = useState<LandType>("agricultural");
  const [isAdditional, setIsAdditional] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPriceInput(value);
    setPrice(parseInt(value) || 0);
  };

  // Calculate SDLT based on land type
  const isResidentialLand = landType === "residential" || (landType === "development" && isAdditional);
  const tax = isResidentialLand
    ? calculateResidentialLandSDLT(price, landType === "residential" && isAdditional)
    : calculateNonResidentialSDLT(price);
  const surcharge = (landType === "residential" && isAdditional) ? price * 0.05 : 0;

  return (
    <PageLayout
      title="Stamp Duty on Land Purchase Calculator UK 2025"
      subtitle="Calculate SDLT on agricultural land, development land, and residential land purchases"
      systemPrompt={LAND_PROMPT}
      initialMessage="I can help you calculate stamp duty on land purchases. What type of land are you looking to buy - agricultural, development, or residential land?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Land", href: "/land" }]}
      relatedPages={RELATED_PAGES}
      externalLinks={EXTERNAL_LINKS}
    >
      {/* Calculator */}
      <section className="mb-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Land Stamp Duty Calculator UK
            </h2>

            {/* Land Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Type of Land
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setLandType("agricultural")}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    landType === "agricultural"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  Agricultural Land
                </button>
                <button
                  onClick={() => setLandType("development")}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    landType === "development"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  Development Land
                </button>
                <button
                  onClick={() => setLandType("residential")}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    landType === "residential"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  Residential Land
                </button>
              </div>
            </div>

            {/* Additional Property Toggle for Residential Land */}
            {landType === "residential" && (
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAdditional}
                    onChange={(e) => setIsAdditional(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    This is an additional property (I already own residential property)
                  </span>
                </label>
              </div>
            )}

            {/* Price Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Land Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">
                  £
                </span>
                <input
                  type="text"
                  value={priceInput}
                  onChange={handlePriceChange}
                  placeholder="Enter land price"
                  className="w-full pl-8 pr-4 py-3 text-lg border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            {/* Land Type Info */}
            <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              {landType === "agricultural" && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <strong>Agricultural land</strong> uses non-residential SDLT rates. No
                  additional property surcharge applies. Includes farmland, woodland, and
                  land used for farming purposes.
                </p>
              )}
              {landType === "development" && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <strong>Development land</strong> without residential planning permission
                  uses non-residential rates. Land with full residential planning permission
                  may attract residential rates. Seek professional advice for complex cases.
                </p>
              )}
              {landType === "residential" && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <strong>Residential land</strong> includes gardens, land with dwellings,
                  and land where residential development has begun. Standard residential
                  SDLT rates apply, including the 5% surcharge if applicable.
                </p>
              )}
            </div>

            {/* Results */}
            {price > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <div className="text-center mb-6">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    Stamp Duty on Land Purchase
                  </p>
                  <p className="text-4xl font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(tax)}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Effective rate: {((tax / price) * 100).toFixed(2)}%
                  </p>
                  {surcharge > 0 && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                      Includes {formatCurrency(surcharge)} additional property surcharge
                    </p>
                  )}
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    Breakdown ({isResidentialLand ? "Residential" : "Non-Residential"} Rates)
                  </h3>
                  {isResidentialLand ? (
                    <div className="space-y-2 text-sm">
                      {landType === "residential" && isAdditional && (
                        <div className="flex justify-between text-amber-600 dark:text-amber-400">
                          <span>5% surcharge on {formatCurrency(price)}</span>
                          <span className="font-mono">{formatCurrency(surcharge)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Up to £250,000 @ 0%
                        </span>
                        <span className="font-mono">£0</span>
                      </div>
                      {price > 250000 && (
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">
                            £250,001-£925,000 @ 5%
                          </span>
                          <span className="font-mono">
                            {formatCurrency(Math.min(price - 250000, 675000) * 0.05)}
                          </span>
                        </div>
                      )}
                      {price > 925000 && (
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">
                            £925,001-£1,500,000 @ 10%
                          </span>
                          <span className="font-mono">
                            {formatCurrency(Math.min(price - 925000, 575000) * 0.1)}
                          </span>
                        </div>
                      )}
                      {price > 1500000 && (
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">
                            Over £1,500,000 @ 12%
                          </span>
                          <span className="font-mono">
                            {formatCurrency((price - 1500000) * 0.12)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Info */}
      <section className="mb-8">
        <InfoBox variant="info" title="Land SDLT Classification">
          <p>
            The stamp duty you pay on land depends on how HMRC classifies it. Agricultural
            and most development land uses <strong>non-residential rates</strong> (lower).
            Residential land uses <strong>standard residential rates</strong> and may
            attract the 5% surcharge if you already own property.
          </p>
        </InfoBox>
      </section>

      {/* Non-Residential Land Rates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Agricultural & Development Land SDLT Rates
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Agricultural land and development land without residential planning permission
          use non-residential (commercial) SDLT rates:
        </p>
        <SDLTRatesChart
          title="Non-Residential Land Rates"
          bands={NON_RESIDENTIAL_LAND_RATES}
          note="No additional property surcharge applies to non-residential land"
          variant="england"
        />
      </section>

      {/* Residential Land Rates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Residential Land SDLT Rates
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Land classified as residential (with dwellings, gardens, or active residential
          development) uses standard residential rates:
        </p>
        <SDLTRatesChart
          title="Residential Land Rates"
          bands={RESIDENTIAL_LAND_RATES}
          note="Add 5% to each band if this is an additional property"
          variant="england"
        />
      </section>

      {/* Land Type Comparison */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          SDLT by Land Type Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-4 text-zinc-600 dark:text-zinc-400">
                  Land Price
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Agricultural
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Development
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Residential
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Res + Surcharge
                </th>
              </tr>
            </thead>
            <tbody>
              {[150000, 250000, 400000, 500000, 750000, 1000000].map((p) => {
                const agricultural = calculateNonResidentialSDLT(p);
                const development = calculateNonResidentialSDLT(p);
                const residential = calculateResidentialLandSDLT(p, false);
                const residentialSurcharge = calculateResidentialLandSDLT(p, true);
                return (
                  <tr
                    key={p}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="p-4 font-medium">£{p.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-green-600 dark:text-green-400">
                      £{agricultural.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-amber-600 dark:text-amber-400">
                      £{development.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-blue-600 dark:text-blue-400">
                      £{residential.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-red-600 dark:text-red-400">
                      £{residentialSurcharge.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 italic">
          Development land rates shown assume no residential planning permission. Land with
          residential planning permission may attract residential rates.
        </p>
      </section>

      {/* Land Classifications */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Understanding Land Classifications for SDLT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
              Agricultural Land
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
              <li>- Farmland and pasture</li>
              <li>- Woodland and forestry</li>
              <li>- Land used for farming</li>
              <li>- No dwellings included</li>
              <li className="font-semibold mt-3">Uses: Non-residential rates</li>
            </ul>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3">
              Development Land
            </h3>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
              <li>- Bare land for building</li>
              <li>- Land with planning potential</li>
              <li>- Brownfield sites</li>
              <li>- Former industrial land</li>
              <li className="font-semibold mt-3">Uses: Usually non-residential rates*</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
              Residential Land
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>- Gardens and grounds</li>
              <li>- Land with dwellings</li>
              <li>- Active building sites</li>
              <li>- Acted-upon planning</li>
              <li className="font-semibold mt-3">Uses: Residential rates + surcharge</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 italic">
          *Development land with full residential planning permission being acted upon may be
          treated as residential land by HMRC.
        </p>
      </section>

      {/* Mixed Use Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Mixed-Use Land Transactions
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            When buying land that combines residential and non-residential elements (e.g.,
            a farmhouse with agricultural land), the entire transaction may qualify for
            non-residential rates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                Advantages of Mixed-Use
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>- Lower overall SDLT rates</li>
                <li>- No additional property surcharge</li>
                <li>- Can significantly reduce costs</li>
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                Requirements
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>- Genuine commercial/agricultural use</li>
                <li>- Not just incidental to dwelling</li>
                <li>- HMRC may challenge claims</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Official HMRC Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
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
        <h2>Stamp Duty on Land Purchase UK: Complete Guide 2025</h2>
        <p>
          When buying land in England or Northern Ireland, you may need to pay Stamp Duty
          Land Tax (SDLT). The amount depends on the type of land, its value, and whether
          you already own residential property. This guide explains how stamp duty on land
          purchases works and helps you calculate your liability.
        </p>

        <h3>Land Stamp Duty Calculator UK: How It Works</h3>
        <p>
          Our land stamp duty calculator applies the correct rates based on your land type.
          SDLT on land is calculated progressively in bands, not as a flat rate on the
          total price. The key question is whether your land is classified as residential
          or non-residential.
        </p>

        <h3>Agricultural Land Stamp Duty</h3>
        <p>
          Agricultural land is treated as non-residential property for SDLT purposes.
          This means lower rates and no additional property surcharge:
        </p>
        <ul>
          <li>0% on the first £150,000</li>
          <li>2% on £150,001 to £250,000</li>
          <li>5% on amounts over £250,000</li>
        </ul>
        <p>
          This applies to farmland, pasture, woodland, and land actively used for
          agricultural purposes. If the land includes a farmhouse, the transaction may
          still qualify for non-residential rates as a mixed-use purchase.
        </p>

        <h3>Development Land Stamp Duty</h3>
        <p>
          Bare development land without planning permission uses non-residential SDLT
          rates. However, the classification can change based on planning status:
        </p>
        <ul>
          <li><strong>No planning permission:</strong> Non-residential rates apply</li>
          <li><strong>Outline planning permission:</strong> Usually non-residential</li>
          <li><strong>Full planning permission (not acted upon):</strong> Usually non-residential</li>
          <li><strong>Planning permission being acted upon:</strong> May be residential</li>
          <li><strong>Construction begun:</strong> Residential rates likely apply</li>
        </ul>

        <h3>Residential Land Stamp Duty</h3>
        <p>
          Land is residential for SDLT if it includes dwellings, forms part of a dwelling's
          garden or grounds, or is being developed for residential use with construction
          underway. Residential land uses standard SDLT rates:
        </p>
        <ul>
          <li>0% on the first £250,000</li>
          <li>5% on £250,001 to £925,000</li>
          <li>10% on £925,001 to £1,500,000</li>
          <li>12% on amounts over £1,500,000</li>
        </ul>
        <p>
          The 5% additional property surcharge applies to residential land if you already
          own other residential property.
        </p>

        <h3>Stamp Duty on Land: Key Considerations</h3>
        <p>
          When calculating stamp duty on land purchase, consider:
        </p>
        <ul>
          <li><strong>Planning status:</strong> Can change classification between purchase and completion</li>
          <li><strong>Mixed-use potential:</strong> Combining residential and non-residential may reduce SDLT</li>
          <li><strong>Scotland and Wales:</strong> Different taxes apply (LBTT and LTT respectively)</li>
          <li><strong>Multiple Dwellings Relief:</strong> May apply if land includes several dwellings</li>
          <li><strong>Professional advice:</strong> Complex cases require specialist tax guidance</li>
        </ul>

        <h3>When to Pay Stamp Duty on Land</h3>
        <p>
          SDLT is due within 14 days of completion for land purchases over the threshold.
          For non-residential land, this is £150,000. For residential land, it's £250,000
          (or £40,000 if the additional property surcharge applies). Your solicitor will
          typically handle the SDLT return and payment as part of the conveyancing process.
        </p>
      </section>
    </PageLayout>
  );
}

// Helper functions for SDLT calculations
function calculateNonResidentialSDLT(price: number): number {
  let tax = 0;
  if (price > 150000) tax += Math.min(price - 150000, 100000) * 0.02;
  if (price > 250000) tax += (price - 250000) * 0.05;
  return Math.round(tax);
}

function calculateResidentialLandSDLT(price: number, isAdditional: boolean): number {
  let tax = 0;
  if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
  if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.1;
  if (price > 1500000) tax += (price - 1500000) * 0.12;
  if (isAdditional) tax += price * 0.05;
  return Math.round(tax);
}
