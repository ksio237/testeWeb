"use client";

import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrivacy } from "@/providers/privacy-provider";
import { cn } from "@/lib/utils";

type ChartShellProps = {
  title: string;
  description?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  height?: number;
  className?: string;
  children: ReactNode;
};

export function ChartShell({
  title,
  description,
  isLoading,
  isEmpty,
  emptyMessage = "Sem dados para exibir",
  height = 280,
  className,
  children,
}: ChartShellProps) {
  const { isPrivate } = usePrivacy();
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="relative">
        <div style={{ height }} className="relative">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : isEmpty ? (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className={cn("h-full w-full", isPrivate && "blur-sm select-none")}>
              {children}
            </div>
          )}
          {isPrivate && !isLoading && !isEmpty ? (
            <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-foreground/80 px-2 py-1 text-xs font-medium uppercase tracking-wide text-background">
              Modo privado
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
