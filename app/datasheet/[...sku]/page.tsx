import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
 const sku = resolvedParams.sku.join('/');

 const { data: component } = await supabase
.from('components')
.select('*')
.eq('sku', sku)
.single();

 if (!component) return { title: 'Даташит не найден' };

 const url = `${BASE_URL}/datasheet/${sku}`;
 const title = `${component.sku} — даташит, характеристики, аналоги`;
 const description = `Даташит ${component.name} (${component.brand}). Технические характеристики, параметры, аналоги и замены для ${component.sku}. Проверка в лаборатории СВП.`;

 // SEO FIX: noindex because /datasheet/ duplicates /component/ content
 // Canonical points to /component/ for PageRank consolidation
 return {
 title,
 description,
 robots: { index: false, follow: true },
 alternates: { canonical: `${BASE_URL}/component/${sku}` },
 openGraph: {
 title,
 description,
 url: `${BASE_URL}/component/${sku}`,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
 };
}

export default async function DatasheetPage({ params }: Props) {
 const resolvedParams = await params;
 const sku = resolvedParams.sku.join('/');

 const { data: component } = await supabase
.from('components')
.select('*')
.eq('sku', sku)
.single();

 if (!component) {
 notFound();
 }

 const url = `${BASE_URL}/datasheet/${sku}`;

 const categorySlugMap: Record<string, string> = {
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
 'Телекоммуникации': 'telekommunikatsii',
 'Микросхемы': 'mikroshemy',
 };

 const catSlug = categorySlugMap[component.category];

 const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'Даташиты', item: `${BASE_URL}/datasheets` },
...(catSlug ? [{ '@type': 'ListItem', position: 3, name: component.category, item: `${BASE_URL}/${catSlug}` }] : []),
 { '@type': 'ListItem', position: catSlug ? 4 : 3, name: `${component.sku} даташит`, item: url },
 ],
 };

 const techArticleLd = {
 '@context': 'https://schema.org',
 '@type': 'TechArticle',
 headline: `Даташит ${component.sku}`,
 description: component.description || component.name,
 about: {
 '@type': 'Product',
 name: component.sku,
 brand: { '@type': 'Brand', name: component.brand },
 category: component.category,
 },
 };

 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleLd) }} />
 <main className="min-h-screen bg-background text-[#121212]">
 <div className="max-w-7xl mx-auto px-4 py-24">
 {/* Breadcrumb */}
 <div className="text-sm text-[#666] mb-8 flex items-center gap-2 flex-wrap">
 <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
 <span className="text-[#cbcbcb]">/</span>
 <Link href="/datasheets" className="hover:text-primary transition-colors">Даташиты</Link>
 {catSlug && (
 <>
 <span className="text-[#cbcbcb]">/</span>
 <Link href={`/${catSlug}`} className="hover:text-primary transition-colors">{component.category}</Link>
 </>
 )}
 <span className="text-[#cbcbcb]">/</span>
 <span className="text-primary">{component.sku}</span>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 <div className="lg:col-span-2">
 <h1 className="text-4xl md:text-5xl font-bold mb-4">
 Даташит {component.sku}
 </h1>
 <p className="text-xl text-[#333] mb-8">{component.name}</p>

 {/* Status */}
 <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${
 component.status === 'EOL' ? 'bg-red-50 text-danger border border-danger/30' : 'bg-section-alt text-primary border border-[#d4ddd2]'
 }`}>
 {component.status === 'EOL' ? 'Снят с производства (EOL)' : 'В производстве'}
 </div>

 {/* Technical data */}
 <div className="bg-[#f0f4ee] border border-[#d4ddd2] rounded-2xl p-8 mb-8">
 <h2 className="text-xl font-bold mb-4 text-primary">Технические данные</h2>
 <div className="grid grid-cols-2 gap-4 text-[#333]">
 <div><span className="text-[#666]">Part Number:</span> <strong className="font-mono">{component.sku}</strong></div>
 <div><span className="text-[#666]">Бренд:</span> <strong>{component.brand}</strong></div>
 <div><span className="text-[#666]">Категория:</span> <strong>{component.category}</strong></div>
 <div><span className="text-[#666]">Статус:</span> <strong>{component.status === 'EOL' ? 'EOL (Obsolete)' : 'Active'}</strong></div>
 <div className="col-span-2"><span className="text-[#666]">Описание:</span> <strong>{component.description}</strong></div>
 </div>
 </div>

 {/* Datasheet info */}
 <div className="bg-[#eaf0e8] border border-[#d4ddd2] rounded-2xl p-8 mb-8">
 <h2 className="text-xl font-bold mb-4">Информация из даташита</h2>
 <p className="text-[#555] leading-relaxed mb-4">
 Даташит (datasheet) на {component.sku} от {component.brand} содержит полную техническую документацию: электрические параметры, временные диаграммы, рекомендации по разводке платы, тепловые характеристики и типовые схемы включения. Для получения актуального даташита обратитесь к производителю или отправьте запрос через форму ниже.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div className="flex items-center gap-2 text-sm text-[#333]">
 <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 Абсолютные максимальные параметры
 </div>
 <div className="flex items-center gap-2 text-sm text-[#333]">
 <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 Электрические характеристики
 </div>
 <div className="flex items-center gap-2 text-sm text-[#333]">
 <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 Временные диаграммы
 </div>
 <div className="flex items-center gap-2 text-sm text-[#333]">
 <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 Типовые схемы включения
 </div>
 <div className="flex items-center gap-2 text-sm text-[#333]">
 <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 Информация по корпусу
 </div>
 <div className="flex items-center gap-2 text-sm text-[#333]">
 <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 Рекомендации по PCB-дизайну
 </div>
 </div>
 </div>

 {/* Analogs */}
 {component.analogs && component.analogs.length > 0 && (
 <div className="bg-[#eaf0e8] border border-[#d4ddd2] rounded-2xl p-8">
 <h2 className="text-xl font-bold mb-4">Аналоги и замены для {component.sku}</h2>
 <p className="text-[#555] mb-4">
 {component.status === 'EOL'
 ? 'Данный компонент снят с производства. Рекомендуем следующие аналоги с совместимостью pin-to-pin:'
 : 'При недоступности основного компонента рекомендуем кросс-референсы:'}
 </p>
 <div className="flex flex-wrap gap-3">
 {component.analogs.map((analog: string) => (
 <Link key={analog} href={`/component/${analog}`}
 className="px-4 py-2 bg-section-alt border border-[#d4ddd2] rounded-lg text-primary hover:bg-[#dee9e1] transition-colors font-semibold">
 {analog}
 </Link>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Sidebar */}
 <div className="lg:col-span-1">
 <div className="sticky top-24 bg-[#f0f4ee] border border-[#d4ddd2] rounded-2xl p-8">
 <h2 className="text-2xl font-bold mb-4">Запросить даташит и КП</h2>
 <p className="text-[#555] mb-6">Укажите нужный объём — проверим наличие, предоставим даташит и выставим КП.</p>
 <a href="/#bom" className="block w-full text-center px-8 py-4 bg-primary hover:bg-primary-dark rounded-xl text-lg font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 mb-4">
 Отправить заявку
 </a>
 <p className="text-xs text-[#666] text-center">Гарантия оригинала. Контроль в лаборатории СВП.</p>
 </div>
 </div>
 </div>
 </div>
 </main>
 </>
 );
}
