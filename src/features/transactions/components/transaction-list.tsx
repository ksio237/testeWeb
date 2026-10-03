"use client";

import { Filter, Trash2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/features/categories/types";
import { usePrivacy } from "@/providers/privacy-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { getCategoryIcon } from "../category-icons";
import { buildCategoryMap, getCategoryName } from "../category-lookup";
import type { Transaction } from "../types";

type TransactionListProps = {
  data?: Transaction[];
  categories?: Category[];
  isLoading: boolean;
  error?: Error | null;
  hasActiveFilters?: boolean;
  onDelete: (transaction: Transaction) => void;
  onRetry?: () => void;
  onClearFilters?: () => void;
};

export function TransactionList({
  data,
  categories,
  isLoading,
  error,
  hasActiveFilters,
  onDelete,
  onRetry,
  onClearFilters,
}: TransactionListProps) {
  const { isPrivate } = usePrivacy();
  const categoryMap = buildCategoryMap(categories ?? []);

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Wallet}
        title="Não foi possível carregar as transações"
        description={error.message}
        action={
          onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              Tentar novamente
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (!data || data.length === 0) {
    if (hasActiveFilters) {
      return (
        <EmptyState
          icon={Filter}
          title="Nenhum resultado para estes filtros"
          description="Tente ajustar o termo de busca, o tipo ou a categoria."
          action={
            onClearFilters ? (
              <Button variant="outline" onClick={onClearFilters}>
                Limpar filtros
              </Button>
            ) : undefined
          }
        />
      );
    }
    return (
      <EmptyState
        icon={Wallet}
        title="Nenhuma transação ainda"
        description="Crie sua primeira transação para começar a acompanhar suas finanças."
      />
    );
  }

  return (
    <Card className="divide-y divide-border">
      {data.map((t) => {
        const categoryName = getCategoryName(t, categoryMap);
        const Icon = getCategoryIcon(categoryName);
        const isReceita = t.tipo === "R";
        return (
          <div key={t.id} className="flex items-center gap-4 px-5 py-4">
            <span
              className={cn(
                "grid place-items-center rounded-full p-2.5",
                isReceita ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
              )}
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{t.descricao}</p>
              <p className="text-xs text-muted-foreground">
                {categoryName}
                {t.data ? ` · ${formatDate(t.data)}` : ""}
              </p>
            </div>
            <p
              className={cn(
                "shrink-0 text-sm font-semibold tabular-nums",
                isReceita ? "text-success" : "text-danger",
              )}
            >
              {isReceita ? "+" : "−"} {formatCurrency(t.valor, isPrivate)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Excluir ${t.descricao}`}
              onClick={() => onDelete(t)}
              className="text-muted-foreground hover:text-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        );
      })}
    </Card>
  );
}
