import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { seoPages } from '@/lib/seo-pages-data';
import { geoCities } from '@/lib/geo-data';
import { blogPosts } from '@/lib/blog-data';

const BASE_URL = 'https://www.chip-net.ru';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // 1. Главная страница
  entries.push({ url: BASE_URL });

  // 2. SEO-страницы (категории, бренды, информация) из seo-pages-data
  for (const slug of Object.keys(seoPages)) {
    entries.push({ url: `${BASE_URL}/${slug}` });
  }

  // 3. Страницы компонентов из Supabase
  try {
    const { data: components } = await supabase
      .from('components')
      .select('sku')
      .limit(50000);

    if (components) {
      for (const comp of components) {
        entries.push({ url: `${BASE_URL}/component/${comp.sku}` });
      }
    }
  } catch (error) {
    console.error('Sitemap: ошибка загрузки компонентов:', error);
  }

  // 4. Гео-страницы
  for (const slug of Object.keys(geoCities)) {
    entries.push({ url: `${BASE_URL}/geo/${slug}` });
  }

  // 5. Блог
  entries.push({ url: `${BASE_URL}/blog` });
  for (const post of blogPosts) {
    entries.push({ url: `${BASE_URL}/blog/${post.slug}` });
  }

  return entries;
}

