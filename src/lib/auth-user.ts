import "server-only";

import { BACKEND_ROUTES } from "./api-routes";
import { backendFetch, BackendError } from "./backend";
import { getSessionToken } from "./session";

export type SessionUser = {
  id?: number;
  nome: string;
  email: string;
};

type BackendUser = {
  id?: number;
  nome?: string;
  name?: string;
  email?: string;
};

/**
 * Busca o usuário autenticado via GET /users/me usando o token do cookie.
 * Retorna null se não há sessão ou o token foi rejeitado.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const user = await backendFetch<BackendUser>(BACKEND_ROUTES.users.me, {
      token,
    });
    const nome = user.nome ?? user.name ?? user.email ?? "Usuário";
    const email = user.email ?? "";
    return { id: user.id, nome, email };
  } catch (error) {
    // Token inválido/expirado ou backend offline — tratamos como sem sessão.
    if (error instanceof BackendError && error.status === 401) return null;
    return null;
  }
}
