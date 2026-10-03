"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories } from "@/features/categories/hooks";
import type { TransactionFilters } from "@/features/transactions/types";

type TransactionFiltersProps = {
  value: TransactionFilters;
  onChange: (next: TransactionFilters) => void;
};

export function TransactionFiltersBar({ value, onChange }: TransactionFiltersProps) {
  const categories = useCategories();

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_180px_220px]">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Buscar por descrição..."
          aria-label="Buscar por descrição"
          value={value.descricao ?? ""}
          onChange={(e) => onChange({ ...value, descricao: e.target.value })}
          className="pl-9"
        />
      </div>

      <Select
        aria-label="Filtrar por tipo"
        value={value.tipo ?? "TODOS"}
        onChange={(e) =>
          onChange({
            ...value,
            tipo: e.target.value as TransactionFilters["tipo"],
          })
        }
      >
        <option value="TODOS">Todos os tipos</option>
        <option value="RECEITA">Receita</option>
        <option value="DESPESA">Despesa</option>
      </Select>

      <Select
        aria-label="Filtrar por categoria"
        value={value.idCategoria === undefined ? "TODAS" : String(value.idCategoria)}
        onChange={(e) =>
          onChange({
            ...value,
            idCategoria:
              e.target.value === "TODAS" ? "TODAS" : Number(e.target.value),
          })
        }
        disabled={categories.isLoading}
      >
        <option value="TODAS">Todas as categorias</option>
        {(categories.data ?? []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </Select>
    </div>
  );
}
