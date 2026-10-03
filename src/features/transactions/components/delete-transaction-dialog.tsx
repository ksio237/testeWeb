"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDeleteTransaction } from "@/features/transactions/hooks";
import { ApiError } from "@/lib/api-fetch";

import type { Transaction } from "../types";

type DeleteTransactionDialogProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

export function DeleteTransactionDialog({
  transaction,
  onClose,
}: DeleteTransactionDialogProps) {
  const remove = useDeleteTransaction();
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!transaction) return;
    setError(null);
    try {
      await remove.mutateAsync(transaction.id);
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não foi possível excluir.");
    }
  }

  return (
    <Dialog
      open={transaction !== null}
      onClose={onClose}
      title="Confirmar Exclusão"
      size="sm"
    >
      <p className="text-sm text-muted-foreground">
        Tem certeza que deseja excluir esta transação?{" "}
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
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={remove.isPending}
        >
          {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Excluir
        </Button>
      </div>
    </Dialog>
  );
}
