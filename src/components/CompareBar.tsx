import { X, GitCompare } from "lucide-react";
import type { Crypto } from "../types/crypto";

interface Props {
  selectedIds: string[];
  allCryptos: Crypto[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export function CompareBar({
  selectedIds,
  allCryptos,
  onRemove,
  onClear,
  onCompare,
}: Props) {
  if (selectedIds.length === 0) return null;

  const selectedCryptos = selectedIds
    .map((id) => allCryptos.find((c) => c.id === id))
    .filter((c): c is Crypto => c !== undefined);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-3 flex items-center gap-3 transition-colors">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
          <GitCompare className="w-4 h-4 text-blue-500" />
          <span className="hidden sm:inline">Comparer</span>
          <span className="text-gray-400">({selectedIds.length})</span>
        </div>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
          {selectedCryptos.map((crypto) => (
            <div
              key={crypto.id}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 rounded-full pl-1 pr-2 py-1 shrink-0"
            >
              <img src={crypto.image} alt="" className="w-5 h-5" />
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100 uppercase">
                {crypto.symbol}
              </span>
              <button
                onClick={() => onRemove(crypto.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Retirer ${crypto.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2"
          >
            Effacer
          </button>
          <button
            onClick={onCompare}
            disabled={selectedIds.length < 2}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Comparer
          </button>
        </div>
      </div>
    </div>
  );
}