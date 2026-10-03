import type { DashboardEvolucao, ResumoCategoria } from "./types";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export type MonthlyPoint = {
  monthKey: string;
  label: string;
  receita: number;
  despesa: number;
};

export type FlowPoint = MonthlyPoint & { economia: number };

export type CategorySlice = {
  categoria: string;
  total: number;
  share: number;
};

/** Cria 12 buckets do ano (1..12) preenchendo com 0 onde não houver dado. */
export function toMonthlySeries(evolucao: DashboardEvolucao): MonthlyPoint[] {
  const byMonth = new Map<number, { receita: number; despesa: number }>();
  for (const m of evolucao.meses) {
    byMonth.set(m.mes, { receita: m.receitas, despesa: m.despesas });
  }
  return MONTH_LABELS.map((label, idx) => {
    const mes = idx + 1;
    const entry = byMonth.get(mes) ?? { receita: 0, despesa: 0 };
    return {
      monthKey: `${evolucao.ano}-${String(mes).padStart(2, "0")}`,
      label: `${label}/${String(evolucao.ano).slice(-2)}`,
      receita: entry.receita,
      despesa: entry.despesa,
    };
  });
}

export function toFlowSeries(evolucao: DashboardEvolucao): FlowPoint[] {
  return toMonthlySeries(evolucao).map((p) => ({
    ...p,
    economia: Math.max(0, p.receita - p.despesa),
  }));
}

export function toCategorySlices(categorias: ResumoCategoria[]): CategorySlice[] {
  const grand = categorias.reduce((sum, c) => sum + c.total, 0);
  if (grand === 0) return [];
  return categorias
    .map((c) => ({ categoria: c.nome, total: c.total, share: c.total / grand }))
    .sort((a, b) => b.total - a.total);
}
