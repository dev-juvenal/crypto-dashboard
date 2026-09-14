import { useState } from "react";

const MAX_COMPARE = 4;

export function useComparison() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((c) => c !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      return [...prev, id];
    });
  }

  function clear() {
    setSelected([]);
  }

  function isSelected(id: string) {
    return selected.includes(id);
  }

  return {
    selected,
    toggle,
    clear,
    isSelected,
    isFull: selected.length >= MAX_COMPARE,
    max: MAX_COMPARE,
  };
}