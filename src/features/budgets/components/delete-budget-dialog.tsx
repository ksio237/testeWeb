"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDeleteBudget } from "@/features/budgets/hooks";
import { ApiError } from "@/lib/api-fetch";

import type { Budget } from "../types";

type DeleteBudgetDialogProps = {
  budget: Budget | null;
  categoryName?: string;
  onClose: () => void;
};

export function DeleteBudgetDialog({
  budget,
  categoryName,
  onClose,
}: DeleteBudgetDialogProps) {
  const remove = useDeleteBudget();
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!budget) return;
    setError(null);
    try {
      await remove.mutateAsync(budget.id);
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não foi possível excluir.");
    }
  }

  return (
    <Dialog open={budget !== null} onClose={onClose} title="Excluir Orçamento" size="sm">
      <p className="text-sm text-muted-foreground">
        Tem certeza que deseja excluir o orçamento
        {categoryName ? ` de "${categoryName}"` : ""}?{" "}
        <span className="text-foreground">Esta operação não pode ser desfeita.</span>
      </p>
      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={remove.isPending}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleConfirm} disabled={remove.isPending}>
          {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Excluir
        </Button>
      </div>
    </Dialog>
  );
}
