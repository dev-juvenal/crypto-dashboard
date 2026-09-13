export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
}

export interface MarketChartPoint {
  timestamp: number;
  price: number;
}

export interface MarketChartResponse {
  prices: [number, number][];
}