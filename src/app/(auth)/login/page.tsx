import Link from "next/link";
import { Suspense } from "react";

import { Brand } from "@/components/ui/brand";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisteredNotice } from "@/features/auth/components/registered-notice";

export const metadata = {
  title: "Entrar — FinPlan",
};

export default function LoginPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        <Brand size="lg" showSubtitle />
        <CardTitle className="pt-2">Bem-vindo de volta</CardTitle>
        <CardDescription>
          Entre para continuar acompanhando suas finanças.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <RegisteredNotice />
          <LoginForm />
        </Suspense>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Não tem uma conta?
        <Link href="/registro" className="ml-1 font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </CardFooter>
    </Card>
  );
}
