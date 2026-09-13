import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchMarketChart } from "../api/coingecko";
import { formatDate, formatPrice } from "../utils/format";
import type { MarketChartPoint } from "../types/crypto";

interface Props {
  cryptoId: string;
}

export function PriceChart({ cryptoId }: Props) {
  const { data, isLoading, isError } = useQuery<MarketChartPoint[]>({
    queryKey: ["marketChart", cryptoId],
    queryFn: () => fetchMarketChart(cryptoId, 7),
  });

  if (isLoading) {
    return <div className="h-64 bg-gray-100 rounded animate-pulse" />;
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
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={(v: number) => `${v.toFixed(0)}€`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => formatPrice(value as number)}
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