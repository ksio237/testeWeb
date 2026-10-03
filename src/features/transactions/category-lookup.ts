import type { Category } from "@/features/categories/types";

import type { Transaction } from "./types";

/**
 * Resolve o nome de exibição da categoria de uma transação.
 * Prioridade: campo já joined no DTO → lookup pelo id no mapa → fallback genérico.
 */
export function getCategoryName(
  transaction: Pick<Transaction, "idCategoria" | "categoria" | "nomeCategoria">,
  categoriesById: Map<number, Category>,
): string {
  if (typeof transaction.categoria === "string" && transaction.categoria.trim()) {
    return transaction.categoria;
  }
  if (typeof transaction.nomeCategoria === "string" && transaction.nomeCategoria.trim()) {
    return transaction.nomeCategoria;
  }
  const found = categoriesById.get(transaction.idCategoria);
  return found?.nome ?? `Categoria #${transaction.idCategoria}`;
}

export function buildCategoryMap(categories: Category[]): Map<number, Category> {
  const map = new Map<number, Category>();
  for (const c of categories) map.set(c.id, c);
  return map;
}
