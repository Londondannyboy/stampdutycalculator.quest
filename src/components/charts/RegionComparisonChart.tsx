"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { calculateSDLT, calculateLBTT, calculateLTT } from "@/lib/calculations/stamp-duty";

interface RegionComparisonChartProps {
  propertyPrice: number;
  showFTB?: boolean;
  showAdditional?: boolean;
}

export function RegionComparisonChart({
  propertyPrice,
  showFTB = false,
  showAdditional = false,
}: RegionComparisonChartProps) {
  // Calculate for each region
  const englandStandard = calculateSDLT(propertyPrice, false, false);
  const englandFTB = calculateSDLT(propertyPrice, true, false);
  const englandAdditional = calculateSDLT(propertyPrice, false, true);

  const scotlandStandard = calculateLBTT(propertyPrice, false, false);
  const scotlandFTB = calculateLBTT(propertyPrice, true, false);
  const scotlandAdditional = calculateLBTT(propertyPrice, false, true);

  const walesStandard = calculateLTT(propertyPrice, false);
  const walesAdditional = calculateLTT(propertyPrice, true);

  const data = [
    {
      region: "England",
      Standard: englandStandard,
      ...(showFTB && { "First-Time Buyer": englandFTB }),
      ...(showAdditional && { "Additional Property": englandAdditional }),
    },
    {
      region: "Scotland",
      Standard: scotlandStandard,
      ...(showFTB && { "First-Time Buyer": scotlandFTB }),
      ...(showAdditional && { "Additional Property": scotlandAdditional }),
    },
    {
      region: "Wales",
      Standard: walesStandard,
      ...(showFTB && { "First-Time Buyer": walesStandard }), // Wales has no FTB relief
      ...(showAdditional && { "Additional Property": walesAdditional }),
    },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        Stamp Duty Comparison by Region
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Property price: {formatCurrency(propertyPrice)}
      </p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="region" className="text-xs" />
            <YAxis
              tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
              className="text-xs"
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), ""]}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Legend />
            <Bar dataKey="Standard" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            {showFTB && (
              <Bar dataKey="First-Time Buyer" fill="#10B981" radius={[4, 4, 0, 0]} />
            )}
            {showAdditional && (
              <Bar dataKey="Additional Property" fill="#EF4444" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left py-2 text-zinc-600 dark:text-zinc-400">Region</th>
              <th className="text-right py-2 text-zinc-600 dark:text-zinc-400">Standard</th>
              {showFTB && (
                <th className="text-right py-2 text-zinc-600 dark:text-zinc-400">FTB</th>
              )}
              {showAdditional && (
                <th className="text-right py-2 text-zinc-600 dark:text-zinc-400">Additional</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.region} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 font-medium text-zinc-900 dark:text-zinc-100">
                  {row.region}
                </td>
                <td className="py-2 text-right font-mono text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(row.Standard)}
                </td>
                {showFTB && (
                  <td className="py-2 text-right font-mono text-green-600 dark:text-green-400">
                    {formatCurrency(row["First-Time Buyer"] || row.Standard)}
                  </td>
                )}
                {showAdditional && (
                  <td className="py-2 text-right font-mono text-red-600 dark:text-red-400">
                    {formatCurrency(row["Additional Property"] || 0)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RegionComparisonChart;
