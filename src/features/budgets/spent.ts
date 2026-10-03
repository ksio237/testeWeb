import type { Transaction } from "@/features/transactions/types";

import type { Budget } from "./types";

function parseDate(raw: string | undefined | null): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function transactionDate(t: Transaction): Date | null {
  return parseDate(t.data);
}

/**
 * Soma despesas que se encaixam no mês/ano/categoria do orçamento.
 * Se o backend já vier com `gasto` no DTO, prefira isso (não chamamos esta função).
 */
export function computeSpentForBudget(
  budget: Budget,
  transactions: Transaction[],
): number {
  return transactions.reduce((sum, t) => {
    if (t.tipo !== "D") return sum;
    if (t.idCategoria !== budget.idCategoria) return sum;
    const d = transactionDate(t);
    if (!d) return sum;
    if (d.getMonth() + 1 !== budget.mes) return sum;
    if (d.getFullYear() !== budget.ano) return sum;
    return sum + t.valor;
  }, 0);
}

export function resolveSpent(
  budget: Budget,
  transactions: Transaction[],
): number {
  if (typeof budget.gasto === "number") return budget.gasto;
  if (typeof budget.utilizado === "number") return budget.utilizado;
  return computeSpentForBudget(budget, transactions);
}
