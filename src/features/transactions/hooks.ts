"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTransaction,
  deleteTransaction,
  listTransactions,
} from "./services";
import type { CreateTransactionInput } from "./types";

export const transactionsKey = ["transactions"] as const;

export function useTransactions() {
  return useQuery({
    queryKey: transactionsKey,
    queryFn: listTransactions,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transactionsKey });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteTransaction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transactionsKey });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
