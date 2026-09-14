import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import { fetchMarketChart } from "../api/coingecko";
import { formatPrice, formatPercent, formatDate } from "../utils/format";
import type { Crypto } from "../types/crypto";
import type { Currency } from "../hooks/useCurrency";

interface Props {
  cryptos: Crypto[];
  currency: Currency;
  onClose: () => void;
}

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

export function CompareModal({ cryptos, currency, onClose }: Props) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const queries = useQueries({
    queries: cryptos.map((c) => ({
      queryKey: ["compareChart", c.id, currency],
      queryFn: () => fetchMarketChart(c.id, currency, 7),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const hasError = queries.some((q) => q.isError);

  const mergedData = (() => {
    if (isLoading || hasError) return [];
    const first = queries[0].data;
    if (!first) return [];

    return first.map((point, index) => {
      const row: Record<string, number> = { timestamp: point.timestamp };
      cryptos.forEach((crypto, i) => {
        const data = queries[i].data;
        if (data && data[index] && data[0]) {
          const basePrice = data[0].price;
          row[crypto.symbol.toUpperCase()] =
            ((data[index].price - basePrice) / basePrice) * 100;
        }
      });
      return row;
    });
  })();

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="min-h-full flex items-start justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full p-4 sm:p-6 my-4 transition-colors">
          {/* En-tête : uniquement bouton retour */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0"
              aria-label="Retour"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
              Comparaison ({cryptos.length})
            </h2>
          </div>

          {/* Tableau comparatif */}
          <div className="overflow-x-auto mb-6 -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2">Crypto</th>
                  <th className="py-2 text-right">Prix</th>
                  <th className="py-2 text-right">24h</th>
                  <th className="py-2 text-right">Market Cap</th>
                  <th className="py-2 text-right">Volume 24h</th>
                  <th className="py-2 text-right">Rang</th>
                </tr>
              </thead>
              <tbody>
                {cryptos.map((crypto, i) => {
                  const change = crypto.price_change_percentage_24h;
                  const isPositive = change !== null && change >= 0;
                  return (
                    <tr
                      key={crypto.id}
                      className="border-b border-gray-100 dark:border-gray-700/50"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[i] }}
                          />
                          <img src={crypto.image} alt="" className="w-5 h-5" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {crypto.name}
                          </span>
                          <span className="text-xs text-gray-400 uppercase">
                            {crypto.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatPrice(crypto.current_price, currency)}
                      </td>
                      <td
                        className={`py-3 text-right font-mono font-medium whitespace-nowrap ${
                          isPositive
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatPercent(change)}
                      </td>
                      <td className="py-3 text-right font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatPrice(crypto.market_cap, currency)}
                      </td>
                      <td className="py-3 text-right font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatPrice(crypto.total_volume, currency)}
                      </td>
                      <td className="py-3 text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        #{crypto.market_cap_rank}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Graphique comparatif */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Évolution comparative (7 jours)
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Normalisé en % depuis le début
              </span>
            </div>

            {isLoading && (
              <div className="h-72 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            )}

            {hasError && (
              <p className="text-red-500 text-sm">
                Impossible de charger le graphique comparatif.
              </p>
            )}

            {!isLoading && !hasError && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mergedData}>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(v: number) => formatDate(v)}
                    tick={{ fontSize: 12, fill: "currentColor" }}
                  />
                  <YAxis
                    tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                    tick={{ fontSize: 12, fill: "currentColor" }}
                  />
                  <Tooltip
                    formatter={(value) => `${(value as number).toFixed(2)}%`}
                    labelFormatter={(label) => formatDate(label as number)}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {cryptos.map((crypto, i) => (
                    <Line
                      key={crypto.id}
                      type="monotone"
                      dataKey={crypto.symbol.toUpperCase()}
                      stroke={COLORS[i]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            💡 <strong>Lecture :</strong> chaque courbe est normalisée en % depuis
            le début de la période. Une courbe qui monte = la crypto a progressé.
          </div>

          {/* Bouton retour en bas */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}