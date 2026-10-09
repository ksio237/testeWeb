import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { getSessionUser } from "@/lib/auth-user";
import { getSessionToken } from "@/lib/session";

// export default async function AppLayout({ children }: { children: ReactNode }) {
//   const user = await getSessionUser();
//   if (!user) {
//     // proxy.ts já deve ter redirecionado, mas garantimos a segurança no servidor.
//     redirect("/login");
//   }

export default async function AppLayout({ children }: { children: ReactNode }) {
  // const skipAuth =
  //   process.env.NODE_ENV === "development" && process.env.SKIP_AUTH === "true";
  const skipAuth = process.env.SKIP_AUTH === "true";
  const user = skipAuth ? { nome: "Dev" } : await getSessionUser();
  if (!user) {
    // proxy.ts já deve ter redirecionado, mas garantimos a segurança no servidor.
    // dentro da função:
    const skipAuth = process.env.SKIP_AUTH === "true";
    const user = skipAuth
      ? (await getSessionToken())
        ? { nome: "Dev" }
        : null
      : await getSessionUser();
    if (!user) {
      redirect("/login");
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar userName={"Dev"} />
      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:pl-10">
        <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
      </main>
    </div>
  );
}
