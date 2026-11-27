// app/analog/[original]/page.tsx
//
// Страницы кросс-референсов /analog/<slug>. Три типа контента:
//
//   1. Кураторские страницы (analogMappings) — богатый контент:
//      текст, FAQ, таблица кросс-референсов (STM32→GD32, Spartan-6→Gowin).
//   2. Динамические SKU-страницы — /analog/<артикул> для любого артикула
//      из БД (например, /analog/LM2596, /analog/ATmega328P): таблица замен
//      строится из jsonb-колонки components.analogs (49 500+ компонентов).
//      SEO (2026-11-23): по данным GSC /analog/LM2596 и /analog/ATmega328P
//      уже находятся на 5-й позиции, но отдавали 404 — теперь рендерятся
//      из БД с Title «Аналоги {SKU} — таблица замен pin-to-pin…».
//   3. Страницы серий (fallback) — /analog/<базовый номер> (например,
//      /analog/LM2596 без точного артикула в БД): показываем модификации
//      серии как варианты замены.
//
// SEO-требования (2026-11-23, задача CTR ТОП-5–9):
//   • Title: «Аналоги {SKU} — таблица замен pin-to-pin и функциональных
//     аналогов, поставка от 6 дней | ChipNet» — конкретика для снабженцев;
//   • robots: index, follow; canonical — чистый /analog/<SKU>.

import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import ComponentSearch from '@/components/sections/ComponentSearch';
import { getRelatedBlogPosts } from '@/lib/blog-links';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

type Component = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  status: string;
  analogs: string[];
};

type Props = {
  params: Promise<{ original: string }>;
};

// Common analog mappings for SEO
const analogMappings: Record<string, {
  title: string;
  description: string;
  h1: string;
  text: string;
  analogs: { original: string; replacement: string; manufacturer: string; compatibility: string }[];
  faq: { question: string; answer: string }[];
}> = {
  "stm32f103-gd32f103": {
    // SEO (2026-11-23): Title по новому шаблону для снабженцев (CTR, ТОП-5–9)
    title: "Аналоги STM32F103 — таблица замен pin-to-pin и функциональных аналогов, поставка от 6 дней",
    description: "Аналоги STM32F103: GD32F103 — полный аналог pin-to-pin (программная совместимость 95%). Таблица замен по корпусам, сравнение частот и памяти, миграция прошивки. Поставка от 6 дней, от 1 шт., проверка СВП.",
    h1: "GD32F103 как аналог STM32F103",
    text: "GD32F103 от Gigadevice Semiconductor является полным аналогом STM32F103 от STMicroelectronics с совместимостью pin-to-pin, программной и периферийной. Микроконтроллер построен на ядре ARM Cortex-M3 с рабочей частотой до 108 МГц (STM32F103 — 72 МГц). Область применения: промышленная автоматика, системы управления двигателями, измерительные приборы. Для миграции проекта достаточно заменить заголовочные файлы и пересобрать прошивку. Компоненты GD32 доступны без санкционных ограничений.",
    analogs: [
      { original: "STM32F103C8T6", replacement: "GD32F103C8T6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F103RBT6", replacement: "GD32F103RBT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F103VET6", replacement: "GD32F103VET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F103ZET6", replacement: "GD32F103ZET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
    ],
    faq: [
      { question: "Полностью ли совместим GD32F103 со STM32F103?", answer: "Да, GD32F103 совместим pin-to-pin и программно с STM32F103. Периферийные регистры идентичны, прошивка может быть пересобрана без изменения кода." },
      { question: "В чём разница между STM32F103 и GD32F103?", answer: "Основное отличие — максимальная частота: GD32F103 работает до 108 МГц против 72 МГц у STM32F103. Остальные параметры аналогичны." },
      { question: "Нужна ли перекладка платы при замене?", answer: "Нет, замена не требует изменений в разводке платы — корпуса и расположение выводов идентичны." },
    ],
  },
  "stm32f407-gd32f407": {
    title: "Аналоги STM32F407 — таблица замен pin-to-pin и функциональных аналогов, поставка от 6 дней",
    description: "Аналоги STM32F407: GD32F407 — полный аналог на ARM Cortex-M4 с FPU, 168 МГц, pin-to-pin совместимость. Таблица замен по корпусам, миграция без перекладки платы. Поставка от 6 дней, от 1 шт., проверка СВП.",
    h1: "GD32F407 как аналог STM32F407",
    text: "GD32F407 от Gigadevice — полный аналог STM32F407 от STMicroelectronics на базе ARM Cortex-M4 с FPU и частотой до 168 МГц. Полная совместимость pin-to-pin и программная позволяет заменить STM32F407 без перекладки платы и переписывания прошивки. Компоненты GD32 доступны без санкционных ограничений и являются оптимальным решением для импортозамещения.",
    analogs: [
      { original: "STM32F407VGT6", replacement: "GD32F407VGT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F407ZGT6", replacement: "GD32F407ZGT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F407VET6", replacement: "GD32F407VET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
    ],
    faq: [
      { question: "Совместим ли GD32F407 по периферии?", answer: "Да, все периферийные модули (UART, SPI, I2C, CAN, USB, Ethernet) идентичны по регистрам." },
      { question: "Поддерживает ли GD32F407 DSP инструкции?", answer: "Да, ядро ARM Cortex-M4 с FPU поддерживает DSP инструкции аналогично STM32F407." },
    ],
  },
  "spartan-6-gowin": {
    title: "Аналоги Xilinx Spartan-6 — таблица замен pin-to-pin и функциональных аналогов, поставка от 6 дней",
    description: "Аналоги ПЛИС Xilinx Spartan-6: Gowin GW1N/GW2A — таблица замен по LUT, миграция HDL-проекта, инструменты Gowin EDA. Поставка от 6 дней, от 1 шт., проверка СВП.",
    h1: "Gowin как аналог Xilinx Spartan-6",
    text: "ПЛИС Gowin Semiconductor серий GW1N и GW2A являются альтернативой Xilinx Spartan-6 для проектов, требующих доступных FPGA. Gowin предлагает инструменты миграции проектов (Gowin EDA), поддерживающие импорт VHDL/Verilog из Xilinx ISE/Vivado. Серии GW1N компактные (от 1K до 55K LUT), GW2A — среднего класса (от 20K до 200K LUT). Gowin доступен без санкционных ограничений.",
    analogs: [
      { original: "XC6SLX9", replacement: "GW1N-9", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
      { original: "XC6SLX16", replacement: "GW1N-16", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
      { original: "XC6SLX45", replacement: "GW2A-55", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
    ],
    faq: [
      { question: "Насколько сложно мигрировать проект с Spartan-6 на Gowin?", answer: "Миграция зависит от сложности проекта. Синтезируемый HDL-код переносится легко. IP-ядра Xilinx требуют замены на аналогичные от Gowin." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(analogMappings).map((original) => ({ original }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Динамические SKU-страницы: данные из БД
// ─────────────────────────────────────────────────────────────────────────────

type AnalogComponent = {
  sku: string;
  name: string | null;
  brand: string | null;
  category: string | null;
  status: string | null;
};

type AnalogPageData =
  | {
      kind: 'exact';
      displaySku: string;
      component: AnalogComponent & { description?: string | null };
      analogs: AnalogComponent[];
    }
  | {
      kind: 'family';
      displaySku: string;
      family: AnalogComponent[];
      familyTotal: number;
    };

// Валидный артикул: буквы/цифры/дефис/точка/плюс, 2–40 символов.
// Отсекает мусорные slug'и (мягкие 404 не плодим).
const SKU_RE = /^[A-Za-z0-9+\-.]{2,40}$/;

/** Длина общего буквенно-цифрового префикса двух артикулов (для метки совместимости). */
function commonAlnumPrefixLen(a: string, b: string): number {
  const A = (a || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const B = (b || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  let i = 0;
  while (i < A.length && i < B.length && A[i] === B[i]) i++;
  return i;
}

/** Pin-to-pin, если общий префикс ≥ 6 символов (та же серия, отличие только в корпусе). */
function compatibilityLabel(originalSku: string, analogSku: string): string {
  return commonAlnumPrefixLen(originalSku, analogSku) >= 6
    ? 'Pin-to-pin (та же серия)'
    : 'Функциональный аналог';
}

async function loadAnalogPageData(slugRaw: string): Promise<AnalogPageData | null> {
  const slug = slugRaw.trim();
  if (!SKU_RE.test(slug)) return null;

  // VERCEL FIX (2026-11-27): try/catch — билд/пререндер без БД не падает,
  // страница отдаёт кураторский контент из analogMappings
  try {
  // 1. Точное совпадение артикула (без учёта регистра)
  const { data: exactRows } = await supabase
    .from('components')
    .select('sku, name, brand, category, status, description, analogs')
    .ilike('sku', slug)
    .limit(2);

  if (exactRows && exactRows[0]) {
    const comp = exactRows[0];
    const analogSkus: string[] = Array.isArray((comp as any).analogs)
      ? ((comp as any).analogs as string[]).slice(0, 24)
      : [];

    let analogs: AnalogComponent[] = [];
    if (analogSkus.length > 0) {
      const { data: analogRows } = await supabase
        .from('components')
        .select('sku, name, brand, category, status')
        .in('sku', analogSkus)
        .limit(24);
      if (analogRows) {
        // Сохраняем порядок из массива analogs (ранжирован при генерации)
        const bySku = new Map(analogRows.map((r: any) => [String(r.sku).toUpperCase(), r]));
        analogs = analogSkus
          .map((s) => bySku.get(s.toUpperCase()))
          .filter((r): r is AnalogComponent => Boolean(r));
      }
    }

    if (analogs.length > 0) {
      return {
        kind: 'exact',
        displaySku: comp.sku,
        component: comp,
        analogs,
      };
    }
    // Точная страница без аналогов — падаем вниз к странице серии
  }

  // 2. Страница серии: компоненты, чей артикул начинается с slug (базовый номер)
  //    (например, /analog/LM2596 → модификации LM2596xxx в каталоге)
  if (slug.length >= 4) {
    const { data: familyRows, count } = await supabase
      .from('components')
      .select('sku, name, brand, category, status', { count: 'exact' })
      .ilike('sku', `${slug}%`)
      .order('sku', { ascending: true })
      .limit(24);

    if (familyRows && familyRows.length > 0) {
      return {
        kind: 'family',
        displaySku: slug.toUpperCase(),
        family: familyRows as unknown as AnalogComponent[],
        familyTotal: count || familyRows.length,
      };
    }
  }

  return null;
  } catch (e) {
    console.error('[analog] loadAnalogPageData error:', e);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { original } = await params;
  const mapping = analogMappings[original];

  if (mapping) {
    const url = `${BASE_URL}/analog/${original}`;
    return {
      title: mapping.title,
      description: mapping.description,
      alternates: { canonical: url },
      openGraph: {
        title: mapping.title,
        description: mapping.description,
        url,
        type: 'website',
        locale: 'ru_RU',
        siteName: 'ChipNet',
      },
      robots: { index: true, follow: true },
    };
  }

  // Динамическая SKU-страница
  const data = await loadAnalogPageData(original);
  if (!data) {
    return { title: 'Кросс-референс не найден' };
  }

  const sku = data.displaySku;
  const url = `${BASE_URL}/analog/${encodeURIComponent(sku)}`;

  // SEO (2026-11-23): шаблон Title для снабженцев — конкретика вместо общих фраз
  const title = `Аналоги ${sku} — таблица замен pin-to-pin и функциональных аналогов, поставка от 6 дней`;

  const description =
    data.kind === 'exact'
      ? `Аналоги ${sku} (${data.component.brand || 'производитель уточняется'}): таблица замен pin-to-pin и функциональных аналогов, ${data.analogs.length} вариантов замены. Поставка от 6 дней, от 1 шт., проверка в лаборатории СВП.`
      : `Аналоги и замены серии ${sku}: ${data.familyTotal} модификаций в каталоге ChipNet, сравнение параметров и корпусов. Поставка от 6 дней, от 1 шт., проверка в лаборатории СВП.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
    robots: { index: true, follow: true },
  };
}

export default async function AnalogPage({ params }: Props) {
  const { original } = await params;
  const mapping = analogMappings[original];

  // ─── 1. Кураторская страница ───────────────────────────────────────────────
  if (mapping) {
    const url = `${BASE_URL}/analog/${original}`;

    let components: Component[] = [];
    // VERCEL FIX (2026-11-27): try/catch — пререндер без БД не падает
    try {
      const { data } = await supabase
        .from('components')
        .select('*')
        .or(`sku.ilike.%${original.split('-')[0]}%,name.ilike.%${original.split('-')[0]}%`)
        .limit(20);
      if (data) components = data as Component[];
    } catch (e) {
      console.error(`[analog/${original}] DB fetch error:`, e);
    }

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Подбор аналогов', item: `${BASE_URL}/analogs` },
        { '@type': 'ListItem', position: 3, name: mapping.h1, item: url },
      ],
    };

    const faqLd = mapping.faq.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: mapping.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    } : null;

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
        <main className="min-h-screen bg-background text-[#121212]">
          <section className="pt-[190px] md:pt-[200px] pb-16 px-4">
            <div className="max-w-7xl mx-auto">
              <BreadcrumbNav
                className="mb-6"
                items={[
                  { name: 'Главная', href: '/' },
                  { name: 'Подбор аналогов', href: '/analogs' },
                  { name: mapping.h1 },
                ]}
              />
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                {mapping.h1}
              </h1>
              <p className="text-lg text-[#666] max-w-3xl mb-8">{mapping.description}</p>
            </div>
          </section>

          <section className="px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              <ComponentSearch />
            </div>
          </section>

          {/* Cross-reference table */}
          <section className="px-4 pb-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Таблица кросс-референсов</h2>
              <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
                      <th className="text-left py-4 px-4 text-[#666] font-medium">Оригинал</th>
                      <th className="text-left py-4 px-4 text-[#666] font-medium">Аналог</th>
                      <th className="text-left py-4 px-4 text-[#666] font-medium">Производитель</th>
                      <th className="text-left py-4 px-4 text-[#666] font-medium">Совместимость</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mapping.analogs.map((a, i) => (
                      <tr key={i} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
                        <td className="py-3 px-4">
                          <Link href={`/component/${a.original}`} className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors">
                            {a.original}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/component/${a.replacement}`} className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors">
                            {a.replacement}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-[#333]">{a.manufacturer}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full bg-section-alt text-primary text-xs">{a.compatibility}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SEO Text */}
          <section className="px-4 pb-16">
            <div className="max-w-4xl mx-auto">
              <p className="text-[#333] leading-relaxed text-lg">{mapping.text}</p>
            </div>
          </section>

          {/* FAQ */}
          {mapping.faq.length > 0 && (
            <section className="px-4 pb-16">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
                <div className="space-y-4">
                  {mapping.faq.map((f, i) => (
                    <div key={i} className="bg-[#f0f4ee] border border-[#d4ddd2] rounded-xl p-6">
                      <h3 className="font-semibold text-[#121212] mb-2">{f.question}</h3>
                      <p className="text-[#555] leading-relaxed">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="px-4 pb-20">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Нужна помощь с подбором аналогов?</h2>
              <p className="text-[#666] mb-8 max-w-xl mx-auto">
                Отправьте BOM — проанализируем спецификацию, подберём аналоги и проверим совместимость.
              </p>
              <Link
                href="/#bom"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Отправить BOM
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  // ─── 2/3. Динамическая SKU-страница или страница серии ────────────────────
  const data = await loadAnalogPageData(original);
  if (!data) {
    notFound();
  }

  const sku = data.displaySku;
  const url = `${BASE_URL}/analog/${encodeURIComponent(sku)}`;
  const isEOL = data.kind === 'exact' && data.component.status && data.component.status !== 'В производстве';

  // Строки таблицы замен
  const rows =
    data.kind === 'exact'
      ? data.analogs.map((a) => ({
          originalSku: sku,
          replacement: a.sku,
          manufacturer: a.brand || '—',
          compatibility: compatibilityLabel(sku, a.sku),
          category: a.category || '',
        }))
      : data.family.map((a) => ({
          originalSku: sku,
          replacement: a.sku,
          manufacturer: a.brand || '—',
          compatibility: 'Модификация серии (pin-to-pin)',
          category: a.category || '',
        }));

  const relatedPosts = getRelatedBlogPosts(
    sku,
    data.kind === 'exact' ? data.component.name : '',
    data.kind === 'exact' ? data.component.category || '' : data.family[0]?.category || '',
  );

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Подбор аналогов', item: `${BASE_URL}/analogs` },
      { '@type': 'ListItem', position: 3, name: `Аналоги ${sku}`, item: url },
    ],
  };

  // ItemList для таблицы замен — помогает Google понять структуру страницы
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Аналоги ${sku}`,
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 24).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/component/${encodeURIComponent(r.replacement)}`,
      name: r.replacement,
    })),
  };

  const introText =
    data.kind === 'exact'
      ? `${sku}${data.component.brand ? ` (${data.component.brand})` : ''}${data.component.category ? ` — ${data.component.category}` : ''}. ${isEOL ? 'Компонент снят с производства или ограничен к поставке — требуется замена.' : 'Актуальный компонент; замена нужна при недоступности или для оптимизации стоимости.'} В таблице ниже — аналоги и замены: pin-to-pin совместимые варианты той же серии (разводка платы не меняется) и функциональные аналоги (сопоставимые параметры, возможно отличие корпуса). Подбор и кросс-референс таблицу бесплатно за 1 рабочий день, поставка от 6 дней.`
      : `${sku} — базовый номер серии компонентов${data.family[0]?.category ? ` (${data.family[0].category})` : ''}. В каталоге ChipNet доступно ${data.familyTotal} модификаций этой серии. В таблице — доступные варианты и замены; по каждому артикулу проверим наличие и сроки. Не нашли нужную модификацию — пришлите BOM, подберём замену и пришлём кросс-референс таблицу за 1 рабочий день.`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <main className="min-h-screen bg-background text-[#121212]">
        <section className="pt-[190px] md:pt-[200px] pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbNav
              className="mb-6"
              items={[
                { name: 'Главная', href: '/' },
                { name: 'Подбор аналогов', href: '/analogs' },
                { name: `Аналоги ${sku}` },
              ]}
            />
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Аналоги {sku} — таблица замен
            </h1>
            <p className="text-lg text-[#666] max-w-4xl leading-relaxed">{introText}</p>
            {isEOL && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-50 text-danger border border-danger/30">
                Снят с производства (EOL) — подберём замену
              </div>
            )}
          </div>
        </section>

        {/* Таблица замен */}
        <section className="px-4 pb-14">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Таблица замен {sku}
              <span className="text-base font-normal text-[#757575]"> · {rows.length} вариантов</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
                    <th className="text-left py-4 px-4 text-[#666] font-medium">Оригинал</th>
                    <th className="text-left py-4 px-4 text-[#666] font-medium">Аналог / замена</th>
                    <th className="text-left py-4 px-4 text-[#666] font-medium">Производитель</th>
                    <th className="text-left py-4 px-4 text-[#666] font-medium">Совместимость</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.replacement} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/component/${encodeURIComponent(r.originalSku)}`}
                          className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors"
                        >
                          {r.originalSku}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/component/${encodeURIComponent(r.replacement)}`}
                          className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors"
                        >
                          {r.replacement}
                        </Link>
                        {r.category && (
                          <div className="text-[11px] text-[#9a9a9a] mt-0.5">{r.category}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#333]">{r.manufacturer}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-section-alt text-primary text-xs whitespace-nowrap">
                          {r.compatibility}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#9a9a9a] mt-3">
              Совместимость определена автоматически по принадлежности к серии. Перед закупкой запросите
              у менеджера уточнённый кросс-референс с учётом корпуса и требований проекта.
            </p>
          </div>
        </section>

        {/* Полезные статьи — перелинковка с /blog (CTR 4–18% по GSC) */}
        {relatedPosts.length > 0 && (
          <section className="px-4 pb-14">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Полезные материалы по теме</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block bg-white border border-[#e8e8e8] rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="font-semibold text-[#121212] leading-snug mb-2">{p.title}</div>
                    <p className="text-xs text-[#757575] line-clamp-3">{p.description}</p>
                    <div className="text-xs text-primary font-semibold mt-3">Читать статью →</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Нужна помощь с подбором аналогов для {sku}?</h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте BOM или список артикулов — проанализируем спецификацию, подберём pin-to-pin
              и функциональные аналоги, проверим совместимость и пришлём КП.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/#bom"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Отправить BOM
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary/5 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Запросить КП
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
