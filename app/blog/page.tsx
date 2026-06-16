import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';

const BASE_URL = 'https://www.chip-net.ru';
export const revalidate = 86400;

export const metadata: Metadata = {
 title: 'Блог | Экспертиза в электронике',
 description: 'Статьи о проверке оригинальности микросхем, импортозамещении и логистике электронных компонентов.',
 alternates: {
 canonical: `${BASE_URL}/blog`,
 },
 openGraph: {
 title: 'Блог компании',
 description: 'Экспертиза в поставках электронных компонентов и импортозамещении.',
 url: `${BASE_URL}/blog`,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
};

export default function BlogPage() {
 return (
 <main className="min-h-screen bg-background text-[#121212]">

 <section className="pt-32 pb-16 px-4">
 <div className="max-w-4xl mx-auto">
 <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2">
 <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
 <span className="text-[#898989]">/</span>
 <span className="text-[#666]">Блог</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 Блог ChipNet
 </h1>
 <p className="text-lg text-[#666] max-w-2xl mb-12">
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
 className="block bg-[#e0e8de] hover:bg-[#dce6da] border border-[#e8e8e8] hover:border-emerald-800/40 rounded-xl p-6 md:p-8 transition-all group"
 >
 <div className="flex items-center gap-3 mb-3">
 <span className="px-2 py-1 rounded-full bg-emerald-900/40 text-primary text-xs">
 {post.category}
 </span>
 <span className="text-[#898989] text-xs">{post.date}</span>
 </div>
 <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
 {post.title}
 </h2>
 <p className="text-[#666] text-sm line-clamp-2">
 {post.description}
 </p>
 </Link>
 ))}
 </div>
 </section>
 </main>
 );
}

