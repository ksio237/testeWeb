"use client";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/providers/privacy-provider";

type Tone = "primary" | "success" | "danger" | "info";

const toneStyles: Record<Tone, { iconWrap: string; value: string }> = {
  primary: { iconWrap: "bg-primary/15 text-primary", value: "text-foreground" },
  success: { iconWrap: "bg-success/15 text-success", value: "text-success" },
  danger: { iconWrap: "bg-danger/15 text-danger", value: "text-danger" },
  info: { iconWrap: "bg-info/15 text-info", value: "text-foreground" },
};

type StatCardProps = {
  label: string;
  value: number | null;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  isLoading?: boolean;
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  isLoading,
}: StatCardProps) {
  const { isPrivate } = usePrivacy();
  const styles = toneStyles[tone];

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={cn("grid place-items-center rounded-full p-3", styles.iconWrap)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          {isLoading || value === null ? (
            <Skeleton className="mt-2 h-6 w-28" />
          ) : (
            <p className={cn("mt-1 text-xl font-semibold tabular-nums sm:text-2xl", styles.value)}>
              {formatCurrency(value, isPrivate)}
            </p>
          )}
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
