"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartShell } from "@/features/dashboard/components/chart-shell";
import { formatCurrency } from "@/lib/format";

type FlowPoint = {
  monthKey: string;
  label: string;
  receita: number;
  despesa: number;
  economia: number;
};

type FlowTrendChartProps = {
  data: FlowPoint[];
  isLoading?: boolean;
};

const compactBRL = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const SERIES_LABEL: Record<string, string> = {
  receita: "Receita",
  despesa: "Despesa",
  economia: "Economia",
};

export function FlowTrendChart({ data, isLoading }: FlowTrendChartProps) {
  const isEmpty =
    !isLoading &&
    data.every((d) => d.receita === 0 && d.despesa === 0 && d.economia === 0);

  return (
    <ChartShell
      title="Tendências de Fluxo"
      description="Receitas, despesas e economias ao longo do tempo"
      isLoading={isLoading}
      isEmpty={isEmpty}
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
            contentStyle={{
              backgroundColor: "rgb(var(--card))",
              borderColor: "rgb(var(--border))",
              borderRadius: 8,
              color: "rgb(var(--card-foreground))",
            }}
            formatter={(value, name) => [
              formatCurrency(typeof value === "number" ? value : Number(value) || 0),
              SERIES_LABEL[String(name)] ?? String(name ?? ""),
            ]}
            labelStyle={{ color: "rgb(var(--muted-foreground))" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 8 }}
            formatter={(value) => SERIES_LABEL[String(value)] ?? String(value)}
          />
          <Line
            type="monotone"
            dataKey="receita"
            stroke="rgb(var(--success))"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="despesa"
            stroke="rgb(var(--danger))"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="economia"
            stroke="rgb(var(--info))"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
