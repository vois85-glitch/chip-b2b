import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import BrandsGrid from '@/components/sections/BrandsMarquee'; // Имя файла то же, но экспорт другой
import Advantages from '@/components/sections/Advantages';
import Catalog from '@/components/sections/Catalog';
import Industries from '@/components/sections/Industries';
import HowWeWork from '@/components/sections/HowWeWork';
import Cases from '@/components/sections/Cases';
import BomUpload from '@/components/sections/BomUpload';
import FAQ from '@/components/sections/FAQ';
import AboutCompany from '@/components/sections/AboutCompany';
import Contacts from '@/components/sections/Contacts';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <BrandsGrid /> {/* <-- Заменили */}
      <Advantages />
      <Catalog />
      <Industries />
      <HowWeWork />
      <Cases />
      <BomUpload />
      <FAQ />
      <AboutCompany />
      <Contacts />
      <Footer />
      <FloatingCta />
    </main>
  );
}