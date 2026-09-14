import type { Currency } from "../hooks/useCurrency";

export function formatPrice(value: number, currency: Currency = "eur"): string {
  const currencyMap: Record<Currency, string> = {
    eur: "EUR",
    usd: "USD",
    gbp: "GBP",
    jpy: "JPY",
    chf: "CHF",
  };

  // Pour les grosses valeurs, on ne met pas de décimales
  if (value >= 1000) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currencyMap[currency],
      maximumFractionDigits: 0,
    }).format(value);
  }

  // Pour les petites valeurs, on met 4 décimales
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyMap[currency],
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatPercent(value: number | null): string {
  if (value === null || isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}