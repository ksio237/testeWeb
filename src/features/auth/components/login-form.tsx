"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AuthApiError, login } from "@/features/auth/services";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      await login(values);
      const next = searchParams.get("next");
      const target = next && next.startsWith("/") ? next : "/painel";
      router.replace(target);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof AuthApiError ? error.message : "Não foi possível fazer login.";
      setFormError(message);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="E-mail" error={errors.email?.message}>
        {(p) => (
          <Input
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            autoFocus
            {...p}
            {...register("email")}
          />
        )}
      </FormField>

      <FormField label="Senha" error={errors.senha?.message}>
        {(p) => (
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...p}
            {...register("senha")}
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
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
