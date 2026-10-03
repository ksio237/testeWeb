"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories } from "@/features/categories/hooks";
import { useCreateTransaction } from "@/features/transactions/hooks";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/features/transactions/schemas";
import type { CreateTransactionResponse } from "@/features/transactions/types";
import { ApiError } from "@/lib/api-fetch";

import { TypeToggle } from "./type-toggle";

type NewTransactionDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (response: CreateTransactionResponse) => void;
};

// `valor` fica de fora pra o placeholder "0,00" aparecer.
// React Hook Form mantém o campo como undefined até o usuário digitar.
const defaultValues: Partial<TransactionFormValues> = {
  tipo: "DESPESA",
  idCategoria: 0,
  descricao: "",
};

export function NewTransactionDialog({
  open,
  onClose,
  onCreated,
}: NewTransactionDialogProps) {
  const categories = useCategories();
  const create = useCreateTransaction();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  async function onSubmit(values: TransactionFormValues) {
    try {
      const response = await create.mutateAsync(values);
      onCreated?.(response);
      onClose();
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError ? error.message : "Não foi possível salvar a transação.",
      });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nova Transação"
      description="Registre uma nova receita ou despesa."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <TypeToggle value={field.value} onChange={field.onChange} disabled={isSubmitting} />
          )}
        />

        <FormField label="Valor (R$)" error={errors.valor?.message}>
          {(p) => (
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0,00"
              onFocus={(e) => e.currentTarget.select()}
              {...p}
              {...register("valor", { valueAsNumber: true })}
            />
          )}
        </FormField>

        <FormField
          label="Categoria"
          error={errors.idCategoria?.message}
          hint={categories.isLoading ? "Carregando categorias..." : undefined}
        >
          {(p) => (
            <Select
              disabled={categories.isLoading}
              {...p}
              {...register("idCategoria", { valueAsNumber: true })}
            >
              <option value={0}>Selecione...</option>
              {(categories.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField label="Descrição" error={errors.descricao?.message}>
          {(p) => (
            <Input placeholder="Ex.: Supermercado" {...p} {...register("descricao")} />
          )}
        </FormField>

        {errors.root?.message ? (
          <p className="text-sm text-danger" role="alert">
            {errors.root.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvar Transação
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
