import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
};

export const revalidate = 3600;

async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const { data } = await supabase.from('components').select('category');

  if (!data) return [];

  const counts: Record<string, number> = {};
  data.forEach((item: { category: string }) => {
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

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left sidebar — categories */}
          <aside className="hidden md:block md:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl p-4">
                <h3 className="text-sm font-bold text-[#333] mb-3 uppercase tracking-wider">
                  Категории
                </h3>
                <nav className="space-y-0.5 max-h-[calc(100vh-160px)] overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                      className="w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm text-[#666] hover:text-[#121212] hover:bg-[#d5e0d3] transition-colors group"
                    >
                      <span className="truncate group-hover:text-primary transition-colors">{cat.name}</span>
                      <span className="text-xs text-[#898989] ml-2 flex-shrink-0">{cat.count}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Quick links */}
              <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl p-4 mt-4">
                <h3 className="text-sm font-bold text-[#333] mb-3 uppercase tracking-wider">
                  Полезные ссылки
                </h3>
                <nav className="space-y-0.5">
                  <Link href="/brands" className="block px-3 py-2 rounded-lg text-sm text-[#666] hover:text-primary hover:bg-[#d5e0d3] transition-colors">
                    Все производители
                  </Link>
                  <Link href="/analogs" className="block px-3 py-2 rounded-lg text-sm text-[#666] hover:text-primary hover:bg-[#d5e0d3] transition-colors">
                    Подбор аналогов
                  </Link>
                  <Link href="/datasheets" className="block px-3 py-2 rounded-lg text-sm text-[#666] hover:text-primary hover:bg-[#d5e0d3] transition-colors">
                    Даташиты
                  </Link>
                  <Link href="/obsolete" className="block px-3 py-2 rounded-lg text-sm text-[#666] hover:text-primary hover:bg-[#d5e0d3] transition-colors">
                    Снятые с производства
                  </Link>
                  <Link href="/delivery" className="block px-3 py-2 rounded-lg text-sm text-[#666] hover:text-primary hover:bg-[#d5e0d3] transition-colors">
                    Доставка и оплата
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="md:col-span-3 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
