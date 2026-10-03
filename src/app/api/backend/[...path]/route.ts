import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { clearSessionCookie, getSessionToken } from "@/lib/session";

type Ctx = { params: Promise<{ path: string[] }> };

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
]);

function backendBase(): string {
  return env.backendUrl.endsWith("/") ? env.backendUrl : `${env.backendUrl}/`;
}

async function handle(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const targetUrl = new URL(path.join("/"), backendBase());
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);
  const reqContentType = request.headers.get("content-type");
  if (reqContentType) headers.set("Content-Type", reqContentType);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(targetUrl, init);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor" },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  const body = await backendRes.arrayBuffer();
  const response = new NextResponse(body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers: responseHeaders,
  });

  // Token expirou ou inválido: limpa o cookie para o middleware redirecionar.
  if (backendRes.status === 401) {
    clearSessionCookie(response);
  }

  return response;
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
