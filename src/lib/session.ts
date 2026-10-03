import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import { env } from "./env";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days; backend JWT expiry may be shorter

/**
 * Lê o token JWT do cookie httpOnly. Server-only.
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(env.sessionCookieName)?.value ?? null;
}

/**
 * Grava o token JWT em um cookie httpOnly em uma resposta de route handler.
 */
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: env.sessionCookieName,
    value: token,
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/**
 * Apaga o cookie de sessão em uma resposta de route handler.
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: env.sessionCookieName,
    value: "",
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
