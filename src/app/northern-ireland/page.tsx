"use client";

import { PageLayout } from "@/components/PageLayout";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { SDLTRatesChart, InfoBox, CalculationBreakdown } from "@/components/charts";
import { NORTHERN_IRELAND_PROMPT } from "@/lib/prompts";

const SDLT_STANDARD_RATES = [
  { threshold: 0, rate: 0, label: "Up to £250,000" },
  { threshold: 250000, rate: 5, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 10, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 12, label: "Over £1.5m" },
];

const SDLT_FTB_RATES = [
  { threshold: 0, rate: 0, label: "Up to £425,000" },
  { threshold: 425000, rate: 5, label: "£425,001 to £625,000" },
];

const SDLT_ADDITIONAL_RATES = [
  { threshold: 0, rate: 5, label: "Up to £250,000" },
  { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
  { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
  { threshold: 1500000, rate: 17, label: "Over £1.5m" },
];

const FAQS = [
  {
    question: "Does Northern Ireland use the same stamp duty as England?",
    answer:
      "Yes. Northern Ireland uses Stamp Duty Land Tax (SDLT), exactly the same system as England. Unlike Scotland (which has LBTT) and Wales (which has LTT), Northern Ireland did not devolve property taxes. SDLT is managed by HMRC, and all rates and thresholds are identical to England.",
  },
  {
    question: "Is there first-time buyer relief in Northern Ireland?",
    answer:
      "Yes. First-time buyers in Northern Ireland benefit from the same relief as in England. You pay 0% on the first £425,000 and 5% on the portion between £425,001 and £625,000. Properties over £625,000 don't qualify - you pay standard rates instead.",
  },
  {
    question: "What is the additional property surcharge in Northern Ireland?",
    answer:
      "Northern Ireland has the same 5% surcharge as England for additional properties. This applies to second homes, buy-to-let properties, and any residential purchase where you already own another property. The surcharge was increased from 3% in October 2024.",
  },
  {
    question: "How do I pay stamp duty in Northern Ireland?",
    answer:
      "SDLT in Northern Ireland must be paid to HMRC within 14 days of completing your property purchase. Your solicitor or conveyancer typically handles the SDLT return and payment as part of the conveyancing process, just like in England.",
  },
  {
    question: "Can I get a stamp duty refund in Northern Ireland?",
    answer:
      "Yes. If you paid the 5% surcharge because you owned two properties, but sell your previous main home within 3 years, you can claim a refund from HMRC. This is the same rule as England - apply within 12 months of the sale.",
  },
  {
    question: "Why doesn't Northern Ireland have its own property tax?",
    answer:
      "Unlike Scotland and Wales, Northern Ireland did not devolve property taxes after the devolution settlements. SDLT remains a reserved matter under HMRC control. This means NI property buyers follow the same rules, pay the same rates, and file returns with the same authority as buyers in England.",
  },
];

const RELATED_PAGES = [
  {
    label: "England SDLT Calculator",
    href: "/",
    description: "Same SDLT rates apply (England & NI share the system)",
  },
  {
    label: "Scotland LBTT Calculator",
    href: "/scotland",
    description: "Compare with Scottish Land and Buildings Transaction Tax",
  },
  {
    label: "Wales LTT Calculator",
    href: "/wales",
    description: "Compare with Welsh Land Transaction Tax",
  },
  {
    label: "First-Time Buyer Calculator",
    href: "/first-time-buyer",
    description: "Calculate FTB relief savings",
  },
];

const EXTERNAL_LINKS = [
  {
    href: "https://www.gov.uk/stamp-duty-land-tax",
    label: "HMRC - Stamp Duty Land Tax",
    description: "Official HMRC guidance on SDLT (applies to NI)",
  },
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates",
    label: "Current SDLT Rates",
    description: "Official HMRC SDLT rates for residential property",
  },
  {
    href: "https://www.gov.uk/guidance/stamp-duty-land-tax-relief-for-first-time-buyers",
    label: "First-Time Buyer Relief",
    description: "HMRC guidance on FTB relief (applies to NI)",
  },
  {
    href: "https://www.gov.uk/stamp-duty-land-tax/higher-rates-for-additional-properties",
    label: "Additional Property Rates",
    description: "5% surcharge guidance for second homes and buy-to-lets",
  },
];

export default function NorthernIrelandPage() {
  return (
    <PageLayout
      title="Northern Ireland Stamp Duty Calculator 2025"
      subtitle="Calculate SDLT for property purchases in Northern Ireland"
      systemPrompt={NORTHERN_IRELAND_PROMPT}
      initialMessage="I can help you calculate stamp duty for a Northern Ireland property. What's the purchase price you're considering?"
      faqs={FAQS}
      breadcrumbs={[{ label: "Northern Ireland", href: "/northern-ireland" }]}
      relatedPages={RELATED_PAGES}
      externalLinks={EXTERNAL_LINKS}
    >
      {/* Calculator */}
      <section className="mb-8">
        <StampDutyCalculator defaultRegion="england" />
      </section>

      {/* Key Info Box */}
      <section className="mb-8">
        <InfoBox variant="info" title="Northern Ireland Uses SDLT (Same as England)">
          <p>
            Northern Ireland is the only devolved nation that uses{" "}
            <strong>Stamp Duty Land Tax (SDLT)</strong>, the same system as England.
            Unlike Scotland (LBTT) and Wales (LTT), property taxes were not devolved
            to Northern Ireland.
          </p>
          <ul>
            <li>
              <strong>Same rates:</strong> Identical to England
            </li>
            <li>
              <strong>Same FTB relief:</strong> 0% up to £425,000
            </li>
            <li>
              <strong>Same surcharge:</strong> 5% for additional properties
            </li>
            <li>
              <strong>Filed with HMRC:</strong> Not a devolved authority
            </li>
          </ul>
        </InfoBox>
      </section>

      {/* SDLT Rates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          SDLT Rates 2025 (Northern Ireland)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SDLTRatesChart
            title="Standard Rates"
            bands={SDLT_STANDARD_RATES}
            note="Main residence purchases"
            variant="england"
          />
          <SDLTRatesChart
            title="First-Time Buyer Rates"
            bands={SDLT_FTB_RATES}
            note="Properties up to £625,000"
            variant="england"
          />
          <SDLTRatesChart
            title="Additional Property (+5%)"
            bands={SDLT_ADDITIONAL_RATES}
            note="Second homes & buy-to-lets"
            variant="england"
          />
        </div>
      </section>

      {/* NI vs Devolved Nations */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Northern Ireland vs Scotland & Wales
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            While Scotland and Wales have their own property tax systems, Northern
            Ireland shares SDLT with England. Here's how they compare:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left p-3 text-zinc-600 dark:text-zinc-400">
                    Feature
                  </th>
                  <th className="text-center p-3 text-zinc-600 dark:text-zinc-400">
                    NI & England
                  </th>
                  <th className="text-center p-3 text-zinc-600 dark:text-zinc-400">
                    Scotland
                  </th>
                  <th className="text-center p-3 text-zinc-600 dark:text-zinc-400">
                    Wales
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                    Tax Name
                  </td>
                  <td className="p-3 text-center text-blue-600 dark:text-blue-400">
                    SDLT
                  </td>
                  <td className="p-3 text-center text-purple-600 dark:text-purple-400">
                    LBTT
                  </td>
                  <td className="p-3 text-center text-red-600 dark:text-red-400">
                    LTT
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                    Nil Rate Band
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    £250,000
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    £145,000
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    £225,000
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                    FTB Nil Rate
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    £425,000
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    £175,000
                  </td>
                  <td className="p-3 text-center text-zinc-500">
                    No relief
                  </td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                    Additional Surcharge
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    5%
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    6% (ADS)
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    4%
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                    Authority
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    HMRC
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    Revenue Scotland
                  </td>
                  <td className="p-3 text-center text-zinc-700 dark:text-zinc-300">
                    WRA
                  </td>
                </tr>
              </tbody>
            </table>
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
            propertyPrice={300000}
            buyerType="ftb"
            region="england"
          />
          <CalculationBreakdown
            propertyPrice={400000}
            buyerType="additional"
            region="england"
          />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          SDLT at Common Property Prices
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
                  First-Time Buyer
                </th>
                <th className="text-right p-4 text-zinc-600 dark:text-zinc-400">
                  Additional Property
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { price: 250000, standard: 0, ftb: 0, additional: 12500 },
                { price: 300000, standard: 2500, ftb: 0, additional: 17500 },
                { price: 400000, standard: 7500, ftb: 0, additional: 27500 },
                { price: 500000, standard: 12500, ftb: 3750, additional: 37500 },
                { price: 625000, standard: 18750, ftb: 10000, additional: 50000 },
              ].map((row) => (
                <tr
                  key={row.price}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                    £{row.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-blue-600 dark:text-blue-400">
                    £{row.standard.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    £{row.ftb.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-red-600 dark:text-red-400">
                    £{row.additional.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          These rates are identical to England. NI and England share the SDLT system.
        </p>
      </section>

      {/* First-Time Buyer Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          First-Time Buyer Relief in Northern Ireland
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Northern Ireland offers the same first-time buyer relief as England.
            If you've never owned property before, you can benefit from significant
            stamp duty savings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                Current Relief (Until April 2025)
              </h3>
              <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
                <li>0% on first £425,000</li>
                <li>5% from £425,001 to £625,000</li>
                <li>Max property: £625,000</li>
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                New Relief (From April 2025)
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>0% on first £300,000</li>
                <li>5% from £300,001 to £500,000</li>
                <li>Max property: £500,000</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Note: Properties exceeding the maximum threshold don't qualify for any
            relief - standard rates apply to the entire purchase.
          </p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Understanding Stamp Duty in Northern Ireland</h2>
        <p>
          Northern Ireland is unique among the UK's devolved nations in that it uses
          the same property tax system as England: Stamp Duty Land Tax (SDLT). While
          Scotland introduced LBTT in 2015 and Wales introduced LTT in 2018, Northern
          Ireland retained SDLT under HMRC's administration.
        </p>

        <h3>Why Northern Ireland Uses SDLT</h3>
        <p>
          Property taxes were not included in the devolution settlement for Northern
          Ireland. As a result, SDLT remains a "reserved matter" controlled by the UK
          government and administered by HMRC. This means property buyers in Northern
          Ireland follow identical rules to those buying in England - same rates, same
          thresholds, same reliefs, and same filing requirements.
        </p>

        <h3>Benefits of the SDLT System for NI Buyers</h3>
        <p>
          Northern Ireland buyers benefit from England's relatively generous first-time
          buyer relief, with 0% on the first £425,000. This is more favorable than
          Scotland's £175,000 threshold and significantly better than Wales, which
          offers no first-time buyer relief at all. The 5% additional property surcharge
          is also lower than Scotland's 6% ADS, though higher than Wales's 4%.
        </p>

        <h3>Filing Your SDLT Return</h3>
        <p>
          Like buyers in England, Northern Ireland property purchasers must file their
          SDLT return and pay any tax due within 14 days of completion. Your solicitor
          or conveyancer will typically handle this as part of the conveyancing process.
          Returns are submitted electronically to HMRC.
        </p>

        <h3>Target Keywords</h3>
        <p>
          This stamp duty calculator Northern Ireland page helps you calculate Northern
          Ireland SDLT accurately. Whether you're searching for a Northern Ireland SDLT
          calculator or want to understand stamp duty rates in Northern Ireland, our
          calculator provides instant, accurate results based on current HMRC rates.
        </p>
      </section>
    </PageLayout>
  );
}
