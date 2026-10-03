/**
 * Orçamento mensal por categoria. Backend: POST /orcamentos body
 * {idCategoria, mes, ano, limite}. RF06 + RF10 (alertaOrcamento ao criar transação).
 */
export type Budget = {
  id: number;
  idCategoria: number;
  mes: number; // 1..12
  ano: number;
  limite: number;
  // Possíveis campos joined pelo backend (otimista):
  categoria?: string;
  nomeCategoria?: string;
  gasto?: number;
  utilizado?: number;
};

export type CreateBudgetInput = {
  idCategoria: number;
  mes: number;
  ano: number;
  limite: number;
};

export type UpdateBudgetInput = {
  limite: number;
};
