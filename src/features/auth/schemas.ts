import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  senha: z.string().min(1, "Informe sua senha"),
});

export const registerSchema = z
  .object({
    nome: z.string().trim().min(2, "Informe seu nome completo"),
    email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não coincidem",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
