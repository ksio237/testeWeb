"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories } from "@/features/categories/hooks";
import { useCreateBudget } from "@/features/budgets/hooks";
import {
  budgetFormSchema,
  type BudgetFormValues,
} from "@/features/budgets/schemas";
import { ApiError } from "@/lib/api-fetch";

const MONTH_OPTIONS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

type NewBudgetDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function NewBudgetDialog({ open, onClose }: NewBudgetDialogProps) {
  const categories = useCategories();
  const create = useCreateBudget();
  const now = new Date();

  // `limite` fica de fora pra o placeholder "0,00" aparecer.
  const defaultValues: Partial<BudgetFormValues> = {
    idCategoria: 0,
    mes: now.getMonth() + 1,
    ano: now.getFullYear(),
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(values: BudgetFormValues) {
    try {
      await create.mutateAsync(values);
      onClose();
    } catch (e) {
      setError("root", {
        message: e instanceof ApiError ? e.message : "Não foi possível criar o orçamento.",
      });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Novo Orçamento"
      description="Defina um limite de gastos por categoria e mês."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Mês" error={errors.mes?.message}>
            {(p) => (
              <Select {...p} {...register("mes", { valueAsNumber: true })}>
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Ano" error={errors.ano?.message}>
            {(p) => (
              <Input
                type="number"
                min="2000"
                max="2100"
                onFocus={(e) => e.currentTarget.select()}
                {...p}
                {...register("ano", { valueAsNumber: true })}
              />
            )}
          </FormField>
        </div>

        <FormField label="Limite (R$)" error={errors.limite?.message}>
          {(p) => (
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0,00"
              onFocus={(e) => e.currentTarget.select()}
              {...p}
              {...register("limite", { valueAsNumber: true })}
            />
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
            Salvar Orçamento
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
