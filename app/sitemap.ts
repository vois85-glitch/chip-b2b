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
    lastModified: '2026-05-27',
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Каталог
  entries.push({
    url: `${BASE_URL}/catalog`,
    lastModified: '2026-05-27',
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // 2. SEO-страницы (категории, бренды, информация)
  for (const slug of Object.keys(seoPages)) {
    const page = seoPages[slug];
    entries.push({
      url: `${BASE_URL}/${slug}`,
      lastModified: '2026-05-27',
      changeFrequency: page.type === 'category' ? 'weekly' : 'monthly',
      priority: page.type === 'category' ? 0.8 : page.type === 'brand' ? 0.7 : 0.6,
    });
  }

  // 3. Динамические брендовые страницы
  const brandSlugs = await getAllBrandSlugs();
  for (const slug of brandSlugs) {
    entries.push({
      url: `${BASE_URL}/brand/${slug}`,
      lastModified: '2026-05-27',
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // 4. Страницы компонентов из Supabase (пагинация!)
  try {
    const skus = await getAllComponentSkus();
    for (const sku of skus) {
      entries.push({
        url: `${BASE_URL}/component/${sku}`,
        lastModified: '2026-05-27',
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  } catch (error) {
    console.error('Sitemap: ошибка загрузки компонентов:', error);
  }

  // 5. Гео-страницы
  for (const slug of Object.keys(geoCities)) {
    entries.push({
      url: `${BASE_URL}/geo/${slug}`,
      lastModified: '2026-05-27',
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // 6. Блог
  entries.push({
    url: `${BASE_URL}/blog`,
    lastModified: '2026-05-27',
    changeFrequency: 'weekly',
    priority: 0.7,
  });
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
