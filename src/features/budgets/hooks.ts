"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBudget,
  deleteBudget,
  listBudgets,
  updateBudget,
} from "./services";
import type { CreateBudgetInput, UpdateBudgetInput } from "./types";

export const budgetsKey = ["budgets"] as const;

export function useBudgets() {
  return useQuery({
    queryKey: budgetsKey,
    queryFn: listBudgets,
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBudgetInput) => createBudget(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: budgetsKey }),
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBudgetInput }) =>
      updateBudget(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: budgetsKey }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteBudget(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: budgetsKey }),
  });
}
