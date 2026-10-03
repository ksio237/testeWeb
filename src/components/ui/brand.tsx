import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
};

const sizeMap = {
  sm: { icon: "h-5 w-5", title: "text-base", wrap: "gap-2" },
  md: { icon: "h-6 w-6", title: "text-lg", wrap: "gap-2.5" },
  lg: { icon: "h-8 w-8", title: "text-2xl", wrap: "gap-3" },
} as const;

export function Brand({ size = "md", className, showSubtitle = false }: BrandProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center", s.wrap, className)}>
      <span className="grid place-items-center rounded-md bg-primary text-primary-foreground p-1.5">
        <Wallet className={s.icon} aria-hidden />
      </span>
      <div className="leading-tight">
        <p className={cn("font-semibold tracking-tight", s.title)}>FinPlan</p>
        {showSubtitle ? (
          <p className="text-xs text-muted-foreground">Meu Norte</p>
        ) : null}
      </div>
    </div>
  );
}
