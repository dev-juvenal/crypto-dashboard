import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTopCryptos } from "../api/coingecko";
import { useDebounce } from "../hooks/useDebounce";
import { CryptoRow } from "./CryptoRow";
import { SearchBar } from "./SearchBar";
import type { Crypto } from "../types/crypto";

interface Props {
  onSelect: (crypto: Crypto) => void;
}

export function CryptoList({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["topCryptos"],
    queryFn: () => fetchTopCryptos(20),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
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
  const filtered = data.filter(
    (c) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cryptos</h1>
        {isFetching && <span className="text-sm text-gray-400">Actualisation…</span>}
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          Aucun résultat pour "{debouncedSearch}"
        </p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b">
              <th className="py-2">#</th>
              <th>Nom</th>
              <th className="text-right">Prix</th>
              <th className="text-right">24h</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((crypto) => (
              <CryptoRow
                key={crypto.id}
                crypto={crypto}
                onClick={() => onSelect(crypto)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}