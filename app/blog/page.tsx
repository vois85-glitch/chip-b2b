import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';
import { blogPosts } from '@/lib/blog-data';

const BASE_URL = 'https://www.chip-net.ru';

export const metadata: Metadata = {
  title: 'Блог компании ChipNet | Экспертиза в электронике',
  description: 'Статьи о проверке оригинальности микросхем, импортозамещении и логистике электронных компонентов.',
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: 'Блог ChipNet',
    description: 'Экспертиза в поставках электронных компонентов и импортозамещении.',
    url: `${BASE_URL}/blog`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050807] text-white">
      <Header />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Главная</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400">Блог</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Блог ChipNet
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mb-12">
            Делимся экспертизой в поставках электронных компонентов, импортозамещении и проверке оригинальности.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-gray-900/40 hover:bg-gray-800/50 border border-gray-800 hover:border-emerald-800/40 rounded-xl p-6 md:p-8 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-1 rounded-full bg-emerald-900/40 text-emerald-400 text-xs">
                  {post.category}
                </span>
                <span className="text-gray-600 text-xs">{post.date}</span>
              </div>
              <h2 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <FloatingCta />
    </main>
  );
}

