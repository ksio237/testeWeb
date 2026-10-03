import { BFF_ROUTES } from "@/lib/api-routes";

import type { LoginFormValues, RegisterFormValues } from "./schemas";

export class AuthApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

async function parseError(response: Response): Promise<AuthApiError> {
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // ignore
  }
  const message =
    (data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
      ? (data as { error: string }).error
      : null) ?? "Não foi possível concluir a operação";
  const fields =
    data && typeof data === "object" && "fields" in data && data.fields && typeof data.fields === "object"
      ? (data as { fields: Record<string, string[] | undefined> }).fields
      : undefined;
  return new AuthApiError(response.status, message, fields);
}

export async function login(values: LoginFormValues): Promise<void> {
  const res = await fetch(BFF_ROUTES.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw await parseError(res);
}

export async function register(values: RegisterFormValues): Promise<void> {
  const res = await fetch(BFF_ROUTES.auth.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw await parseError(res);
}

export async function logout(): Promise<void> {
  await fetch(BFF_ROUTES.auth.logout, { method: "POST" });
}
