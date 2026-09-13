import { formatPrice } from "../utils/format";
import { PriceChart } from "./PriceChart";
import type { Crypto } from "../types/crypto";

interface Props {
  crypto: Crypto;
  onClose: () => void;
}

export function CryptoDetail({ crypto, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <img src={crypto.image} alt="" className="w-10 h-10" />
          <div>
            <h2 className="text-xl font-bold">{crypto.name}</h2>
            <p className="text-sm text-gray-500 uppercase">{crypto.symbol}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <span className="text-3xl font-bold">{formatPrice(crypto.current_price)}</span>
        </div>

        <PriceChart cryptoId={crypto.id} />

        <p className="text-xs text-gray-400 mt-4">
          Évolution sur 7 jours — source CoinGecko
        </p>
      </div>
    </div>
  );
}