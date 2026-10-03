"use client";

import { Download } from "lucide-react";
import { useMemo } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { toFlowSeries, toMonthlySeries } from "@/features/dashboard/chart-data";
import { useDashboardEvolucao } from "@/features/dashboard/hooks";
import { useCategories } from "@/features/categories/hooks";
import {
  buildCategoryMap,
  getCategoryName,
} from "@/features/transactions/category-lookup";
import { useTransactions } from "@/features/transactions/hooks";

import { downloadTransactionsCsv } from "../csv";
import { FlowTrendChart } from "./flow-trend-chart";
import { MonthlyComparisonChart } from "./monthly-comparison-chart";

export function ReportsView() {
  const ano = new Date().getFullYear();
  const evolucao = useDashboardEvolucao(ano);
  const transactions = useTransactions();
  const categories = useCategories();

  const flow = useMemo(
    () => (evolucao.data ? toFlowSeries(evolucao.data) : []),
    [evolucao.data],
  );
  const monthly = useMemo(
    () => (evolucao.data ? toMonthlySeries(evolucao.data) : []),
    [evolucao.data],
  );

  const canExport = (transactions.data?.length ?? 0) > 0 && !transactions.isLoading;

  function handleExport() {
    if (!transactions.data) return;
    const categoryMap = buildCategoryMap(categories.data ?? []);
    const enriched = transactions.data.map((t) => ({
      ...t,
      categoria: getCategoryName(t, categoryMap),
      // CSV usa enum interno por extenso pra legibilidade
      tipo:
        t.tipo === "R" ? ("RECEITA" as const) : ("DESPESA" as const),
    }));
    downloadTransactionsCsv(enriched);
  }

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Tendências e comparativos das suas finanças."
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!canExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" aria-hidden />
            Exportar CSV
          </Button>
        }
      />

      <section className="grid gap-4">
        <FlowTrendChart data={flow} isLoading={evolucao.isLoading} />
        <MonthlyComparisonChart data={monthly} isLoading={evolucao.isLoading} />
      </section>
    </>
  );
}
