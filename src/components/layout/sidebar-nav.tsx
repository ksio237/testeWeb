"use client";

import { BarChart3, LayoutDashboard, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/painel", label: "Painel", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transações", icon: Wallet },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/orcamentos", label: "Orçamentos", icon: PiggyBank },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-muted",
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground/80",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
