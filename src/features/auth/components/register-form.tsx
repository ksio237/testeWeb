"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AuthApiError, register as registerUser } from "@/features/auth/services";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", senha: "", confirmarSenha: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      await registerUser(values);
      router.replace("/login?registered=1");
    } catch (error) {
      const message =
        error instanceof AuthApiError ? error.message : "Não foi possível criar a conta.";
      setFormError(message);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Nome completo" error={errors.nome?.message}>
        {(p) => (
          <Input
            placeholder="Seu nome"
            autoComplete="name"
            autoFocus
            {...p}
            {...register("nome")}
          />
        )}
      </FormField>

      <FormField label="E-mail" error={errors.email?.message}>
        {(p) => (
          <Input
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            {...p}
            {...register("email")}
          />
        )}
      </FormField>

      <FormField
        label="Senha"
        error={errors.senha?.message}
        hint="No mínimo 6 caracteres"
      >
        {(p) => (
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...p}
            {...register("senha")}
          />
        )}
      </FormField>

      <FormField label="Confirmar senha" error={errors.confirmarSenha?.message}>
        {(p) => (
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...p}
            {...register("confirmarSenha")}
          />
        )}
      </FormField>

      {formError ? (
        <p className="text-sm text-danger" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
