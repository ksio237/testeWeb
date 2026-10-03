"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/format";

import type { CategorySlice } from "../chart-data";
import { ChartShell } from "./chart-shell";

const PALETTE = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

type CategoryChartProps = {
  data: CategorySlice[];
  isLoading?: boolean;
};

export function CategoryChart({ data, isLoading }: CategoryChartProps) {
  const isEmpty = !isLoading && data.length === 0;

  return (
    <ChartShell
      title="Divisão por Categoria"
      description="Despesas agrupadas"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="Sem despesas registradas"
    >
      <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-48 flex-1 sm:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="categoria"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={entry.categoria} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(var(--card))",
                  borderColor: "rgb(var(--border))",
                  borderRadius: 8,
                  color: "rgb(var(--card-foreground))",
                }}
                formatter={(value, name) => [
                  formatCurrency(typeof value === "number" ? value : Number(value) || 0),
                  String(name ?? ""),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul
          className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1 text-sm"
          aria-label="Legenda de categorias"
        >
          {data.map((entry, i) => (
            <li key={entry.categoria} className="flex items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                aria-hidden
              />
              <span className="truncate flex-1">{entry.categoria}</span>
              <span className="tabular-nums text-muted-foreground">
                {(entry.share * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartShell>
  );
}
