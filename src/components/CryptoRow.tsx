import { formatPrice, formatPercent } from "../utils/format";
import type { Crypto } from "../types/crypto";

interface Props {
  crypto: Crypto;
  onClick: () => void;
}

export function CryptoRow({ crypto, onClick }: Props) {
  const change = crypto.price_change_percentage_24h;
  const isPositive = change !== null && change >= 0;

  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
    >
      <td className="py-3 text-gray-400 text-sm">{crypto.market_cap_rank}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt="" className="w-6 h-6" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{crypto.name}</div>
            <div className="text-xs text-gray-400 uppercase">{crypto.symbol}</div>
          </div>
        </div>
      </td>
      <td className="py-3 text-right font-mono text-gray-900 dark:text-gray-100">
        {formatPrice(crypto.current_price)}
      </td>
      <td className={`py-3 text-right font-mono ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        {formatPercent(change)}
      </td>
    </tr>
  );
}