import { Metadata } from 'next';
import { blogPosts, getBlogPost } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';

const BASE_URL = 'https://www.chip-net.ru';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Статья не найдена' };
  }

  const url = `${BASE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      locale: 'ru_RU',
      siteName: 'ChipNet',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const url = `${BASE_URL}/blog/${slug}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'ChipNet',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ChipNet',
      url: BASE_URL,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <main className="min-h-screen bg-[#050807] text-white">
        <Header />

        <article className="pt-32 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-emerald-400 transition-colors">Главная</Link>
              <span className="text-gray-600">/</span>
              <Link href="/blog" className="hover:text-emerald-400 transition-colors">Блог</Link>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
            </nav>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-2 py-1 rounded-full bg-emerald-900/40 text-emerald-400 text-xs">
                {post.category}
              </span>
              <time className="text-gray-600 text-xs">{post.date}</time>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              {post.h1}
            </h1>

            <div className="prose prose-invert prose-emerald max-w-none">
              <p className="text-gray-300 leading-relaxed text-base">
                {post.text}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <Link
                href="/blog"
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                &larr; Все статьи
              </Link>
            </div>
          </div>
        </article>

        <Footer />
        <FloatingCta />
      </main>
    </>
  );
}

