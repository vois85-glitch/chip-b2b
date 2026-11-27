import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import SimilarComponents from '@/components/sections/SimilarComponents';
import ComponentImageLightbox from '@/components/ui/ComponentImageLightbox';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
// LEGACY: extractSpecs больше не вызывается — читаем attributes (JSONB) из БД
// import { extractSpecs } from '@/lib/extract-specs';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { generateComponentSeoContent, generateComponentFaqs, generateComponentTitle } from '@/lib/component-seo-content';
import { generateEnrichedSeoContent, generateEnrichedFaqs } from '@/lib/component-seo-content-enhanced';
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
  params: Promise<{ sku: string[] }>;
};

export async function generateStaticParams() {
  // ISR: возвращаем пустой массив, чтобы страницы генерировались по запросу
  // и кэшировались с revalidate=3600. Предрендер всех SKU вызовет OOM на 2GB RAM.
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const sku = decodeURIComponent(resolvedParams.sku.join('/'));

  const { data: component } = await supabase
    .from('components')
    .select('*')
    .eq('sku', sku)
    .single();

  if (!component) return { title: "Компонент не найден" };

  const url = `${BASE_URL}/component/${sku}`;
  const isEOL = component.status === 'EOL';

  // ✅ Smart Title: использует generateComponentTitle для категорийных шаблонов
  // Для FPGA — добавляет LUT count, для ADC — resolution, для интерфейсов — тип
  const title = generateComponentTitle(component);

  // ✅ Smart Description: категорийные шаблоны с параметрами
  const { parseLutCount, parseResolution, parseInterfaceType } = await import('@/lib/component-seo-content');
  const luts = component.category === 'ПЛИС (FPGA)' ? parseLutCount(component.sku, component.name) : null;
  const bits = component.category === 'АЦП/ЦАП' ? parseResolution(component.sku, component.name) : null;
  const iface = component.category === 'Интерфейсы' ? parseInterfaceType(component.name, component.category) : null;
  
  const specStr = luts ? `${luts >= 1000 ? Math.round(luts/1000) + 'K' : luts} LUT, ` : bits ? `${bits}bit, ` : iface ? `${iface}, ` : '';
  
  const description = isEOL
    ? `${component.sku} (${component.brand}) снят с производства. Подберем аналог. ${specStr}Поставка 5-30 дней, проверка СВП, от 1 шт.`
    : `${component.sku} (${component.brand}) — ${specStr}поставка под заказ. Доставка по РФ, от 1 шт., проверка СВП, безналичный с НДС.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
    // SEO (2026-11-23): явный index, follow для сниппетов GSC (страницы
    // компонентов — основной индексируемый контент сайта)
    robots: { index: true, follow: true },
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// Кэш предрассчитанных спецификаций: читает /var/www/chip-net/data/specs.jsonl
// через индексный файл (1.2 MB в памяти, загружается один раз на инстанс).
// ───────────────────────────────────────────────────────────────────────────────

const SPECS_DATA_FILE = '/var/www/chip-net/data/specs.jsonl';
const SPECS_INDEX_FILE = '/var/www/chip-net/data/specs-index.json';

// In-memory кэш индекса (один на процесс)
let _specsIndex: Record<string, number> | null = null;
let _specsIndexMtime = 0;

function getSpecsIndex(): Record<string, number> | null {
  try {
    const stat = fs.statSync(SPECS_INDEX_FILE);
    if (_specsIndex && stat.mtimeMs === _specsIndexMtime) {
      return _specsIndex;
    }
    const raw = fs.readFileSync(SPECS_INDEX_FILE, 'utf8');
    _specsIndex = JSON.parse(raw);
    _specsIndexMtime = stat.mtimeMs;
    return _specsIndex;
  } catch {
    return null;
  }
}

function loadCachedSpecs(sku: string): any[] | null {
  try {
    const index = getSpecsIndex();
    if (!index) return null;
    const offset = index[sku];
    if (offset === undefined) return null;

    const fd = fs.openSync(SPECS_DATA_FILE, 'r');
    const buf = Buffer.alloc(32 * 1024);
    const len = fs.readSync(fd, buf, 0, buf.length, offset);
    fs.closeSync(fd);

    const text = buf.subarray(0, len).toString('utf8');
    const nlPos = text.indexOf('\n');
    const line = nlPos === -1 ? text : text.substring(0, nlPos);
    if (!line) return null;

    const record = JSON.parse(line);
    return record.specs || null;
  } catch {
    return null;
  }
}

export default async function ComponentPage({ params }: Props) {
  const resolvedParams = await params;
  const sku = decodeURIComponent(resolvedParams.sku.join('/'));

  const { data: component } = await supabase
    .from('components')
    .select('*')
    .eq('sku', sku)
    .single();

  if (!component) {
    // audit 2026-07-20: real 404 instead of redirect (was soft-404 with canonical=/catalog,
    // caused 733 non-canonical + 424 low-value exclusions in Yandex Webmaster)
    notFound();
  }

  const url = `${BASE_URL}/component/${sku}`;
  const isEOL = component.status === 'EOL';

  // ✅ Читаем готовые характеристики из JSONB-колонки `attributes`.
  // SEO FIX (2026-11-13): безопасная обработка любых форматов attributes:
  //   1. Плоский словарь {"label": "value", ...} — основной формат после миграции
  //   2. Легаси вложенный {"specs": [{label, value}, ...], "nomenclature_number": "..."}
  //   3. Пустой/null — нет характеристик
  // Раньше при вложенном формате на страницу попадало "[object Object]" —
  // Object.entries() превращал массив объектов в строку через String(value).
  const rawAttributes: any = (component as any).attributes || {};

  // Разворачиваем легаси-формат {specs: [...]} в плоские пары label→value
  const flattenAttributes = (attrs: any): Record<string, string> => {
    const flat: Record<string, string> = {};

    // Case 1: {specs: [{label, value}, ...]} — легаси вложенный формат
    if (attrs && typeof attrs === 'object' && Array.isArray(attrs.specs)) {
      for (const item of attrs.specs) {
        if (item && typeof item === 'object' && item.label !== undefined) {
          flat[String(item.label)] = String(item.value ?? '');
        }
      }
      // Сохраняем nomenclature_number, если есть (используется для поиска по номенклатурному номеру)
      if (attrs.nomenclature_number !== undefined && attrs.nomenclature_number !== null) {
        flat.nomenclature_number = String(attrs.nomenclature_number);
      }
      return flat;
    }

    // Case 2: плоский словарь {key: value, ...} — основной формат
    if (attrs && typeof attrs === 'object') {
      for (const [key, value] of Object.entries(attrs)) {
        // Пропускаем нескалярные значения (массивы/объекты), чтобы не получить [object Object]
        if (value === null || value === undefined) continue;
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          flat[key] = String(value);
        } else if (Array.isArray(value)) {
          // Массив скаляров — join через запятую
          const scalars = value.filter((v) => typeof v === 'string' || typeof v === 'number');
          if (scalars.length > 0) {
            flat[key] = scalars.map(String).join(', ');
          }
        }
        // Вложенные объекты внутри плоского словаря — пропускаем (не рендерим)
      }
    }
    return flat;
  };

  const attributesJsonb: Record<string, string> = flattenAttributes(rawAttributes);
  const technicalSpecs: { label: string; value: string }[] = Object.entries(attributesJsonb).map(
    ([key, value]) => ({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: String(value),
    })
  );

  // ✅ Breadcrumb из БД: JOIN с categories (slug, parent_id) и brands (slug)
  // Получаем slug категории и slug её родителя (группы) одним запросом
  let catSlug: string | undefined;
  let parentCatSlug: string | undefined;
  let brandSlug: string | undefined;
  let categoryName: string | undefined = component.category;
  let brandName: string | undefined = component.brand;

  // parallel queries for category + brand
  const [catResp, brandResp] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug, parent_id')
      .eq('name', component.category)
      .limit(1),
    supabase
      .from('brands')
      .select('id, name, slug')
      .eq('name', component.brand)
      .limit(1)
  ]);

  if (catResp.data && catResp.data[0]) {
    const cat = catResp.data[0];
    catSlug = cat.slug;
    categoryName = cat.name;
    if (cat.parent_id) {
      const { data: parent } = await supabase
        .from('categories')
        .select('slug, name')
        .eq('id', cat.parent_id)
        .limit(1)
        .single();
      if (parent) parentCatSlug = parent.slug;
    }
  }

  if (brandResp.data && brandResp.data[0]) {
    brandSlug = brandResp.data[0].slug;
    brandName = brandResp.data[0].name;
  }

  // ✅ B2B JSON-LD: паттерн "price-on-request"
  // Поле price ОПУЩЕНО намеренно — цена зависит от объёма заказа
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: component.sku,
    description: component.description || component.name,
    sku: component.sku,
    mpn: component.sku,              // Manufacturer Part Number
    brand: { '@type': 'Brand', name: component.brand },
    category: component.category,
    url,
    // ✅ Технические параметры как PropertyValue для SEO
    additionalProperty: technicalSpecs.map(s => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    })),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'RUB',
      // ✅ priceSpecification говорит поисковику: "цена формируется под объём"
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'RUB',
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          minValue: 1,        // от 1 шт.
          unitCode: 'C62',    // штуки
        },
      },
      availability: isEOL
        ? 'https://schema.org/Discontinued'
        : 'https://schema.org/BackOrder',
      itemCondition: 'https://schema.org/NewCondition',
      businessFunction: 'https://schema.org/Sell',
      seller: {
        '@type': 'Organization',
        name: 'ChipNet (ООО Деловой Партнёр)',
        taxID: '3123341983',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'RU',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
      },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
      ...(catSlug ? [{ '@type': 'ListItem', position: 3, name: component.category, item: `${BASE_URL}/catalog/${parentCatSlug || 'kategorii'}/${catSlug}` }] : []),
      { '@type': 'ListItem', position: catSlug ? 4 : 3, name: component.sku, item: url },
    ],
  };

  // ✅ SEO (2026-11-23): перелинковка с релевантными статьями /blog —
  // статьи сравнения ОУ (LM358/TL072/NE5532) и аналогов МК (STM32/GD32/CH32)
  // дают максимальный CTR 4–18% по GSC и приводят целевой B2B-трафик
  const relatedBlogPosts = getRelatedBlogPosts(component.sku, component.name, component.category);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-screen bg-background text-[#121212]">
        <div className="max-w-7xl mx-auto px-4 pt-[190px] md:pt-[200px] pb-24">
          {/* ✅ Хлебные крошки-кнопки (пилюли 40px) — единый дизайн-код со страницей бренда */}
          <BreadcrumbNav
            className="mb-8"
            items={[
              { name: 'Главная', href: '/' },
              { name: 'Каталог', href: '/catalog' },
              ...(catSlug
                ? [{ name: component.category, href: `/catalog/${parentCatSlug || 'kategorii'}/${catSlug}` }]
                : []),
              { name: component.sku },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* ✅ H1 + фото компонента (кликабельное, лайтбокс) */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                {/* ✅ Фото компонента с лайтбоксом: клик — увеличить */}
                <ComponentImageLightbox
                  sku={component.sku}
                  name={component.name}
                  category={component.category}
                  size={160}
                  attributes={attributesJsonb}
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                    {component.sku} — {component.name} {component.brand}
                  </h1>
                  <p className="text-base md:text-xl text-[#333] mb-4">характеристики, даташит, аналоги</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      isEOL ? 'bg-red-50 text-danger border border-danger/30' : 'bg-section-alt text-primary border border-[#cbcbcb]'
                    }`}>
                      {isEOL ? 'Снят с производства (EOL)' : 'В производстве'}
                    </div>
                    <AddToCartButton
                      sku={component.sku}
                      name={component.name}
                      brand={component.brand}
                      category={component.category}
                      size="md"
                      variant="primary"
                    />
                    {/* ✅ Datasheet (PDF) — прямой поиск на Alldatasheet */}
                    <a
                      href={`https://www.alldatasheet.com/view.jsp?Searchword=${encodeURIComponent(component.sku)}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-2 px-4 h-11 border border-[#d4ddd2] bg-white text-[#333] hover:border-primary/50 hover:text-primary rounded-xl text-sm font-semibold transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Datasheet (PDF)
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-2xl p-6 sm:p-8 mb-8">
                <h2 className="text-xl font-bold mb-5 text-primary">Технические параметры</h2>

                {/* Полная таблица параметров — извлечена из артикула/описания */}
                {technicalSpecs.length > 0 && (
                  <div className="overflow-x-auto -mx-2 sm:mx-0 mb-6">
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        {technicalSpecs.map((spec, idx) => (
                          <tr
                            key={spec.label}
                            className={idx % 2 === 0 ? 'bg-[#e8efe5]' : 'bg-[#f0f4ee]'}
                          >
                            <td className="py-2.5 px-3 sm:px-4 text-[#757575] font-medium w-[45%] sm:w-[40%] align-top border-b border-[#e0e8de]">
                              {spec.label}
                            </td>
                            <td className="py-2.5 px-3 sm:px-4 text-[#121212] font-semibold align-top border-b border-[#e0e8de]">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Описание компонента */}
                {component.description && (
                  <div className="mt-4 pt-4 border-t border-[#e0e8de]">
                    <h3 className="text-sm font-bold text-[#333] mb-2 uppercase tracking-wide">Описание</h3>
                    <p className="text-[#444] leading-relaxed text-sm sm:text-base">{component.description}</p>
                  </div>
                )}

                {/* SEO: Generated unique content for long-tail search */}
                <div className="mt-4 pt-4 border-t border-[#e0e8de]">
                  <h3 className="text-sm font-bold text-[#333] mb-2 uppercase tracking-wide">О компоненте {component.sku}</h3>
                  <p className="text-[#444] leading-relaxed text-sm sm:text-base">
                    {generateEnrichedSeoContent(component)}
                  </p>
                </div>

                {/* SEO: FAQ section for rich snippets */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-[#121212] mb-4">Часто задаваемые вопросы о {component.sku}</h3>
                  <div className="space-y-4">
                    {generateEnrichedFaqs(component).map((faq, idx) => (
                      <div key={idx} className="border border-[#e8e8e8] rounded-lg p-4">
                        <p className="font-semibold text-[#121212] mb-2">{faq.q}</p>
                        <p className="text-[#444] text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {component.analogs && component.analogs.length > 0 && (
                <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-2xl p-8">
                  <h2 className="text-xl font-bold mb-4 text-[#121212]">Аналоги и замены для {component.sku}</h2>
                  <p className="text-[#666] mb-4">
                    {isEOL
                      ? 'Данный компонент снят с производства. Мы предлагаем следующие аналоги:'
                      : 'В случае недоступности, рекомендуем следующие кросс-референсы:'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {component.analogs.map((analog: string) => (
                      <Link key={analog} href={`/component/${analog}`}
                        className="px-4 py-2 bg-section-alt border border-[#cbcbcb] rounded-lg text-primary hover:bg-section-alt transition-colors font-semibold">
                        {analog}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
<SimilarComponents currentSku={component.sku} brand={component.brand} category={component.category} />

              {/* ✅ SEO (2026-11-23): перелинковка с /blog — тематические статьи
                  подбираются по артикулу и категории (lib/blog-links.ts) */}
              {relatedBlogPosts.length > 0 && (
                <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 sm:p-8 mt-8">
                  <h2 className="text-xl font-bold mb-4 text-[#121212]">
                    Полезные материалы по теме
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {relatedBlogPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block bg-[#f7faf5] border border-[#e4eae2] rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                      >
                        <div className="font-semibold text-[#121212] text-sm leading-snug mb-1.5">
                          {post.title}
                        </div>
                        <p className="text-xs text-[#757575] line-clamp-3">{post.description}</p>
                        <div className="text-xs text-primary font-semibold mt-2">Читать статью →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ✅ B2B UI-блок «Цена по запросу» с RFQ CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-emerald-50 to-emerald-50/60 border border-emerald-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-lg font-bold text-emerald-900">Цена и наличие</h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isEOL
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isEOL ? 'EOL / Снят с производства' : 'В производстве'}
                  </span>
                </div>

                <p className="text-3xl font-bold text-emerald-900 mb-1">Цена по запросу</p>
                <p className="text-sm text-gray-600 mb-4">
                  {isEOL
                    ? 'Подберем доступный аналог с полноценной технической поддержкой.'
                    : 'Цена зависит от объёма и сроков. Отгрузка от 1 шт., безналичный расчёт с НДС.'}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                  <Link prefetch={false}
                    href={`/rfq?sku=${encodeURIComponent(component.sku)}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Запросить КП
                  </Link>
                  <a
                    href="tel:+79103219191"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +7 (910) 321-91-91
                  </a>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Ответ менеджера в течение 30 минут в рабочее время.
                  Возможна поставка под заказ 5-30 дней.
                </p>

                <div className="pt-3 border-t border-emerald-200 space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Гарантия оригинала
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Контроль в лаборатории СВП
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Безналичный расчёт с НДС
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
