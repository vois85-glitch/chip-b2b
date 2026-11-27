import { Metadata } from 'next';
import { blogPosts, getBlogPost } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
const BASE_URL = 'https://www.chip-net.ru';
export const revalidate = 86400;

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
 <main className="min-h-screen bg-background text-[#121212]">

 <article className="pt-[180px] pb-16 px-4">
 <div className="max-w-3xl mx-auto">
 <BreadcrumbNav
        className="mb-6"
        items=[{"        { name: 'Главная', href: '/' },\n        { name: 'Блог', href: '/blog' },\n        { name: '{post.title}' }"}]
      />

 <div className="flex items-center gap-3 mb-6">
 <span className="px-2 py-1 rounded-full bg-emerald-900/40 text-primary text-xs">
 {post.category}
 </span>
 <time className="text-[#898989] text-xs">{post.date}</time>
 </div>

 <h1 className="text-3xl md:text-4xl font-bold mb-8">
 {post.h1}
 </h1>

 <div className="prose prose-invert prose-emerald max-w-none">
 <p className="text-[#333] leading-relaxed text-base">
 {post.text}
 </p>
 </div>

 {post.sections && post.sections.length > 0 && (
 <div className="mt-12 space-y-10">
 {post.sections.map((sec, i) => (
 <section key={i}>
 <h2 className="text-2xl font-bold mb-4 text-[#121212]">{sec.h2}</h2>
 <p className="text-[#333] leading-relaxed text-base">{sec.p}</p>
 </section>
 ))}
 </div>
 )}

 {post.faq && post.faq.length > 0 && (
 <section className="mt-12">
 <h2 className="text-2xl font-bold mb-6 text-[#121212]">Часто задаваемые вопросы</h2>
 <div className="space-y-4">
 {post.faq.map((item, i) => (
 <details key={i} className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] overflow-hidden">
 <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#eaf0e8] transition-colors">
 <span className="font-semibold text-[#121212] pr-4">{item.q}</span>
 <svg className="w-5 h-5 text-[#757575] group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </summary>
 <div className="px-5 pb-5 text-[#666] leading-relaxed">{item.a}</div>
 </details>
 ))}
 </div>
 </section>
 )}

 <div className="mt-12 pt-8 border-t border-[#e8e8e8]">
 <Link prefetch={false}
 href="/blog"
 className="text-primary hover:text-primary-dark text-sm transition-colors"
 >
 &larr; Все статьи
 </Link>
 </div>
 </div>
 </article>
 </main>
 </>
 );
}

