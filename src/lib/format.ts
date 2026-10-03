const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
});

export const PRIVACY_PLACEHOLDER = "R$ ••••••";

export function formatCurrency(value: number, isPrivate = false): string {
  if (isPrivate) return PRIVACY_PLACEHOLDER;
  return currencyFormatter.format(value);
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}

export function formatLongDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return longDateFormatter.format(date);
}

export function formatMonth(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return monthFormatter.format(date);
}

export function daysUntil(target: string | Date): number {
  const date = typeof target === "string" ? new Date(target) : target;
  const diffMs = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
