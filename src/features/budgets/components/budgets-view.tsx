"use client";

import { Plus, Target } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgets } from "@/features/budgets/hooks";
import { useCategories } from "@/features/categories/hooks";
import {
  buildCategoryMap,
  getCategoryName,
} from "@/features/transactions/category-lookup";
import { useTransactions } from "@/features/transactions/hooks";

import { resolveSpent } from "../spent";
import type { Budget } from "../types";
import { BudgetCard } from "./budget-card";
import { DeleteBudgetDialog } from "./delete-budget-dialog";
import { NewBudgetDialog } from "./new-budget-dialog";

export function BudgetsView() {
  const budgets = useBudgets();
  const categories = useCategories();
  const transactions = useTransactions();

  const [newOpen, setNewOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Budget | null>(null);

  const categoryMap = useMemo(
    () => buildCategoryMap(categories.data ?? []),
    [categories.data],
  );

  const items = useMemo(() => {
    const list = budgets.data ?? [];
    // Mais recentes primeiro (ano desc, mês desc)
    return [...list].sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.mes - a.mes;
    });
  }, [budgets.data]);

  const deletingName = toDelete
    ? getCategoryName(
        { idCategoria: toDelete.idCategoria, categoria: toDelete.categoria, nomeCategoria: toDelete.nomeCategoria },
        categoryMap,
      )
    : undefined;

  return (
    <>
      <PageHeader
        title="Orçamentos"
        description="Defina limites de gastos por categoria e mês."
        actions={
          <Button onClick={() => setNewOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Novo Orçamento
          </Button>
        }
      />

      {budgets.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : budgets.error ? (
        <EmptyState
          icon={Target}
          title="Não foi possível carregar seus orçamentos"
          description={(budgets.error as Error).message}
          action={
            <Button variant="outline" onClick={() => budgets.refetch()}>
              Tentar novamente
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhum orçamento cadastrado"
          description="Crie um orçamento por categoria e mês para acompanhar seus limites de gasto."
          action={
            <Button onClick={() => setNewOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" aria-hidden />
              Novo Orçamento
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((b) => {
            const categoryName = getCategoryName(
              { idCategoria: b.idCategoria, categoria: b.categoria, nomeCategoria: b.nomeCategoria },
              categoryMap,
            );
            const spent = resolveSpent(b, transactions.data ?? []);
            return (
              <BudgetCard
                key={b.id}
                budget={b}
                categoryName={categoryName}
                spent={spent}
                onRequestDelete={setToDelete}
              />
            );
          })}
        </div>
      )}

      <NewBudgetDialog open={newOpen} onClose={() => setNewOpen(false)} />
      <DeleteBudgetDialog
        budget={toDelete}
        categoryName={deletingName}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
