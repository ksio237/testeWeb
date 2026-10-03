import { NextResponse } from "next/server";

import { backendFetch, BackendError } from "@/lib/backend";
import { BACKEND_ROUTES } from "@/lib/api-routes";
import { setSessionCookie } from "@/lib/session";
import { loginSchema } from "@/features/auth/schemas";
import type { LoginResponse } from "@/features/auth/types";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const data = await backendFetch<LoginResponse>(BACKEND_ROUTES.auth.login, {
      method: "POST",
      body: parsed.data,
    });

    if (!data?.token) {
      return NextResponse.json(
        { error: "Resposta do servidor sem token" },
        { status: 502 },
      );
    }

    const response = NextResponse.json({ ok: true });
    setSessionCookie(response, data.token);
    return response;
  } catch (error) {
    if (error instanceof BackendError) {
      const status = error.status === 401 || error.status === 403 ? 401 : error.status;
      const message =
        status === 401 ? "E-mail ou senha inválidos." : error.message || "Falha no login";
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor" },
      { status: 502 },
    );
  }
}
