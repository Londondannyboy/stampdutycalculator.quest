"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Band {
  threshold: number;
  rate: number;
  label: string;
}

interface SDLTRatesChartProps {
  title?: string;
  bands: Band[];
  note?: string;
  highlightBand?: number;
  variant?: "england" | "scotland" | "wales";
}

const COLORS = {
  england: ["#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"],
  scotland: ["#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6"],
  wales: ["#EF4444", "#DC2626", "#B91C1C", "#991B1B"],
};

export function SDLTRatesChart({
  title = "SDLT Rates",
  bands,
  note,
  highlightBand,
  variant = "england",
}: SDLTRatesChartProps) {
  const colors = COLORS[variant];

  const data = bands.map((band, index) => ({
    name: band.label,
    rate: band.rate,
    threshold: band.threshold,
    index,
  }));

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              type="number"
              domain={[0, Math.max(...bands.map((b) => b.rate)) + 2]}
              tickFormatter={(value) => `${value}%`}
              className="text-xs"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              className="text-xs"
              tick={{ fill: "#71717a", fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Rate"]}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  opacity={highlightBand === index ? 1 : 0.8}
                  stroke={highlightBand === index ? "#fff" : "none"}
                  strokeWidth={highlightBand === index ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rate table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left py-2 text-zinc-600 dark:text-zinc-400">Band</th>
              <th className="text-right py-2 text-zinc-600 dark:text-zinc-400">Rate</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((band, index) => (
              <tr
                key={index}
                className={`border-b border-zinc-100 dark:border-zinc-800 ${
                  highlightBand === index ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <td className="py-2 text-zinc-900 dark:text-zinc-100">{band.label}</td>
                <td className="py-2 text-right font-mono text-zinc-900 dark:text-zinc-100">
                  {band.rate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 italic">
          {note}
        </p>
      )}
    </div>
  );
}

export default SDLTRatesChart;
