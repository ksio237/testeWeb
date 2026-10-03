import { apiFetch } from "@/lib/api-fetch";
import { BACKEND_ROUTES } from "@/lib/api-routes";

import type {
  BackendTransactionType,
  CreateTransactionInput,
  CreateTransactionResponse,
  Transaction,
  TransactionType,
} from "./types";

function toBackendType(tipo: TransactionType): BackendTransactionType {
  return tipo === "RECEITA" ? "R" : "D";
}

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
 * Normaliza a resposta do backend (que usa `idTransacao` e `dataHoraTransacao`)
 * para o shape interno (`id` e `data`). Defensivo contra variações de nome.
 */
function normalizeTransaction(raw: unknown): Transaction | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const id = asNumber(o.id ?? o.idTransacao);
  const idCategoria = asNumber(o.idCategoria);
  const valor = asNumber(o.valor);
  const tipo = o.tipo;
  if (id === null || idCategoria === null || valor === null) return null;
  if (tipo !== "R" && tipo !== "D") return null;

  return {
    id,
    tipo,
    valor,
    idCategoria,
    descricao: asString(o.descricao) ?? "",
    data: asString(o.data) ?? asString(o.dataHoraTransacao),
    categoria: asString(o.categoria) ?? asString(o.nomeCategoria),
    nomeCategoria: asString(o.nomeCategoria),
  };
}

export async function listTransactions(): Promise<Transaction[]> {
  const data = await apiFetch<unknown>(BACKEND_ROUTES.transactions.list);
  if (!Array.isArray(data)) return [];
  return data
    .map(normalizeTransaction)
    .filter((t): t is Transaction => t !== null);
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<CreateTransactionResponse> {
  const raw = await apiFetch<unknown>(BACKEND_ROUTES.transactions.create, {
    method: "POST",
    body: {
      tipo: toBackendType(input.tipo),
      valor: input.valor,
      idCategoria: input.idCategoria,
      descricao: input.descricao,
    },
  });
  const normalized = normalizeTransaction(raw);
  if (!normalized) {
    throw new Error("Resposta do servidor em formato inesperado");
  }
  // Preserva alertaOrcamento (campo extra, não faz parte do normalize base).
  const alerta =
    raw && typeof raw === "object" && "alertaOrcamento" in raw
      ? Boolean((raw as { alertaOrcamento: unknown }).alertaOrcamento)
      : undefined;
  return { ...normalized, alertaOrcamento: alerta };
}

export async function deleteTransaction(id: number | string): Promise<void> {
  await apiFetch<unknown>(BACKEND_ROUTES.transactions.delete(id), {
    method: "DELETE",
  });
}
