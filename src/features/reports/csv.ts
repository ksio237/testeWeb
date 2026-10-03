/**
 * Linha pronta pra CSV — desacoplada do DTO de Transaction
 * (a view enriquece com o nome da categoria via lookup).
 */
export type TransactionCsvRow = {
  data?: string;
  tipo: "RECEITA" | "DESPESA";
  categoria: string;
  descricao: string;
  valor: number;
};

function escape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function transactionsToCsv(rows: TransactionCsvRow[]): string {
  const header = ["Data", "Tipo", "Categoria", "Descrição", "Valor"];
  const data = rows.map((r) => [
    r.data ?? "",
    r.tipo === "RECEITA" ? "Receita" : "Despesa",
    r.categoria,
    r.descricao,
    r.valor.toFixed(2).replace(".", ","),
  ]);
  return [header, ...data].map((row) => row.map(escape).join(";")).join("\r\n");
}

export function downloadTransactionsCsv(rows: TransactionCsvRow[]): void {
  const csv = transactionsToCsv(rows);
  // BOM para garantir UTF-8 no Excel
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `finplan-transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
