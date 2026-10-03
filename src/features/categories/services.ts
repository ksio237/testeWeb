import { apiFetch } from "@/lib/api-fetch";
import { BACKEND_ROUTES } from "@/lib/api-routes";

import type { Category } from "./types";

/**
 * Normaliza a resposta do backend para `Category[]`.
 * Aceita `{id, nome}[]` (esperado) e também `string[]` por defesa.
 */
function normalize(payload: unknown): Category[] {
  if (!Array.isArray(payload)) return [];
  return payload
    .map<Category | null>((entry, index) => {
      if (typeof entry === "string") {
        const nome = entry.trim();
        return nome ? { id: index, nome } : null;
      }
      if (entry && typeof entry === "object") {
        const obj = entry as Record<string, unknown>;
        const nome =
          (typeof obj.nome === "string" && obj.nome) ||
          (typeof obj.name === "string" && obj.name) ||
          null;
        if (!nome) return null;
        const rawId = obj.id ?? obj.idCategoria;
        const id =
          typeof rawId === "number"
            ? rawId
            : typeof rawId === "string" && rawId !== ""
              ? Number(rawId)
              : NaN;
        if (Number.isNaN(id)) return null;
        return { id, nome };
      }
      return null;
    })
    .filter((c): c is Category => c !== null);
}

export async function listCategories(): Promise<Category[]> {
  const raw = await apiFetch<unknown>(BACKEND_ROUTES.categories.list);
  return normalize(raw);
}
