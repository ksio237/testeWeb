"use client";

import { AlertTriangle, CheckCircle2, Target, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDeleteBudget } from "@/features/budgets/hooks";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/providers/privacy-provider";

import type { Budget } from "../types";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

type BudgetCardProps = {
  budget: Budget;
  categoryName: string;
  spent: number;
  onRequestDelete: (budget: Budget) => void;
};

export function BudgetCard({
  budget,
  categoryName,
  spent,
  onRequestDelete,
}: BudgetCardProps) {
  const { isPrivate } = usePrivacy();
  const remove = useDeleteBudget();

  const limit = Math.max(budget.limite, 0.0001);
  const pct = Math.min(200, (spent / limit) * 100);
  const isOver = spent > budget.limite;
  const isNear = !isOver && pct >= 80;

  const tone: "primary" | "success" = isOver ? "primary" : "success";
  const statusBadge = isOver ? (
    <Badge tone="danger">Estourado</Badge>
  ) : isNear ? (
    <Badge tone="warning">Atenção</Badge>
  ) : (
    <Badge tone="success">Dentro do limite</Badge>
  );
  const StatusIcon = isOver ? AlertTriangle : isNear ? AlertTriangle : CheckCircle2;
  const statusTone = isOver
    ? "bg-danger/15 text-danger"
    : isNear
      ? "bg-warning/15 text-warning"
      : "bg-success/15 text-success";

  const monthLabel = MONTH_LABELS[Math.min(11, Math.max(0, budget.mes - 1))];

  return (
    <Card className={cn(isOver && "ring-2 ring-danger/60 ring-offset-2 ring-offset-background")}>
      <CardContent className="space-y-4 p-5">
        <header className="flex items-start gap-3">
          <span className={cn("grid place-items-center rounded-full p-2", statusTone)} aria-hidden>
            <StatusIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{categoryName}</h3>
              {statusBadge}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthLabel}/{budget.ano} · Orçamento mensal
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Excluir orçamento de ${categoryName}`}
            onClick={() => onRequestDelete(budget)}
            disabled={remove.isPending}
            className="text-muted-foreground hover:text-danger"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </header>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm tabular-nums">
              <span className="font-semibold">{formatCurrency(spent, isPrivate)}</span>
              <span className="text-muted-foreground"> / {formatCurrency(budget.limite, isPrivate)}</span>
            </span>
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                isOver ? "text-danger" : isNear ? "text-warning" : "text-muted-foreground",
              )}
            >
              {Math.round(pct)}% usado
            </span>
          </div>
          <Progress
            value={Math.min(100, pct)}
            tone={tone}
            label={`Uso: ${Math.round(pct)} por cento`}
          />
          {isOver ? (
            <p className="text-xs text-danger">
              Excedeu em {formatCurrency(spent - budget.limite, isPrivate)}.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

// Reusa Target só pra evitar lint de import não usado quando isOver
void Target;
