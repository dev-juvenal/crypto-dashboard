import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTopCryptos } from "../api/coingecko";
import { useDebounce } from "../hooks/useDebounce";
import { useFavorites } from "../hooks/useFavorites";
import { CryptoRow } from "./CryptoRow";
import { SearchBar } from "./SearchBar";
import type { Crypto } from "../types/crypto";

interface Props {
  onSelect: (crypto: Crypto) => void;
}

type SortKey = "rank" | "name" | "price" | "change";
type SortDir = "asc" | "desc";

export function CryptoList({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { toggleFavorite, isFavorite } = useFavorites();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["topCryptos"],
    queryFn: () => fetchTopCryptos(20),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">
          {error instanceof Error ? error.message : "Erreur inconnue"}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!data) return null;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = data
    .filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .filter((c) => !showFavoritesOnly || isFavorite(c.id));

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortKey) {
      case "rank":
        return (a.market_cap_rank - b.market_cap_rank) * dir;
      case "name":
        return a.name.localeCompare(b.name) * dir;
      case "price":
        return (a.current_price - b.current_price) * dir;
      case "change":
        return (
          ((a.price_change_percentage_24h ?? 0) -
            (b.price_change_percentage_24h ?? 0)) *
          dir
        );
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cryptos</h1>
        {isFetching && <span className="text-sm text-gray-400">Actualisation…</span>}
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <label className="flex items-center gap-2 mb-4 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.target.checked)}
          className="w-4 h-4 accent-yellow-500"
        />
        ⭐ Favoris uniquement
      </label>

      {sorted.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          {showFavoritesOnly
            ? "Aucun favori pour l'instant. Clique sur ☆ pour en ajouter."
            : `Aucun résultat pour "${debouncedSearch}"`}
        </p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 w-10"></th>
              <th
                className="py-2 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                onClick={() => handleSort("rank")}
              >
                # {sortKey === "rank" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                onClick={() => handleSort("name")}
              >
                Nom {sortKey === "name" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="text-right cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                onClick={() => handleSort("price")}
              >
                Prix {sortKey === "price" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="text-right cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                onClick={() => handleSort("change")}
              >
                24h {sortKey === "change" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((crypto) => (
              <CryptoRow
                key={crypto.id}
                crypto={crypto}
                onClick={() => onSelect(crypto)}
                isFavorite={isFavorite(crypto.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}