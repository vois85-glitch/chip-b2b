import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { seoPages } from '@/lib/seo-pages-data';
import { geoCities } from '@/lib/geo-data';
import { blogPosts } from '@/lib/blog-data';

const BASE_URL = 'https://www.chip-net.ru';

async function getAllComponentSkus(): Promise<string[]> {
 const allSkus: string[] = [];
 const PAGE_SIZE = 1000;
 let page = 0;
 let hasMore = true;

 while (hasMore) {
 const from = page * PAGE_SIZE;
 const to = from + PAGE_SIZE - 1;

 const { data, error } = await supabase
.from('components')
.select('sku')
.order('id', { ascending: true })
.range(from, to);

 if (error || !data || data.length === 0) {
 hasMore = false;
 break;
 }

 allSkus.push(...data.map((c: { sku: string }) => c.sku));

 if (data.length < PAGE_SIZE) {
 hasMore = false;
 } else {
 page++;
 }
 }

 return allSkus;
}

async function getAllBrandSlugs(): Promise<string[]> {
 try {
 const { data } = await supabase.from('components').select('brand');
 if (!data) return [];
 const uniqueBrands = [...new Set(data.map((c: { brand: string }) => c.brand).filter(Boolean))];
 return uniqueBrands
.map((brand: string) => brand.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-|-$/g, ''))
.filter((s: string) => s.length > 0);
 } catch {
 return [];
 }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const entries: MetadataRoute.Sitemap = [];

 // 1. Главная — высший приоритет
 entries.push({
 url: BASE_URL,
 lastModified: '2026-05-28',
 changeFrequency: 'weekly',
 priority: 1.0,
 });

 // 2. SEO-хаб страницы
 const hubPages = [
 { path: '/catalog', priority: 0.9, changefreq: 'daily' },
 { path: '/brands', priority: 0.9, changefreq: 'weekly' },
 { path: '/analogs', priority: 0.8, changefreq: 'weekly' },
 { path: '/obsolete', priority: 0.8, changefreq: 'weekly' },
 { path: '/datasheets', priority: 0.8, changefreq: 'weekly' },
 { path: '/bom', priority: 0.8, changefreq: 'monthly' },
 { path: '/industries', priority: 0.7, changefreq: 'monthly' },
 { path: '/knowledge-base', priority: 0.7, changefreq: 'weekly' },
 { path: '/blog', priority: 0.7, changefreq: 'weekly' },
 { path: '/importozameshchenie', priority: 0.8, changefreq: 'weekly' },
 { path: '/proverka-komponentov', priority: 0.7, changefreq: 'monthly' },
 { path: '/komplektaciya-proizvodstv', priority: 0.7, changefreq: 'monthly' },
 { path: '/elektronnye-komponenty', priority: 0.7, changefreq: 'monthly' },
 { path: '/igbt', priority: 0.7, changefreq: 'weekly' },
 { path: '/delivery', priority: 0.8, changefreq: 'monthly' },
 { path: '/o-kompanii', priority: 0.7, changefreq: 'monthly' },
 { path: '/kontakty', priority: 0.7, changefreq: 'monthly' },
 ];

 for (const hub of hubPages) {
 entries.push({
 url: `${BASE_URL}${hub.path}`,
 lastModified: '2026-05-28',
 changeFrequency: hub.changefreq as 'daily' | 'weekly' | 'monthly',
 priority: hub.priority,
 });
 }

 // 3. SEO-страницы (категории, бренды, информация)
 for (const slug of Object.keys(seoPages)) {
 const page = seoPages[slug];
 entries.push({
 url: `${BASE_URL}/${slug}`,
 lastModified: '2026-05-28',
 changeFrequency: page.type === 'category' ? 'weekly' : 'monthly',
 priority: page.type === 'category' ? 0.8 : page.type === 'brand' ? 0.7 : 0.6,
 });
 }

 // 4. Динамические брендовые страницы (только для брендов БЕЗ seoPages и БЕЗ редиректов)
 // Бренды с seoPages уже включены в секцию 3 — дублировать через /brand/ нельзя
 // Бренды с редиректами не должны попадать в sitemap (они отдают 3xx)
 const seoBrandSlugs = new Set(
   Object.keys(seoPages).filter(s => seoPages[s].type === 'brand')
 );
 // Бренды, для которых настроены редиректы в next.config.ts
 const redirectedBrandSlugs = new Set([
   'intel-altera', 'xilinx', 'nxp', 'infineon', 'stmicroelectronics',
   'texas-instruments', 'analog-devices', 'microchip', 'renesas', 'onsemi',
   'lattice', 'murata', 'tdk', 'vishay', 'micron', 'gigadevice',
   'wurth-elektronik', 'diodes-inc', 'fujitsu', 'nordic',
   'stm', 'ti', 'adi', 'microchip-technology', 'on-semiconductor',
   'wurth', 'diodes', 'aimtec',
   'molex', 'rohm', 'avx', 'cypress',
   // Бренды с 404 на /brand/[slug]
   'espressif', 'gowin', 'monolithic-power', 'mdd', 'we',
   'другой', 'китай', 'invensense', 'worldsemi',
   'ixys', 'u-blox', 'qualcomm', 'realtek', 'panasonic',
 ]);
 const brandSlugs = await getAllBrandSlugs();
 for (const slug of brandSlugs) {
   // Пропускаем бренды, у которых есть SEO-страница на коротком URL
   if (seoBrandSlugs.has(slug)) continue;
   // Пропускаем бренды, для которых настроены редиректы
   if (redirectedBrandSlugs.has(slug)) continue;
   entries.push({
   url: `${BASE_URL}/brand/${slug}`,
   lastModified: '2026-05-28',
   changeFrequency: 'weekly',
   priority: 0.7,
   });
 }

 // 5. Страницы компонентов из Supabase
 try {
 const skus = await getAllComponentSkus();
 for (const sku of skus) {
 entries.push({
 url: `${BASE_URL}/component/${sku}`,
 lastModified: '2026-05-28',
 changeFrequency: 'monthly',
 priority: 0.5,
 });
 // SEO FIX: /datasheet/ pages removed from sitemap (blocked by robots.txt, duplicate of /component/)
 // Canonical on /datasheet/ points to /component/ for PageRank consolidation
 }
 } catch (error) {
 console.error('Sitemap: ошибка загрузки компонентов:', error);
 }


 // 7. Блог
 for (const post of blogPosts) {
 entries.push({
 url: `${BASE_URL}/blog/${post.slug}`,
 lastModified: post.date,
 changeFrequency: 'yearly',
 priority: 0.6,
 });
 }

 return entries;
}
