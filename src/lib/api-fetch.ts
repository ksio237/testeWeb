import { BFF_ROUTES } from "./api-routes";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | undefined | null>;
  signal?: AbortSignal;
};

function extractMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.length > 0) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.message === "string") return obj.message;
  }
  return fallback;
}

function buildPath(path: string, searchParams?: ApiFetchOptions["searchParams"]): string {
  const base = BFF_ROUTES.backend(path);
  if (!searchParams) return base;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, value);
    }
  }
  const queryString = qs.toString();
  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Faz chamadas ao BFF (/api/backend/*) que repassa para o backend Spring Boot.
 * Same-origin: o browser envia automaticamente o cookie httpOnly de sessão.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, searchParams, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(buildPath(path, searchParams), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const hasJson = contentType.includes("application/json");
  const data = hasJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, extractMessage(data, res.statusText), data);
  }

  return (data ?? undefined) as T;
}
