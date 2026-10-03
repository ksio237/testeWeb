"use client";

import { AlertTriangle, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/features/categories/hooks";
import { useTransactions } from "@/features/transactions/hooks";
import type {
  Transaction,
  TransactionFilters,
} from "@/features/transactions/types";

import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import { NewTransactionDialog } from "./new-transaction-dialog";
import { TransactionFiltersBar } from "./transaction-filters";
import { TransactionList } from "./transaction-list";

const INITIAL_FILTERS: TransactionFilters = {
  descricao: "",
  tipo: "TODOS",
  idCategoria: "TODAS",
};

function hasActive(filters: TransactionFilters): boolean {
  return (
    Boolean(filters.descricao?.trim()) ||
    (filters.tipo !== undefined && filters.tipo !== "TODOS") ||
    (filters.idCategoria !== undefined && filters.idCategoria !== "TODAS")
  );
}

export function TransactionsView() {
  const [filters, setFilters] = useState<TransactionFilters>(INITIAL_FILTERS);
  const [newOpen, setNewOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Transaction | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const query = useTransactions();
  const categories = useCategories();

  const items = useMemo(() => {
    let list = query.data ?? [];

    if (filters.tipo === "RECEITA") list = list.filter((t) => t.tipo === "R");
    else if (filters.tipo === "DESPESA") list = list.filter((t) => t.tipo === "D");

    if (
      filters.idCategoria !== undefined &&
      filters.idCategoria !== "TODAS"
    ) {
      list = list.filter((t) => t.idCategoria === filters.idCategoria);
    }

    const term = filters.descricao?.trim().toLowerCase();
    if (term) {
      list = list.filter((t) => t.descricao.toLowerCase().includes(term));
    }
    return list;
  }, [query.data, filters]);

  return (
    <>
      <PageHeader
        title="Transações"
        description="Cadastre e acompanhe suas receitas e despesas."
        actions={
          <Button onClick={() => setNewOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Nova Transação
          </Button>
        }
      />

      {alert ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p className="flex-1">{alert}</p>
          <button
            type="button"
            onClick={() => setAlert(null)}
            aria-label="Dispensar aviso"
            className="rounded p-1 hover:bg-warning/20"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}

      <TransactionFiltersBar value={filters} onChange={setFilters} />

      <TransactionList
        data={items}
        categories={categories.data}
        isLoading={query.isLoading}
        error={query.error as Error | null}
        hasActiveFilters={hasActive(filters)}
        onDelete={setToDelete}
        onRetry={() => query.refetch()}
        onClearFilters={() => setFilters(INITIAL_FILTERS)}
      />

      <NewTransactionDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={(res) => {
          if (res.alertaOrcamento) {
            setAlert(
              "Atenção: esta transação fez você ultrapassar o orçamento de uma categoria.",
            );
          }
        }}
      />
      <DeleteTransactionDialog
        transaction={toDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
