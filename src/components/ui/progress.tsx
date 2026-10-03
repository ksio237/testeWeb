import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number; // 0..100
  tone?: "primary" | "success";
  className?: string;
  label?: string;
};

export function Progress({ value, tone = "primary", className, label }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300 ease-out",
          tone === "success" ? "bg-success" : "bg-primary",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
