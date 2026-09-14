import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCIES, type Currency } from "../hooks/useCurrency";

interface Props {
  currency: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencySelector({ currency, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = CURRENCIES.find((c) => c.code === currency)!;

  // Ferme le menu si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Changer de devise"
      >
        <span>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                onChange(c.code);
                setIsOpen(false);
              }}
              className={`
                flex items-center gap-3 w-full px-3 py-2 text-sm text-left
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${c.code === currency ? "bg-gray-50 dark:bg-gray-700/50 font-medium" : ""}
                ${c.code === CURRENCIES[0].code ? "rounded-t-lg" : ""}
                ${c.code === CURRENCIES[CURRENCIES.length - 1].code ? "rounded-b-lg" : ""}
              `}
            >
              <span className="text-lg">{c.flag}</span>
              <div className="flex-1">
                <div className="text-gray-900 dark:text-gray-100">{c.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {c.code.toUpperCase()} — {c.symbol}
                </div>
              </div>
              {c.code === currency && (
                <span className="text-blue-500">●</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}