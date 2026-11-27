// components/ui/CategoryIcon.tsx
// SVG-иконки для категорий электронных компонентов

const ICONS: Record<string, string> = {
  "Микроконтроллеры": "M9 3v2m6-2v2M9 19v2m6-2v2M5 8H3m2 8H3m18-8h-2m2 8h-2M9 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M9 9h6v6H9z",
  "ПЛИС (FPGA)": "M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z",
  "Транзисторы": "M3 12h6m6 0h6M9 6l6 6-6 6V6z",
  "MOSFET": "M3 12h6m6 0h6M9 6l6 6-6 6V6zM14 8v8",
  "Конденсаторы": "M5 5h14v3H5zM5 16h14v3H5zM9 8v8M15 8v8",
  "АЦП/ЦАП": "M3 17l4-8 4 4 4-6 4 4M3 7l4 2 4-4 4 2 4-2",
  "Резисторы": "M2 12h3l2-4 4 8 4-8 4 8 2-4h3",
  "Диоды": "M5 6l8 6-8 6V6zM13 6h4v12h-4z",
  "Операционные усилители": "M3 8l4 4-4 4M3 12h6m6 0h6M15 8l4 4-4 4",
  "Стабилизаторы": "M3 12h4l3-7 4 14 3-7h4",
  "Разъёмы": "M3 8h18v8H3zM6 8V4m4 4V4m4 4V4m4 4V4M6 16v4m4-4v4m4-4v4m4-4v4",
  "Датчики": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
  "Оптоэлектроника": "M3 12h4m10 0h4M7 6l10 12M7 18l10-12",
  "Питание": "M11 5L6 13h4l-1 6 5-8h-4l1-6z",
  "Телекоммуникации": "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  "Память": "M3 6h18v12H3zM3 10h18M7 6v12M11 6v12",
  "Логика": "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M14 4v16",
  "Реле": "M6 4h6v16H6zM12 8l6 4-6 4V8z",
  "Интерфейсы": "M4 7h16M4 12h16M4 17h16M7 4v16M17 4v16",
  "Модули и платы": "M4 4h16v16H4zM8 8h8v8H8zM4 12h4M16 12h4M12 4v4M12 16v4",
  "Переключатели": "M4 6h16v4H4zM4 14h16v4H4zM8 6v4M14 14v4",
  "Кварцы и резонаторы": "M8 4v16M16 4v16M4 8h16M4 16h16",
  "Предохранители": "M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8zM12 8v8",
  "Индуктивности": "M3 18c3 0 3-12 6-12s3 12 6 12 3-12 6-12 3 12 6 12",
  "Кабели и провода": "M3 7l4 4-4 4M7 7l4 4-4 4M11 7l4 4-4 4M15 7l4 4-4 4",
  "Фильтры": "M3 5l9 14 9-14M3 12h18",
  "Трансформаторы": "M6 4c-2 0-2 16 0 16s2-16 4-16 2 16 4 16 2-16 4-16",
  "Электроавтоматика": "M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z",
  "Монтаж и аксессуары": "M14 7l3 3M5 19l3-3 6-6 3 3-6 6-3 3-3-3z",
  "Микросхемы": "M6 4h12v16H6zM6 8H3m3 4H3m3 4H3m15-8h3m-3 4h3m-3 4h3M10 4v16",
  "Прочие компоненты": "M12 2v20M2 12h20M5 5l14 14M19 5L5 19",
  "LED драйверы": "M12 2L4 14h7l-1 8 9-12h-7l1-8z",
};

const DEFAULT_ICON = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v8M8 12h8";

export default function CategoryIcon({ category, className = "w-5 h-5" }: { category: string; className?: string }) {
  const path = ICONS[category] || DEFAULT_ICON;
  
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// Экспортировать маппинг для использования в layout
export function getCategoryIconPath(category: string): string {
  return ICONS[category] || DEFAULT_ICON;
}
