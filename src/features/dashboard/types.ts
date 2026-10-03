/**
 * Tipos do dashboard. Backend retorna esses payloads em
 * GET /transaction/dashboard/resumo?mes&ano e GET /transaction/dashboard/evolucao?ano.
 * TODO: confirmar com backend o shape exato — normalizamos em services.ts.
 */

export type ResumoCategoria = {
  idCategoria?: number;
  nome: string;
  total: number;
};

export type DashboardResumo = {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  categorias: ResumoCategoria[];
};

export type EvolucaoMes = {
  mes: number; // 1..12
  receitas: number;
  despesas: number;
};

export type DashboardEvolucao = {
  ano: number;
  meses: EvolucaoMes[];
};
