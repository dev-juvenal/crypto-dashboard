import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronUp, ChevronDown, Star } from "lucide-react";
import { fetchTopCryptos } from "../api/coingecko";
import { useDebounce } from "../hooks/useDebounce";
import { useFavorites } from "../hooks/useFavorites";
import { useComparison } from "../hooks/useComparison";
import { CryptoRow } from "./CryptoRow";
import { MarketPulse } from "./MarketPulse";
import { ScannerFilter, type ViewMode } from "./ScannerFilter";
import { SearchBar } from "./SearchBar";
import { CompareBar } from "./CompareBar";
import { CompareModal } from "./CompareModal";
import type { Crypto } from "../types/crypto";
import type { Currency } from "../hooks/useCurrency";

interface Props {
  onSelect: (crypto: Crypto) => void;
  currency: Currency;
}

type SortKey = "rank" | "name" | "price" | "change";
type SortDir = "asc" | "desc";

function isVolatile(crypto: Crypto): boolean {
  return Math.abs(crypto.price_change_percentage_24h ?? 0) > 5;
}

function opportunityScore(crypto: Crypto): number {
  const volatility = Math.abs(crypto.price_change_percentage_24h ?? 0);
  const momentum = (crypto.total_volume / crypto.market_cap) * 100;
  return volatility * 0.6 + momentum * 0.4;
}

function isOpportunity(crypto: Crypto): boolean {
  const volatility = Math.abs(crypto.price_change_percentage_24h ?? 0);
  const momentum = (crypto.total_volume / crypto.market_cap) * 100;
  return volatility > 3 && momentum > 5;
}

export function CryptoList({ onSelect, currency }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { toggleFavorite, isFavorite } = useFavorites();
  const {
    selected: comparedIds,
    toggle: toggleCompare,
    clear: clearCompare,
    isSelected: isCompared,
    isFull: compareFull,
  } = useComparison();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["topCryptos", currency],
    queryFn: () => fetchTopCryptos(currency, 20),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          />
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
    .filter((c) => !showFavoritesOnly || isFavorite(c.id))
    .filter((c) => {
      if (viewMode === "volatile") return isVolatile(c);
      if (viewMode === "opportunities") return isOpportunity(c);
      return true;
    });

  const sorted = [...filtered].sort((a, b) => {
    if (viewMode === "opportunities") {
      return opportunityScore(b) - opportunityScore(a);
    }

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

  const counts = {
    all: data
      .filter(
        (c) =>
          c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      .filter((c) => !showFavoritesOnly || isFavorite(c.id)).length,
    volatile: data
      .filter(
        (c) =>
          c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      .filter((c) => !showFavoritesOnly || isFavorite(c.id))
      .filter(isVolatile).length,
    opportunities: data
      .filter(
        (c) =>
          c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      .filter((c) => !showFavoritesOnly || isFavorite(c.id))
      .filter(isOpportunity).length,
  };

  const comparedCryptos = comparedIds
    .map((id) => data.find((c) => c.id === id))
    .filter((c): c is Crypto => c !== undefined);

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Cryptos
          </h1>
          {isFetching && (
            <span className="text-sm text-gray-400">Actualisation…</span>
          )}
        </div>

        <MarketPulse data={data} currency={currency} />

        <SearchBar value={search} onChange={setSearch} />

        <ScannerFilter mode={viewMode} onChange={setViewMode} counts={counts} />

        <label className="flex items-center gap-2 mb-4 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="w-4 h-4 accent-yellow-500"
          />
          <Star className="w-4 h-4 text-yellow-500" />
          Favoris uniquement
        </label>

        {sorted.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {showFavoritesOnly
              ? "Aucun favori pour l'instant. Clique sur l'étoile pour en ajouter."
              : viewMode === "volatile"
              ? "Aucune crypto volatile en ce moment (le marché est calme)."
              : viewMode === "opportunities"
              ? "Aucune opportunité détectée actuellement."
              : `Aucun résultat pour "${debouncedSearch}"`}
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 w-10" title="Sélectionner pour comparer"></th>
                <th className="py-2 w-10"></th>
                <th
                  className="py-2 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                  onClick={() => handleSort("rank")}
                >
                  <span className="inline-flex items-center gap-1">
                    #
                    {sortKey === "rank" &&
                      viewMode !== "opportunities" &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </span>
                </th>
                <th
                  className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                  onClick={() => handleSort("name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Nom
                    {sortKey === "name" &&
                      viewMode !== "opportunities" &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </span>
                </th>
                <th
                  className="text-right cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                  onClick={() => handleSort("price")}
                >
                  <span className="inline-flex items-center gap-1 justify-end w-full">
                    Prix
                    {sortKey === "price" &&
                      viewMode !== "opportunities" &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </span>
                </th>
                <th
                  className="text-right cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none"
                  onClick={() => handleSort("change")}
                >
                  <span className="inline-flex items-center gap-1 justify-end w-full">
                    24h
                    {sortKey === "change" &&
                      viewMode !== "opportunities" &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </span>
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
                  currency={currency}
                  isCompared={isCompared(crypto.id)}
                  onToggleCompare={toggleCompare}
                  compareDisabled={compareFull}
                />
              ))}
            </tbody>
          </table>
        )}

        {viewMode === "opportunities" && sorted.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Trié par score d'opportunité (volatilité × 60% + momentum × 40%)
          </p>
        )}
      </div>

      <CompareBar
        selectedIds={comparedIds}
        allCryptos={data}
        onRemove={toggleCompare}
        onClear={clearCompare}
        onCompare={() => setShowCompareModal(true)}
      />

      {showCompareModal && comparedCryptos.length >= 2 && (
        <CompareModal
          cryptos={comparedCryptos}
          currency={currency}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </>
  );
}