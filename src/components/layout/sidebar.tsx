"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

type SidebarProps = {
  userName: string;
};

export function Sidebar({ userName }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o drawer ao trocar de rota
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC fecha o drawer mobile
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Brand size="sm" />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </Button>
      </div>

      {/* Overlay (mobile) */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card text-card-foreground transition-transform duration-200",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Barra lateral"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <Brand size="md" showSubtitle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Fechar menu"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Bem-vindo(a)
          </p>
          <p className="truncate text-sm font-medium">{userName}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>

        <div className="border-t border-border px-3 py-3 space-y-1">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
