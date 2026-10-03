"use client";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePrivacy } from "@/providers/privacy-provider";

export function PrivacyToggle() {
  const { isPrivate, toggle } = usePrivacy();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-pressed={isPrivate}
      aria-label={isPrivate ? "Mostrar valores" : "Ocultar valores"}
      title={isPrivate ? "Mostrar valores" : "Ocultar valores"}
    >
      {isPrivate ? (
        <EyeOff className="h-4 w-4" aria-hidden />
      ) : (
        <Eye className="h-4 w-4" aria-hidden />
      )}
    </Button>
  );
}
