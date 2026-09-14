import { useEffect, useState } from "react";

export type Currency = "eur" | "usd" | "gbp" | "jpy" | "chf";

export interface CurrencyInfo {
  code: Currency;
  label: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "eur", label: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "usd", label: "Dollar US", symbol: "$", flag: "🇺🇸" },
  { code: "gbp", label: "Livre Sterling", symbol: "£", flag: "🇬🇧" },
  { code: "jpy", label: "Yen Japonais", symbol: "¥", flag: "🇯🇵" },
  { code: "chf", label: "Franc Suisse", symbol: "Fr", flag: "🇨🇭" },
];

const STORAGE_KEY = "crypto-currency";

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
    if (saved && CURRENCIES.some((c) => c.code === saved)) {
      return saved;
    }
    return "eur";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const currentCurrency = CURRENCIES.find((c) => c.code === currency)!;

  return { currency, setCurrency, currentCurrency };
}