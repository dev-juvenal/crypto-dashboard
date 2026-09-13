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
      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="py-3 text-gray-400 text-sm">{crypto.market_cap_rank}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt="" className="w-6 h-6" />
          <div>
            <div className="font-medium">{crypto.name}</div>
            <div className="text-xs text-gray-400 uppercase">{crypto.symbol}</div>
          </div>
        </div>
      </td>
      <td className="py-3 text-right font-mono">
        {formatPrice(crypto.current_price)}
      </td>
      <td className={`py-3 text-right font-mono ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {formatPercent(change)}
      </td>
    </tr>
  );
}