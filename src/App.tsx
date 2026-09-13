import { useState } from "react";
import { CryptoList } from "./components/CryptoList";
import { CryptoDetail } from "./components/CryptoDetail";
import type { Crypto } from "./types/crypto";

export default function App() {
  const [selected, setSelected] = useState<Crypto | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <CryptoList onSelect={setSelected} />
      {selected && (
        <CryptoDetail crypto={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}