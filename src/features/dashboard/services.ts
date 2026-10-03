import { apiFetch } from "@/lib/api-fetch";
import { BACKEND_ROUTES } from "@/lib/api-routes";

import type {
  DashboardEvolucao,
  DashboardResumo,
  EvolucaoMes,
  ResumoCategoria,
} from "./types";

function num(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function normalizeCategorias(payload: unknown): ResumoCategoria[] {
  if (!Array.isArray(payload)) return [];
  return payload
    .map<ResumoCategoria | null>((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const obj = entry as Record<string, unknown>;
      const nome =
        (typeof obj.nome === "string" && obj.nome) ||
        (typeof obj.nomeCategoria === "string" && obj.nomeCategoria) ||
        (typeof obj.categoria === "string" && obj.categoria) ||
        null;
      if (!nome) return null;
      const idRaw = obj.idCategoria ?? obj.id;
      const idCategoria =
        typeof idRaw === "number"
          ? idRaw
          : typeof idRaw === "string"
            ? Number(idRaw) || undefined
            : undefined;
      const total = num(obj.total ?? obj.valor ?? obj.totalDespesas);
      return { idCategoria, nome, total };
    })
    .filter((c): c is ResumoCategoria => c !== null);
}

function normalizeResumo(payload: unknown): DashboardResumo {
  const obj =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const totalReceitas = num(obj.totalReceitas ?? obj.totalReceita);
  const totalDespesas = num(obj.totalDespesas ?? obj.totalDespesa);
  const saldo = num(obj.saldo) || totalReceitas - totalDespesas;
  // Backend retorna `despesasPorCategoria`. Outros nomes mantidos por defesa.
  const categorias = normalizeCategorias(
    obj.despesasPorCategoria ?? obj.categorias ?? obj.porCategoria ?? obj.breakdown ?? [],
  );
  return { totalReceitas, totalDespesas, saldo, categorias };
}

function normalizeEvolucao(payload: unknown, ano: number): DashboardEvolucao {
  const obj =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};

  // Mapa mes → {receitas, despesas}. Aceita duas formas de payload:
  // A) Backend Spring atual: { ano, receitas: [{mes, total}], despesas: [{mes, total}] }
  // B) Forma alternativa: [{mes, receitas, despesas}] no top-level.
  const buckets = new Map<number, { receitas: number; despesas: number }>();

  const addBucket = (entries: unknown, key: "receitas" | "despesas") => {
    if (!Array.isArray(entries)) return;
    for (const entry of entries) {
      if (!entry || typeof entry !== "object") continue;
      const e = entry as Record<string, unknown>;
      const mes =
        typeof e.mes === "number" ? e.mes : typeof e.mes === "string" ? Number(e.mes) : NaN;
      if (!Number.isFinite(mes) || mes < 1 || mes > 12) continue;
      const total = num(e.total ?? e.valor ?? e.totalReceitas ?? e.totalDespesas);
      const cur = buckets.get(mes) ?? { receitas: 0, despesas: 0 };
      cur[key] = total;
      buckets.set(mes, cur);
    }
  };

  addBucket(obj.receitas, "receitas");
  addBucket(obj.despesas, "despesas");

  // Caso B: array com receitas+despesas por linha
  const flatArray = Array.isArray(payload)
    ? payload
    : Array.isArray((obj as { meses?: unknown }).meses)
      ? ((obj as { meses: unknown[] }).meses as unknown[])
      : [];
  for (const entry of flatArray) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    const mes =
      typeof e.mes === "number" ? e.mes : typeof e.mes === "string" ? Number(e.mes) : NaN;
    if (!Number.isFinite(mes) || mes < 1 || mes > 12) continue;
    const r = e.receitas ?? e.totalReceitas;
    const d = e.despesas ?? e.totalDespesas;
    if (typeof r === "number" || typeof d === "number") {
      buckets.set(mes, { receitas: num(r), despesas: num(d) });
    }
  }

  const meses: EvolucaoMes[] = Array.from(buckets.entries())
    .map(([mes, v]) => ({ mes, receitas: v.receitas, despesas: v.despesas }))
    .sort((a, b) => a.mes - b.mes);

  const anoEfetivo = typeof obj.ano === "number" ? obj.ano : ano;
  return { ano: anoEfetivo, meses };
}

export async function fetchResumo(
  mes: number,
  ano: number,
): Promise<DashboardResumo> {
  const raw = await apiFetch<unknown>(BACKEND_ROUTES.dashboard.resumo, {
    searchParams: { mes: String(mes), ano: String(ano) },
  });
  return normalizeResumo(raw);
}

export async function fetchEvolucao(ano: number): Promise<DashboardEvolucao> {
  const raw = await apiFetch<unknown>(BACKEND_ROUTES.dashboard.evolucao, {
    searchParams: { ano: String(ano) },
  });
  return normalizeEvolucao(raw, ano);
}
