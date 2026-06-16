import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
 const title = `${component.sku} — купить, цена, аналоги, даташит`;
 const description = `Поставка ${component.name} (${component.brand}). ${component.status === 'EOL' ? 'Снят с производства. Подберем аналог.' : 'В наличии под заказ.'} Проверка в лаборатории СВП. ООО Деловой Партнёр.`;

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
 };
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
 notFound();
 }

 const url = `${BASE_URL}/component/${sku}`;

 // Get category slug for breadcrumb
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

 const catSlug = categorySlugMap[component.category];

 const productLd = {
 '@context': 'https://schema.org',
 '@type': 'Product',
 name: component.sku,
 description: component.description || component.name,
 brand: { '@type': 'Brand', name: component.brand },
 category: component.category,
 offers: {
 '@type': 'Offer',
 url,
 priceCurrency: 'RUB',
 availability: component.status === 'EOL'
 ? 'https://schema.org/Discontinued'
 : 'https://schema.org/InStock',
 seller: { '@type': 'Organization', name: 'ChipNet (ООО Деловой Партнёр)' },
 },
 };

 const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
...(catSlug ? [{ '@type': 'ListItem', position: 3, name: component.category, item: `${BASE_URL}/${catSlug}` }] : []),
 { '@type': 'ListItem', position: catSlug ? 4 : 3, name: component.sku, item: url },
 ],
 };

 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
 <div className="min-h-screen bg-background text-[#121212]">
 <div className="max-w-7xl mx-auto px-4 py-24">
 <div className="text-sm text-[#757575] mb-8 flex items-center gap-2 flex-wrap">
 <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
 <span className="text-[#cbcbcb]">/</span>
 <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
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
 <h1 className="text-4xl md:text-5xl font-bold mb-4">{component.sku}</h1>
 <p className="text-xl text-[#333] mb-8">{component.name}</p>
 <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${
 component.status === 'EOL' ? 'bg-red-50 text-danger border border-danger/30' : 'bg-section-alt text-primary border border-[#cbcbcb]'
 }`}>
 {component.status === 'EOL' ? 'Снят с производства (EOL)' : 'В производстве'}
 </div>
 <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-2xl p-8 mb-8">
 <h2 className="text-xl font-bold mb-4 text-primary">Технические данные</h2>
 <div className="grid grid-cols-2 gap-4 text-[#333]">
 <div><span className="text-[#757575]">Бренд:</span> <strong>{component.brand}</strong></div>
 <div><span className="text-[#757575]">Категория:</span> <strong>{component.category}</strong></div>
 <div className="col-span-2"><span className="text-[#757575]">Описание:</span> <strong>{component.description}</strong></div>
 </div>
 </div>
 {component.analogs && component.analogs.length > 0 && (
 <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-2xl p-8">
 <h2 className="text-xl font-bold mb-4 text-[#121212]">Аналоги и замены для {component.sku}</h2>
 <p className="text-[#666] mb-4">
 {component.status === 'EOL'
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
 </div>
 <div className="lg:col-span-1">
 <div className="sticky top-24 bg-[#f0f4ee] border border-[#e8e8e8] rounded-2xl p-8">
 <h2 className="text-2xl font-bold mb-4">Запросить КП на {component.sku}</h2>
 <p className="text-[#666] mb-6">Укажите нужный объем. Мы проверим наличие и выставим коммерческое предложение.</p>
 <a href="/#bom" className="block w-full text-center px-8 py-4 bg-primary hover:bg-primary-dark rounded-xl text-lg font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 mb-4">
 Отправить заявку
 </a>
 <p className="text-xs text-[#757575] text-center">Гарантия оригинала. Контроль в лаборатории СВП.</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </>
 );
}
