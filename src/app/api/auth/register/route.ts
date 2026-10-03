import { NextResponse } from "next/server";

import { backendFetch, BackendError } from "@/lib/backend";
import { BACKEND_ROUTES } from "@/lib/api-routes";
import { registerSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { nome, email, senha } = parsed.data;

  try {
    await backendFetch(BACKEND_ROUTES.auth.register, {
      method: "POST",
      body: { nome, email, senha },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof BackendError) {
      // Conflict / e-mail já cadastrado: deixe o status do backend passar quando útil.
      const status = error.status >= 400 && error.status < 500 ? error.status : 502;
      const message =
        status === 409
          ? "E-mail já cadastrado."
          : error.message || "Não foi possível criar sua conta";
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor" },
      { status: 502 },
    );
  }
}
