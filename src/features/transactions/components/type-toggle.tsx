"use client";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TransactionType } from "@/features/transactions/types";

type TypeToggleProps = {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
};

export function TypeToggle({ value, onChange, disabled }: TypeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Tipo da transação"
      className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/40 p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "RECEITA"}
        disabled={disabled}
        onClick={() => onChange("RECEITA")}
        className={cn(
          "flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors",
          value === "RECEITA"
            ? "bg-success text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <ArrowUpCircle className="h-4 w-4" aria-hidden />
        Receita
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "DESPESA"}
        disabled={disabled}
        onClick={() => onChange("DESPESA")}
        className={cn(
          "flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors",
          value === "DESPESA"
            ? "bg-danger text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <ArrowDownCircle className="h-4 w-4" aria-hidden />
        Despesa
      </button>
    </div>
  );
}
