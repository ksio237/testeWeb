import { z } from "zod";

export const transactionFormSchema = z.object({
  tipo: z.enum(["RECEITA", "DESPESA"]),
  valor: z
    .number({ error: "Informe um valor" })
    .positive("O valor deve ser maior que zero"),
  idCategoria: z
    .number({ error: "Selecione uma categoria" })
    .int()
    .positive("Selecione uma categoria"),
  descricao: z.string().trim().min(1, "Informe uma descrição").max(120),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
