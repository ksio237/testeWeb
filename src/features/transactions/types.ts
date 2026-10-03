/**
 * Tipo interno (UI) — usa palavras por extenso pra legibilidade.
 * Wire-format do backend usa "D"|"R" — conversão em services.ts.
 */
export type TransactionType = "RECEITA" | "DESPESA";

/** Wire type aceito pelo backend. */
export type BackendTransactionType = "D" | "R";

/**
 * Transação como retornada pelo backend. Campos otimistas:
 * - `idCategoria` sempre presente
 * - `categoria` ou `nomeCategoria` podem vir como nome (fazemos lookup via /categoria se não vier)
 * - `data` vem populada (backend define automaticamente)
 */
export type Transaction = {
  id: number;
  tipo: BackendTransactionType;
  valor: number;
  idCategoria: number;
  descricao: string;
  data?: string; // backend define automaticamente; pode vir como ISO datetime ou date
  categoria?: string; // nome — se backend já vier joined
  nomeCategoria?: string; // alternativa caso o backend use esse nome
};

export type TransactionFilters = {
  descricao?: string;
  tipo?: TransactionType | "TODOS";
  idCategoria?: number | "TODAS";
};

export type CreateTransactionInput = {
  tipo: TransactionType;
  valor: number;
  idCategoria: number;
  descricao: string;
};

export type CreateTransactionResponse = Transaction & {
  alertaOrcamento?: boolean;
};
