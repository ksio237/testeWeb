export type LoginRequest = {
  email: string;
  senha: string;
};

export type RegisterRequest = {
  nome: string;
  email: string;
  senha: string;
};

// Confirmado com usuário em 2026-06-09: backend retorna `{ token: "..." }` no login.
export type LoginResponse = {
  token: string;
};

// TODO: confirmar com backend — formato exato do user retornado em register.
export type AuthUser = {
  id: string;
  nome: string;
  email: string;
};
