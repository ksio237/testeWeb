"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/services";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await logout();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={pending}
      className="w-full justify-start gap-3 text-danger hover:text-danger"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      <span>{pending ? "Saindo..." : "Sair do sistema"}</span>
    </Button>
  );
}
