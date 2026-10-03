import Link from "next/link";

import { Brand } from "@/components/ui/brand";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = {
  title: "Criar conta — FinPlan",
};

export default function RegisterPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        <Brand size="lg" showSubtitle />
        <CardTitle className="pt-2">Crie sua conta</CardTitle>
        <CardDescription>
          Organize receitas, despesas e metas em um só lugar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Já tem uma conta?
        <Link href="/login" className="ml-1 font-medium text-primary hover:underline">
          Entrar
        </Link>
      </CardFooter>
    </Card>
  );
}
