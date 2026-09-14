import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchMarketChart } from "../api/coingecko";
import { formatDate, formatPrice } from "../utils/format";
import type { MarketChartPoint } from "../types/crypto";
import type { Currency } from "../hooks/useCurrency";

interface Props {
  cryptoId: string;
  currency: Currency;
}

export function PriceChart({ cryptoId, currency }: Props) {
  const { data, isLoading, isError } = useQuery<MarketChartPoint[]>({
    queryKey: ["marketChart", cryptoId, currency],
    queryFn: () => fetchMarketChart(cryptoId, currency, 7),
  });

  if (isLoading) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
    );
  }

  if (isError || !data) {
    return <p className="text-red-500">Impossible de charger le graphique.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v: number) => formatDate(v)}
          tick={{ fontSize: 12, fill: "currentColor" }}
        />
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={(v: number) => formatPrice(v, currency)}
          tick={{ fontSize: 12, fill: "currentColor" }}
        />
        <Tooltip
          formatter={(value) => formatPrice(value as number, currency)}
          labelFormatter={(label) => formatDate(label as number)}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}