import { apiFetch } from "@/lib/api-fetch";
import { BACKEND_ROUTES } from "@/lib/api-routes";

import type { Budget, CreateBudgetInput, UpdateBudgetInput } from "./types";

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Normaliza o DTO do backend (`categoriaId`, `consumido`) para o shape do front.
 * Backend manda também `percentualUtilizado`, `saldo`, `alertaAtivo` — guardamos
 * `gasto` populado pra resolveSpent() não precisar somar transações no client.
 */
function normalizeBudget(raw: unknown): Budget | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const id = asNumber(o.id);
  const idCategoria = asNumber(o.idCategoria ?? o.categoriaId);
  const mes = asNumber(o.mes);
  const ano = asNumber(o.ano);
  const limite = asNumber(o.limite);

  if (id === null || idCategoria === null || mes === null || ano === null || limite === null) {
    return null;
  }

  const gasto = asNumber(o.gasto ?? o.consumido ?? o.utilizado);

  return {
    id,
    idCategoria,
    mes,
    ano,
    limite,
    categoria: asString(o.categoria) ?? asString(o.nomeCategoria),
    nomeCategoria: asString(o.nomeCategoria),
    gasto: gasto ?? undefined,
  };
}

export async function listBudgets(): Promise<Budget[]> {
  const data = await apiFetch<unknown>(BACKEND_ROUTES.budgets.list);
  if (!Array.isArray(data)) return [];
  return data.map(normalizeBudget).filter((b): b is Budget => b !== null);
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const raw = await apiFetch<unknown>(BACKEND_ROUTES.budgets.create, {
    method: "POST",
    body: input,
  });
  const normalized = normalizeBudget(raw);
  if (!normalized) throw new Error("Resposta do servidor em formato inesperado");
  return normalized;
}

export async function updateBudget(
  id: number | string,
  input: UpdateBudgetInput,
): Promise<Budget> {
  const raw = await apiFetch<unknown>(BACKEND_ROUTES.budgets.update(id), {
    method: "PUT",
    body: input,
  });
  const normalized = normalizeBudget(raw);
  if (!normalized) throw new Error("Resposta do servidor em formato inesperado");
  return normalized;
}

export async function deleteBudget(id: number | string): Promise<void> {
  await apiFetch<unknown>(BACKEND_ROUTES.budgets.delete(id), {
    method: "DELETE",
  });
}
