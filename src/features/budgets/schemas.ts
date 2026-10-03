import { z } from "zod";

export const budgetFormSchema = z.object({
  idCategoria: z
    .number({ error: "Selecione uma categoria" })
    .int()
    .positive("Selecione uma categoria"),
  mes: z
    .number({ error: "Selecione um mês" })
    .int()
    .min(1, "Mês inválido")
    .max(12, "Mês inválido"),
  ano: z
    .number({ error: "Informe o ano" })
    .int()
    .min(2000, "Ano inválido")
    .max(2100, "Ano inválido"),
  limite: z
    .number({ error: "Informe o limite" })
    .positive("O limite deve ser maior que zero"),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
