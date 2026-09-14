import { useState } from "react";
import { CryptoList } from "./components/CryptoList";
import { CryptoDetail } from "./components/CryptoDetail";
import { ThemeToggle } from "./components/ThemeToggle";
import { CurrencySelector } from "./components/CurrencySelector";
import { useTheme } from "./hooks/useTheme";
import { useCurrency } from "./hooks/useCurrency";
import type { Crypto } from "./types/crypto";

export default function App() {
  const [selected, setSelected] = useState<Crypto | null>(null);
  const { theme, toggle } = useTheme();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="max-w-4xl mx-auto p-4 flex justify-end items-center gap-2">
        <CurrencySelector currency={currency} onChange={setCurrency} />
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>
      <CryptoList onSelect={setSelected} currency={currency} />
      {selected && (
        <CryptoDetail
          crypto={selected}
          onClose={() => setSelected(null)}
          currency={currency}
        />
      )}
    </div>
  );
}