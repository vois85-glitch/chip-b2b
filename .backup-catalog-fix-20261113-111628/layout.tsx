import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { classifyComponents } from '@/lib/classify-component';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { groupCategories } from '@/lib/catalog-taxonomy';

/**
 * Mapping of Russian category names to URL-friendly slugs
 * used in the site's SEO hub pages.
 */
const CATEGORY_SLUGS: Record<string, string> = {
  'Микроконтроллеры': 'arm-kontrollery',
  'ПЛИС (FPGA)': 'fpga',
  'Транзисторы': 'tranzistory',
  'Конденсаторы': 'kondensatory',
  'АЦП/ЦАП': 'adc-dac',
  'Резисторы': 'rezistory',
  'Диоды': 'diody',
  'Операционные усилители': 'operatsionnye-usiliteli',
  'Стабилизаторы': 'stabilizatory',
  'Датчики': 'datchiki',
  'Разъёмы': 'razemy',
  'Индуктивности': 'induktivnosti',
  'Оптоэлектроника': 'optoelektronika',
  'Память': 'pamyat',
  'Логика': 'logika',
  'Интерфейсы': 'interfeysy',
  'Питание': 'pitaniya',
  'Реле': 'rele',
  'Предохранители': 'predokhraniteli',
  'Кварцы и резонаторы': 'kvartsy',
  'Переключатели': 'pereklyuchateli',
  'Фильтры': 'filtry',
  'Трансформаторы': 'transformatory',
  'Модули и платы': 'moduli',
  'Монтаж и аксессуары': 'montazh',
  'Кабели и провода': 'kabeli',
  'Телекоммуникации': 'telekommunikatsii',
  'Электроавтоматика': 'elektroavtomatika',
  'Прочие компоненты': 'prochie',
  'Микросхемы': 'mikroskhemy',
  'LED драйверы': 'led-drayvery',
};

export const revalidate = 3600;

async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const { data } = await supabase.from('components').select('category, name, sku');

  if (!data) return [];

  // Классифицируем (пустые/Прочие компоненты → правильная категория)
  const classified = classifyComponents(data as any[]);

  const counts: Record<string, number> = {};
  classified.forEach((item) => {
    if (item.category) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      slug: CATEGORY_SLUGS[name] || name.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, ''),
      count,
    }));
}

async function getBrands(): Promise<{ name: string; count: number }[]> {
  const { data } = await supabase.from('components').select('brand');
  if (!data) return [];

  const counts: Record<string, number> = {};
  data.forEach((item: { brand: string }) => {
    if (item.brand) {
      counts[item.brand] = (counts[item.brand] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)  // топ-20 брендов
    .map(([name, count]) => ({ name, count }));
}

// Inline SVG-иконки для групп категорий (компактные, одноцветные)
function GroupIcon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    chip: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" fillOpacity="0.15" />
        <rect x="8" y="8" width="8" height="8" rx="0.5" fill="currentColor" />
        <path d="M9 4v2M12 4v2M15 4v2M9 18v2M12 18v2M15 18v2M4 9h2M4 12h2M4 15h2M18 9h2M18 12h2M18 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    capacitor: (
      <>
        <path d="M12 4v6M12 14v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 10h12M6 14h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
    lightning: (
      <>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </>
    ),
    sensor: (
      <>
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
        <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      </>
    ),
    connector: (
      <>
        <rect x="3" y="8" width="18" height="8" rx="1" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 12h2M11 12h2M15 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className || 'w-5 h-5'} fill="none">
      {paths[name] || paths.chip}
    </svg>
  );
}

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  // Сгруппировать категории по разделам таксономии
  const grouped = groupCategories(categories.map(c => [c.name, c.count]));

  // Тотал компонентов
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="pt-[180px] px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Полная ширина — без sidebar (как на chipget.ru) */}
        {children}
      </div>
    </div>
  );
}

