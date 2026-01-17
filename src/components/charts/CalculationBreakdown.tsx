"use client";

import { calculateSDLTBreakdown, calculateLBTTBreakdown, calculateLTTBreakdown } from "@/lib/calculations/stamp-duty";

interface CalculationBreakdownProps {
  propertyPrice: number;
  buyerType: "standard" | "ftb" | "additional";
  region: "england" | "scotland" | "wales";
  showBands?: boolean;
}

export function CalculationBreakdown({
  propertyPrice,
  buyerType,
  region,
  showBands = true,
}: CalculationBreakdownProps) {
  const isFirstTimeBuyer = buyerType === "ftb";
  const isAdditional = buyerType === "additional";

  let breakdown;
  let regionLabel;

  switch (region) {
    case "scotland":
      breakdown = calculateLBTTBreakdown(propertyPrice, isFirstTimeBuyer, isAdditional);
      regionLabel = "Scotland (LBTT)";
      break;
    case "wales":
      breakdown = calculateLTTBreakdown(propertyPrice, isAdditional);
      regionLabel = "Wales (LTT)";
      break;
    default:
      breakdown = calculateSDLTBreakdown(propertyPrice, isFirstTimeBuyer, isAdditional);
      regionLabel = "England & NI (SDLT)";
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Calculation Breakdown
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {regionLabel} • {buyerType === "ftb" ? "First-Time Buyer" : buyerType === "additional" ? "Additional Property" : "Standard Rate"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Property Price</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white">
            {formatCurrency(propertyPrice)}
          </p>
        </div>
      </div>

      {showBands && breakdown.bands && (
        <div className="space-y-2 mb-4">
          {breakdown.bands.map((band: { label: string; amount: number; taxDue: number }, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 px-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {band.label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  on {formatCurrency(band.amount)}
                </p>
              </div>
              <p className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(band.taxDue)}
              </p>
            </div>
          ))}
        </div>
      )}

      {isAdditional && (
        <div className="flex justify-between items-center py-2 px-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Additional Property Surcharge
          </p>
          <p className="text-sm font-mono font-medium text-red-700 dark:text-red-400">
            +{formatCurrency(breakdown.surcharge || 0)}
          </p>
        </div>
      )}

      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            Total Tax Due
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(breakdown.total)}
          </p>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Effective rate: {((breakdown.total / propertyPrice) * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export default CalculationBreakdown;
