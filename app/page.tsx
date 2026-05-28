import Hero from '@/components/sections/Hero';
import BrandsMarquee from '@/components/sections/BrandsMarquee';
import AboutCompany from '@/components/sections/AboutCompany';
import Advantages from '@/components/sections/Advantages';
import BomUpload from '@/components/sections/BomUpload';
import RfqSection from '@/components/sections/RfqSection';
import PopularCategories from '@/components/sections/PopularCategories';
import BrandsShowcase from '@/components/sections/BrandsShowcase';
import FAQ from '@/components/sections/FAQ';
import CtaBlock from '@/components/sections/CtaBlock';

const faqLd = {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: [
 {
 '@type': 'Question',
 name: 'Как вы проверяете оригинальность компонентов?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Мы работаем с проверенными поставщиками и используем процедуры supplier verification и контроля происхождения продукции. Каждый компонент проходит входной контроль для подтверждения подлинности и соответствия спецификации.',
 },
 },
 {
 '@type': 'Question',
 name: 'Можно ли подобрать аналог unavailable компонента?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Да. Мы помогаем находить совместимые replacement-решения для unavailable и obsolete компонентов. Наши инженеры подбирают аналоги с учётом электрических параметров, типа корпуса и условий применения.',
 },
 },
 {
 '@type': 'Question',
 name: 'Работаете ли вы с BOM-комплектацией?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Да. Мы закрываем спецификации для контрактных производств, OEM и инженерных проектов. От единичных позиций до комплексных BOM для серийного производства.',
 },
 },
 {
 '@type': 'Question',
 name: 'Откуда осуществляется поставка?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Основные направления поставок — Европа и Азия. Мы работаем с авторизованными дистрибьюторами и заводами-изготовителями из Китая, Тайваня, Южной Кореи, Германии и других стран.',
 },
 },
 {
 '@type': 'Question',
 name: 'Какие сроки поставки?',
 acceptedAnswer: {
 '@type': 'Answer',
 text: 'Средний срок поставки начинается от 6 дней и зависит от категории компонентов и доступности. Для срочных заказов возможна приоритетная обработка и ускоренная авиадоставка.',
 },
 },
 ],
};

export default function Home() {
 return (
 <main className="relative mt-0">
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
 />
 <Hero />
 <BrandsMarquee />
 <AboutCompany />
 <Advantages />
 <BomUpload />
 <RfqSection />
 <PopularCategories />
 <BrandsShowcase />
 <FAQ />
 <CtaBlock />
 </main>
 );
}
