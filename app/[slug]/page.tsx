import { Metadata } from 'next';
import { seoPages } from '@/lib/seo-pages-data';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

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
 params: Promise<{ slug: string }>;
};

// Related links for internal SEO linking
const relatedLinks: Record<string, { title: string; links: { label: string; href: string }[] }> = {
 'arm-kontrollery': {
 title: 'Связанные разделы',
 links: [
 { label: 'Подбор аналогов STM32', href: '/analogs' },
 { label: 'Импортозамещение', href: '/importozameshchenie' },
 { label: 'Gigadevice (GD32)', href: '/gigadevice' },
 { label: 'STMicroelectronics', href: '/stmicroelectronics' },
 { label: 'Даташиты', href: '/datasheets' },
 ],
 },
 'fpga': {
 title: 'Связанные разделы',
 links: [
 { label: 'Xilinx', href: '/xilinx' },
 { label: 'Intel/Altera', href: '/altera' },
 { label: 'Lattice', href: '/lattice' },
 { label: 'Подбор аналогов FPGA', href: '/analogs' },
 { label: 'Импортозамещение', href: '/importozameshchenie' },
 ],
 },
 'tranzistory': {
 title: 'Связанные разделы',
 links: [
 { label: 'MOSFET', href: '/mosfet' },
 { label: 'IGBT', href: '/igbt' },
 { label: 'Диоды', href: '/diody' },
 { label: 'Infineon', href: '/infineon' },
 { label: 'onsemi', href: '/onsemi' },
 ],
 },
 'stabilizatory': {
 title: 'Связанные разделы',
 links: [
 { label: 'Питание и DC-DC', href: '/pitaniya' },
 { label: 'Подбор аналогов LDO', href: '/analogs' },
 { label: 'Texas Instruments', href: '/texas-instruments' },
 { label: 'Даташиты', href: '/datasheets' },
 ],
 },
 'importozameshchenie': {
 title: 'Связанные услуги',
 links: [
 { label: 'Подбор аналогов', href: '/podbor-analogov' },
 { label: 'Проверка компонентов', href: '/proverka-komponentov' },
 { label: 'BOM-комплектация', href: '/komplektaciya-proizvodstv' },
 { label: 'Снятые с производства (EOL)', href: '/obsolete' },
 { label: 'Микроконтроллеры', href: '/arm-kontrollery' },
 { label: 'FPGA / ПЛИС', href: '/fpga' },
 ],
 },
 'podbor-analogov': {
 title: 'Связанные услуги',
 links: [
 { label: 'Импортозамещение', href: '/importozameshchenie' },
 { label: 'Проверка компонентов', href: '/proverka-komponentov' },
 { label: 'Кросс-референсы', href: '/analogs' },
 { label: 'Микроконтроллеры', href: '/arm-kontrollery' },
 { label: 'FPGA / ПЛИС', href: '/fpga' },
 ],
 },
 'proverka-komponentov': {
 title: 'Связанные услуги',
 links: [
 { label: 'Импортозамещение', href: '/importozameshchenie' },
 { label: 'Подбор аналогов', href: '/podbor-analogov' },
 { label: 'BOM-комплектация', href: '/komplektaciya-proizvodstv' },
 { label: 'Каталог компонентов', href: '/catalog' },
 ],
 },
 'komplektaciya-proizvodstv': {
 title: 'Связанные услуги',
 links: [
 { label: 'Подбор аналогов', href: '/podbor-analogov' },
 { label: 'Проверка компонентов', href: '/proverka-komponentov' },
 { label: 'BOM-запрос', href: '/bom' },
 { label: 'Импортозамещение', href: '/importozameshchenie' },
 { label: 'Даташиты', href: '/datasheets' },
 ],
 },
 'elektronnye-komponenty': {
 title: 'Каталог компонентов',
 links: [
 { label: 'Микроконтроллеры', href: '/arm-kontrollery' },
 { label: 'FPGA / ПЛИС', href: '/fpga' },
 { label: 'Транзисторы', href: '/tranzistory' },
 { label: 'Конденсаторы', href: '/kondensatory' },
 { label: 'Все производители', href: '/brands' },
 { label: 'Каталог', href: '/catalog' },
 ],
 },
 'igbt': {
 title: 'Связанные разделы',
 links: [
 { label: 'Транзисторы', href: '/tranzistory' },
 { label: 'MOSFET', href: '/mosfet' },
 { label: 'Infineon', href: '/infineon' },
 { label: 'onsemi', href: '/onsemi' },
 { label: 'Питание и DC-DC', href: '/pitaniya' },
 ],
 },
};

export async function generateStaticParams() {
 return Object.keys(seoPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { slug } = await params;
 const seo = seoPages[slug];

 if (!seo) {
 return { title: 'Страница не найдена' };
 }

 const url = `${BASE_URL}/${slug}`;

 return {
 title: seo.title,
 description: seo.description,
 alternates: {
 canonical: url,
 },
 openGraph: {
 title: seo.title,
 description: seo.description,
 url,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
 };
}

export default async function SlugPage({ params }: Props) {
 const { slug } = await params;
 const seo = seoPages[slug];

 if (!seo) {
 notFound();
 }

 const url = `${BASE_URL}/${slug}`;

 // Fetch components from DB based on category or brand
 let components: Component[] = [];
 if (seo.dbFilter) {
 let query = supabase.from('components').select('*').limit(50);
 if (seo.dbFilter.category) {
 query = query.eq('category', seo.dbFilter.category);
 }
 if (seo.dbFilter.brand) {
 query = query.eq('brand', seo.dbFilter.brand);
 }
 const { data } = await query;
 if (data) {
 components = data as Component[];
 }
 }

 // JSON-LD: BreadcrumbList
 const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 {
 '@type': 'ListItem',
 position: 1,
 name: 'Главная',
 item: BASE_URL,
 },
 {
 '@type': 'ListItem',
 position: 2,
 name: seo.h1,
 item: url,
 },
 ],
 };

 // JSON-LD: ItemList for components
 const itemListLd = components.length > 0 ? {
 '@context': 'https://schema.org',
 '@type': 'ItemList',
 name: seo.h1,
 numberOfItems: components.length,
 itemListElement: components.slice(0, 10).map((comp, i) => ({
 '@type': 'ListItem',
 position: i + 1,
 item: {
 '@type': 'Product',
 name: comp.sku,
 description: comp.description || comp.name,
 brand: { '@type': 'Brand', name: comp.brand },
 url: `${BASE_URL}/component/${comp.sku}`,
 offers: {
 '@type': 'Offer',
 priceCurrency: 'RUB',
 availability: comp.status === 'EOL'
 ? 'https://schema.org/Discontinued'
 : 'https://schema.org/InStock',
 seller: { '@type': 'Organization', name: 'ChipNet' },
 },
 },
 })),
 } : null;

 // Get related links for this page
 const pageRelated = relatedLinks[slug];

 const ctaText = seo.type === 'info'
 ? 'Нужна консультация?'
 : seo.type === 'category'
 ? 'Нужна консультация по категории?'
 : `Нужна поставка компонентов?`;

 const ctaDesc = seo.type === 'info'
 ? 'Отправьте заявку — наши инженеры подберут решение и рассчитают сроки.'
 : 'Отправьте заявку — подберём компоненты, найдём аналоги и рассчитаем сроки поставки.';

 return (
 <>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
 />
 {itemListLd && (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
 />
 )}
 <main className="min-h-screen bg-background text-[#121212]">
 {/* Breadcrumb + Title */}
 <section className="pt-32 pb-16 px-4">
 <div className="max-w-7xl mx-auto">
 <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2">
 <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
 <span className="text-[#cbcbcb]">/</span>
 <span className="text-[#666]">{seo.h1}</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 {seo.h1}
 </h1>
 <p className="text-lg text-[#666] max-w-3xl mb-8">
 {seo.description}
 </p>
 </div>
 </section>

 {/* Search */}
 <section className="px-4 pb-12">
 <div className="max-w-7xl mx-auto">
 <ComponentSearch />
 </div>
 </section>

 {/* Components table */}
 {components.length > 0 && (
 <section className="px-4 pb-16">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-2xl font-bold mb-8">
 {seo.type === 'category' ? 'Компоненты в категории' : `Компоненты ${seo.h1.split(' ').slice(-1)[0]}`}
 <span className="text-primary ml-2">({components.length})</span>
 </h2>
 <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
 <th className="text-left py-4 px-4 text-[#666] font-medium">SKU</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Наименование</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Бренд</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Статус</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Аналоги</th>
 </tr>
 </thead>
 <tbody>
 {components.map((comp) => (
 <tr key={comp.sku} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
 <td className="py-3 px-4">
 <Link
 href={`/component/${comp.sku}`}
 className="text-primary hover:text-primary-dark font-mono font-medium transition-colors"
 >
 {comp.sku}
 </Link>
 </td>
 <td className="py-3 px-4 text-[#333] max-w-xs truncate">
 {comp.name}
 </td>
 <td className="py-3 px-4">
 <Link href={`/${comp.brand.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-|-$/g, '')}`} className="text-[#666] hover:text-primary transition-colors">
 {comp.brand}
 </Link>
 </td>
 <td className="py-3 px-4">
 {comp.status === 'EOL' ? (
 <span className="px-2 py-1 rounded-full bg-red-50 text-danger text-xs">EOL</span>
 ) : (
 <span className="px-2 py-1 rounded-full bg-section-alt text-primary text-xs">В производстве</span>
 )}
 </td>
 <td className="py-3 px-4 text-[#757575] text-xs max-w-xs truncate">
 {comp.analogs && comp.analogs.length > 0
 ? comp.analogs.join(', ')
 : '—'}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </section>
 )}

 {/* SEO text */}
 <section className="px-4 pb-16">
 <div className="max-w-4xl mx-auto">
 <p className="text-[#333] leading-relaxed text-lg">
 {seo.text}
 </p>
 </div>
 </section>

 {/* Related links for internal SEO */}
 {pageRelated && (
 <section className="px-4 pb-16">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">{pageRelated.title}</h2>
 <div className="flex flex-wrap gap-3">
 {pageRelated.links.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all"
 >
 {link.label}
 </Link>
 ))}
 </div>
 </div>
 </section>
 )}

 {/* Default related links for pages without specific relatedLinks */}
 {!pageRelated && (
 <section className="px-4 pb-16">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">Полезные разделы</h2>
 <div className="flex flex-wrap gap-3">
 <Link href="/catalog" className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all">
 Каталог компонентов
 </Link>
 <Link href="/brands" className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all">
 Производители
 </Link>
 <Link href="/analogs" className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all">
 Подбор аналогов
 </Link>
 <Link href="/importozameshchenie" className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all">
 Импортозамещение
 </Link>
 <Link href="/datasheets" className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all">
 Даташиты
 </Link>
 </div>
 </div>
 </section>
 )}

 {/* CTA */}
 <section className="px-4 pb-20">
 <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
 <h2 className="text-2xl md:text-3xl font-bold mb-4">
 {ctaText}
 </h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 {ctaDesc}
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/#bom"
 className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Отправить заявку
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 <Link
 href="/catalog"
 className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Каталог компонентов
 </Link>
 </div>
 </div>
 </section>
 </main>
 </>
 );
}
