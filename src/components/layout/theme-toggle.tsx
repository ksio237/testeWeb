"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (theme === "system" ? resolvedTheme : theme) ?? "light";
  const isDark = current === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="w-full justify-start gap-3"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" aria-hidden />
        ) : (
          <Moon className="h-4 w-4" aria-hidden />
        )
      ) : (
        <Sun className="h-4 w-4 opacity-0" aria-hidden />
      )}
      <span>{mounted && isDark ? "Tema claro" : "Tema escuro"}</span>
    </Button>
  );
}
