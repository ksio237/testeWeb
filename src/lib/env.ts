import "server-only";

export const env = {
  backendUrl: process.env.BACKEND_URL ?? "http://localhost:8080/api",
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? "finplan_session",
  isProduction: process.env.NODE_ENV === "production",
};
