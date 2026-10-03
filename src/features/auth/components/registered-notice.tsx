"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function RegisteredNotice() {
  const params = useSearchParams();
  if (params.get("registered") !== "1") return null;
  return (
    <div
      role="status"
      className="mb-4 flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
    >
      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
      <span>Conta criada! Faça login para continuar.</span>
    </div>
  );
}
