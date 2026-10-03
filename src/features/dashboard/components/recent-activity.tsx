"use client";

import { Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryIcon } from "@/features/transactions/category-icons";
import {
  buildCategoryMap,
  getCategoryName,
} from "@/features/transactions/category-lookup";
import type { Transaction } from "@/features/transactions/types";
import type { Category } from "@/features/categories/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/providers/privacy-provider";

type RecentActivityProps = {
  data: Transaction[];
  categories?: Category[];
  isLoading?: boolean;
};

export function RecentActivity({
  data,
  categories,
  isLoading,
}: RecentActivityProps) {
  const { isPrivate } = usePrivacy();
  const categoryMap = buildCategoryMap(categories ?? []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Atividades Recentes</CardTitle>
        <CardDescription>Últimas transações registradas</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
            <Activity className="h-6 w-6" aria-hidden />
            <span>Nenhuma transação ainda.</span>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((t) => {
              const categoryName = getCategoryName(t, categoryMap);
              const Icon = getCategoryIcon(categoryName);
              const isReceita = t.tipo === "R";
              return (
                <li
                  key={t.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className={cn(
                      "grid place-items-center rounded-full p-2",
                      isReceita ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
                    )}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.descricao}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryName}
                      {t.data ? ` · ${formatDate(t.data)}` : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      isReceita ? "text-success" : "text-danger",
                    )}
                  >
                    {isReceita ? "+" : "−"} {formatCurrency(t.valor, isPrivate)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
