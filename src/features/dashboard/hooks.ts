"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchEvolucao, fetchResumo } from "./services";

export const dashboardKeys = {
  resumo: (mes: number, ano: number) => ["dashboard", "resumo", mes, ano] as const,
  evolucao: (ano: number) => ["dashboard", "evolucao", ano] as const,
};

export function useDashboardResumo(mes: number, ano: number) {
  return useQuery({
    queryKey: dashboardKeys.resumo(mes, ano),
    queryFn: () => fetchResumo(mes, ano),
  });
}

export function useDashboardEvolucao(ano: number) {
  return useQuery({
    queryKey: dashboardKeys.evolucao(ano),
    queryFn: () => fetchEvolucao(ano),
  });
}
