/**
 * Rotas do backend Spring Boot. Todas relativas a BACKEND_URL (http://localhost:8080/api).
 * Confirmadas pelo backend em 2026-06-10.
 */
export const BACKEND_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/users/register",
  },
  users: {
    me: "/users/me",
  },
  categories: {
    // TODO: confirmar — assumido /categoria (singular, padrão do backend).
    list: "/categoria",
  },
  transactions: {
    list: "/transaction",
    create: "/transaction",
    delete: (id: string | number) => `/transaction/${id}`,
    byType: (tipo: "D" | "R") => `/transaction/tipo/${tipo}`,
    byMonth: "/transaction/mes",
    byPeriod: "/transaction/periodo",
    byCategory: (idCategoria: string | number) =>
      `/transaction/categoria/${idCategoria}`,
  },
  dashboard: {
    resumo: "/transaction/dashboard/resumo",
    evolucao: "/transaction/dashboard/evolucao",
  },
  budgets: {
    list: "/orcamentos",
    create: "/orcamentos",
    get: (id: string | number) => `/orcamentos/${id}`,
    update: (id: string | number) => `/orcamentos/${id}`,
    delete: (id: string | number) => `/orcamentos/${id}`,
    byMonth: "/orcamentos/mes",
    byCategoryMonth: (idCategoria: string | number) =>
      `/orcamentos/categoria/${idCategoria}/mes`,
  },
} as const;

/**
 * Rotas do BFF (Route Handlers do próprio Next). Same-origin a partir do browser.
 */
export const BFF_ROUTES = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
  },
  backend: (path: string) => `/api/backend/${path.replace(/^\//, "")}`,
} as const;
