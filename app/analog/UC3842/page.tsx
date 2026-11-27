import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  // SEO (2026-11-23): Title по шаблону для снабженцев
  return {
    title: `Аналоги UC3842 — таблица замен pin-to-pin и функциональных аналогов, поставка от 6 дней`,
    description: `Аналоги ШИМ-контроллера UC3842: KA3842, UC3843, SG3842, TL494 — таблица замен pin-to-pin, сравнение параметров для импульсных БП. Поставка от 6 дней, от 1 шт., проверка СВП.`,
    alternates: { canonical: `${BASE_URL}/analog/UC3842` },
    openGraph: {
      title: `Аналоги UC3842 — таблица замен pin-to-pin и функциональных аналогов`,
      description: `Аналоги ШИМ-контроллера UC3842: KA3842, UC3843, SG3842, TL494 — таблица замен, сравнение параметров для БП.`,
      url: `${BASE_URL}/analog/UC3842`,
      type: 'website', locale: 'ru_RU', siteName: 'ChipNet',
    },
    robots: { index: true, follow: true },
  };
}

export default async function AnalogPage() {
  const analogs = ['KA3842', 'UC3843', 'SG3842', 'UC3842B', 'TL494', 'KA7500'];
  const url = `${BASE_URL}/analog/UC3842`;

  return (
    <main className="min-h-screen bg-background text-[#121212]">
      <section className="pt-[190px] md:pt-[200px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav
            className="mb-4"
            items={[
              { name: 'Главная', href: '/' },
              { name: 'Аналоги', href: '/analogi' },
            ]}
          />
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Аналоги ШИМ-контроллера UC3842</h1>
          
          <p className="text-lg text-[#444] leading-relaxed mb-8">UC3842 — ШИМ-контроллер (current mode) для импульсных источников питания. Корпус DIP-8/SOIC-8, частота до 500 кГц, встроенный генератор, защита по току. Применяется в AC-DC блоках питания, DC-DC преобразователях, зарядных устройствах. Прямые аналоги: KA3842 (Samsung/Fairchild), UC3843 (запуск при 8.5V вместо 16V), SG3842, UC3842B. Для двухтактных схем: TL494, KA7500.</p>
          
          <h2 className="text-xl font-bold mb-4 text-primary">Рекомендуемые аналоги</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {analogs.map((a: string) => (
              <Link
                key={a}
                href={`/component/${encodeURIComponent(a)}`}
                className="block bg-white border border-[#e8e8e8] rounded-lg p-4 hover:border-[#02a391]/40 hover:shadow-md transition-all"
              >
                <div className="font-mono font-bold text-[#121212]">{a}</div>
                <div className="text-xs text-[#757575] mt-1">Подробнее</div>
              </Link>
            ))}
          </div>
          
          <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl p-6">
            <h3 className="font-bold text-[#333] mb-2">Заказать UC3842 или аналоги</h3>
            <p className="text-sm text-[#666] mb-4">
              ChipNet поставляет UC3842 и рекомендованные аналоги от 1 шт. с проверкой в лаборатории СВП.
              Отправьте BOM-лист — менеджер подготовит КП за 1-2 часа.
            </p>
            <Link href="/bom" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition-colors">
              Запросить КП
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
