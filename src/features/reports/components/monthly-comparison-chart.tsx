"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartShell } from "@/features/dashboard/components/chart-shell";
import { formatCurrency } from "@/lib/format";

type MonthlyPoint = {
  monthKey: string;
  label: string;
  receita: number;
  despesa: number;
};

type MonthlyComparisonChartProps = {
  data: MonthlyPoint[];
  isLoading?: boolean;
};

const compactBRL = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function MonthlyComparisonChart({
  data,
  isLoading,
}: MonthlyComparisonChartProps) {
  const isEmpty =
    !isLoading && data.every((d) => d.receita === 0 && d.despesa === 0);

  return (
    <ChartShell
      title="Comparativo Mensal"
      description="Receita versus despesa por mês"
      isLoading={isLoading}
      isEmpty={isEmpty}
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            stroke="rgb(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgb(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={70}
            tickFormatter={(v: number) => `R$ ${compactBRL.format(v)}`}
          />
          <Tooltip
            cursor={{ fill: "rgb(var(--muted))", opacity: 0.4 }}
            contentStyle={{
              backgroundColor: "rgb(var(--card))",
              borderColor: "rgb(var(--border))",
              borderRadius: 8,
              color: "rgb(var(--card-foreground))",
            }}
            formatter={(value, name) => [
              formatCurrency(typeof value === "number" ? value : Number(value) || 0),
              name === "receita" ? "Receita" : "Despesa",
            ]}
            labelStyle={{ color: "rgb(var(--muted-foreground))" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 8 }}
            formatter={(value) => (value === "receita" ? "Receita" : "Despesa")}
          />
          <Bar dataKey="receita" fill="rgb(var(--success))" radius={[6, 6, 0, 0]} />
          <Bar dataKey="despesa" fill="rgb(var(--danger))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
