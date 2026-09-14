import { Activity, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { formatPrice } from "../utils/format";
import type { Crypto } from "../types/crypto";
import type { Currency } from "../hooks/useCurrency";

interface Props {
  data: Crypto[];
  currency: Currency;
}

export function MarketPulse({ data, currency }: Props) {
  if (data.length === 0) return null;

  const bullishCount = data.filter(
    (c) => (c.price_change_percentage_24h ?? 0) > 0
  ).length;
  const bearishCount = data.length - bullishCount;

  const avgChange =
    data.reduce((sum, c) => sum + (c.price_change_percentage_24h ?? 0), 0) /
    data.length;

  const sortedByChange = [...data].sort(
    (a, b) =>
      (b.price_change_percentage_24h ?? 0) -
      (a.price_change_percentage_24h ?? 0)
  );
  const topGainer = sortedByChange[0];
  const topLoser = sortedByChange[sortedByChange.length - 1];

  const sentiment =
    avgChange > 2 ? "bullish" : avgChange < -2 ? "bearish" : "neutral";

  const sentimentConfig = {
    bullish: {
      label: "Bullish",
      color: "bg-green-500",
      text: "Marché haussier",
    },
    neutral: {
      label: "Neutre",
      color: "bg-yellow-500",
      text: "Marché indécis",
    },
    bearish: {
      label: "Bearish",
      color: "bg-red-500",
      text: "Marché baissier",
    },
  }[sentiment];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Market Pulse
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {sentimentConfig.text}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium text-white ${sentimentConfig.color}`}
        >
          {sentimentConfig.label}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Hausses / Baisses
          </div>
          <div className="font-mono font-medium text-gray-900 dark:text-gray-100">
            <span className="text-green-600 dark:text-green-400">
              {bullishCount}
            </span>
            {" / "}
            <span className="text-red-600 dark:text-red-400">
              {bearishCount}
            </span>
          </div>
        </div>

        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
            Variation moyenne 24h
          </div>
          <div
            className={`font-mono font-medium flex items-center gap-1 ${
              avgChange >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {avgChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {avgChange >= 0 ? "+" : ""}
            {avgChange.toFixed(2)}%
          </div>
        </div>

        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            Top Gainer
          </div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            <span className="uppercase">{topGainer.symbol}</span>{" "}
            <span className="text-green-600 dark:text-green-400 font-mono">
              +{(topGainer.price_change_percentage_24h ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>

        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            Top Loser
          </div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            <span className="uppercase">{topLoser.symbol}</span>{" "}
            <span className="text-red-600 dark:text-red-400 font-mono">
              {(topLoser.price_change_percentage_24h ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}