import { useState } from "react";
import { CryptoList } from "./components/CryptoList";
import { CryptoDetail } from "./components/CryptoDetail";
import { ThemeToggle } from "./components/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import type { Crypto } from "./types/crypto";

export default function App() {
  const [selected, setSelected] = useState<Crypto | null>(null);
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="max-w-4xl mx-auto p-4 flex justify-end">
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>
      <CryptoList onSelect={setSelected} />
      {selected && (
        <CryptoDetail crypto={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}