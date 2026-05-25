import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import BrandsMarquee from '@/components/sections/BrandsMarquee';
import Advantages from '@/components/sections/Advantages';
import Catalog from '@/components/sections/Catalog';
import HardCases from '@/components/sections/HardCases';
import PriceList from '@/components/sections/PriceList';
import BomUpload from '@/components/sections/BomUpload';
import Industries from '@/components/sections/Industries';
import HowWeWork from '@/components/sections/HowWeWork';
import FAQ from '@/components/sections/FAQ';
import AboutCompany from '@/components/sections/AboutCompany';
import Contacts from '@/components/sections/Contacts';
import SeoText from '@/components/sections/SeoText';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <BrandsMarquee />
      <Advantages />
      <Catalog />
      <HardCases />
      <PriceList />
      <BomUpload />
      <Industries />
      <HowWeWork />
      <FAQ />
      <AboutCompany />
      <Contacts />
      <SeoText />
      <Footer />
      <FloatingCta />
    </main>
  );
}