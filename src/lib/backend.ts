import "server-only";

import { env } from "./env";

export class BackendError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

type BackendFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  searchParams?: Record<string, string | undefined | null>;
  signal?: AbortSignal;
};

function buildUrl(path: string, searchParams?: BackendFetchOptions["searchParams"]): URL {
  const base = env.backendUrl.endsWith("/") ? env.backendUrl : `${env.backendUrl}/`;
  const url = new URL(path.replace(/^\//, ""), base);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }
  return url;
}

async function parseResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return text.length > 0 ? text : null;
}

function extractMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.length > 0) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.error === "string") return obj.error;
  }
  return fallback;
}

/**
 * Fetch server-only do backend. NÃO importar em código de cliente.
 * Recebe o token explicitamente (route handler que ler o cookie repassa).
 */
export async function backendFetch<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, token, searchParams, signal } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path, searchParams), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new BackendError(res.status, extractMessage(data, res.statusText), data);
  }

  return data as T;
}
