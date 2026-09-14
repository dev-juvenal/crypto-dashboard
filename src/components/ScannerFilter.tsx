import { LayoutList, Flame, Target } from "lucide-react";

export type ViewMode = "all" | "volatile" | "opportunities";

interface Props {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  counts: {
    all: number;
    volatile: number;
    opportunities: number;
  };
}

export function ScannerFilter({ mode, onChange, counts }: Props) {
  const buttons: { key: ViewMode; label: string; icon: React.ReactNode; color: string }[] = [
    {
      key: "all",
      label: "Toutes",
      icon: <LayoutList className="w-4 h-4" />,
      color: "bg-blue-500",
    },
    {
      key: "volatile",
      label: "Volatiles",
      icon: <Flame className="w-4 h-4" />,
      color: "bg-orange-500",
    },
    {
      key: "opportunities",
      label: "Opportunités",
      icon: <Target className="w-4 h-4" />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {buttons.map((btn) => {
        const isActive = mode === btn.key;
        return (
          <button
            key={btn.key}
            onClick={() => onChange(btn.key)}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-colors border
              ${
                isActive
                  ? `${btn.color} text-white border-transparent`
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
          >
            {btn.icon}
            <span>{btn.label}</span>
            <span
              className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${
                  isActive
                    ? "bg-white/20"
                    : "bg-gray-200 dark:bg-gray-700"
                }
              `}
            >
              {counts[btn.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}