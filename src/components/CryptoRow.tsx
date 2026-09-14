import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { formatPrice, formatPercent } from "../utils/format";
import type { Crypto } from "../types/crypto";
import type { Currency } from "../hooks/useCurrency";

interface Props {
  crypto: Crypto;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  currency: Currency;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  compareDisabled: boolean;
}

export function CryptoRow({
  crypto,
  onClick,
  isFavorite,
  onToggleFavorite,
  currency,
  isCompared,
  onToggleCompare,
  compareDisabled,
}: Props) {
  const change = crypto.price_change_percentage_24h;
  const isPositive = change !== null && change >= 0;
  const isPump = change !== null && change > 10;
  const isDump = change !== null && change < -10;

  return (
    <tr
      onClick={onClick}
      className={`
        border-b border-gray-200 dark:border-gray-700
        cursor-pointer transition-colors
        ${isCompared ? "bg-blue-50 dark:bg-blue-950/30" : ""}
        ${isPump && !isCompared ? "bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50" : ""}
        ${isDump && !isCompared ? "bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50" : ""}
        ${!isPump && !isDump && !isCompared ? "hover:bg-gray-50 dark:hover:bg-gray-800" : ""}
      `}
    >
      <td className="py-3 pl-2" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isCompared}
          onChange={() => onToggleCompare(crypto.id)}
          disabled={compareDisabled && !isCompared}
          className="w-4 h-4 accent-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Comparer ${crypto.name}`}
        />
      </td>
      <td className="py-3 pl-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onToggleFavorite(crypto.id)}
          className="hover:scale-125 transition-transform"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Star
            className={`w-5 h-5 ${
              isFavorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          />
        </button>
      </td>
      <td className="py-3 text-gray-400 text-sm">{crypto.market_cap_rank}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt="" className="w-6 h-6" />
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {crypto.name}
              </div>
              <div className="text-xs text-gray-400 uppercase">
                {crypto.symbol}
              </div>
            </div>
            {isPump && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
                <TrendingUp className="w-3 h-3" />
                PUMP
              </span>
            )}
            {isDump && (
              <span className="inline-flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                <TrendingDown className="w-3 h-3" />
                DUMP
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 text-right font-mono text-gray-900 dark:text-gray-100">
        {formatPrice(crypto.current_price, currency)}
      </td>
      <td
        className={`py-3 text-right font-mono font-medium ${
          isPositive
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {formatPercent(change)}
      </td>
    </tr>
  );
}