import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Аналоги NE5532P: малошумящий сдвоенный ОУ для аудио и измерений | ChipNet`,
    description: `Аналоги и замены для операционного усилителя NE5532P. LM358, TL072, OPA2134 — сравнение шумов и параметров.`,
    alternates: { canonical: `${BASE_URL}/analog/NE5532P` },
    openGraph: {
      title: `Аналоги NE5532P: малошумящий сдвоенный ОУ для аудио и измерений`,
      description: `Аналоги и замены для операционного усилителя NE5532P. LM358, TL072, OPA2134 — сравнение шумов и параметров.`,
      url: `${BASE_URL}/analog/NE5532P`,
      type: 'website', locale: 'ru_RU', siteName: 'ChipNet',
    },
  };
}

export default async function AnalogPage() {
  const analogs = ['NE5532DR', 'LM358', 'TL072CP', 'OPA2134PA', 'OP07CP', 'LM4562'];
  const url = `${BASE_URL}/analog/NE5532P`;

  return (
    <main className="min-h-screen bg-background text-[#121212]">
      <section className="pt-[180px] pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav
        className="mb-4"
        items=[{"        { name: 'Главная', href: '/' },\n        { name: 'Аналоги', href: '/analogi' }"}]
      />
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Аналоги операционного усилителя NE5532P</h1>
          
          <p className="text-lg text-[#444] leading-relaxed mb-8">NE5532P — сдвоенный малошумящий операционный усилитель (audio-grade). Шум 5 нВ/√Гц, полоса 10 МГц, скорость нарастания 9 В/мкс. Корпус DIP-8/SOIC-8. Применяется в аудиоаппаратуре (предусилители, эквалайзеры), измерительной технике, активных фильтрах. Аналоги: NE5532DR (SOIC-8), LM358 (general purpose, дешевле), TL072 (JFET input, для высокоомных датчиков), OPA2134PA (TI, audio-grade, лучше параметры). Для прецизионных: OP07, OP177.</p>
          
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
            <h3 className="font-bold text-[#333] mb-2">Заказать NE5532P или аналоги</h3>
            <p className="text-sm text-[#666] mb-4">
              ChipNet поставляет NE5532P и рекомендованные аналоги от 1 шт. с проверкой в лаборатории СВП.
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
