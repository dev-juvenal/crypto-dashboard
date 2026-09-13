import type { Crypto, MarketChartResponse, MarketChartPoint } from "../types/crypto";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchTopCryptos(limit = 20): Promise<Crypto[]> {
  const url = `${BASE_URL}/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Trop de requêtes. Patiente quelques secondes.");
    }
    throw new Error(`Erreur API (${res.status})`);
  }

  return res.json();
}

export async function fetchMarketChart(id: string, days = 7): Promise<MarketChartPoint[]> {
  const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=eur&days=${days}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Impossible de charger le graphique (${res.status})`);
  }

  const data: MarketChartResponse = await res.json();

  return data.prices.map(([timestamp, price]) => ({ timestamp, price }));
}