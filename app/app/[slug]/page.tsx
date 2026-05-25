import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import BrandsMarquee from '@/components/sections/BrandsMarquee';
import StatsBar from '@/components/sections/StatsBar';
import ComponentSearch from '@/components/sections/ComponentSearch';
import PopularCategories from '@/components/sections/PopularCategories'; // Новое!
import Advantages from '@/components/sections/Advantages';
import QualityControl from '@/components/sections/QualityControl';
import HardCases from '@/components/sections/HardCases';
import LogisticsDetails from '@/components/sections/LogisticsDetails'; // Новое!
import Testimonials from '@/components/sections/Testimonials';
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
      <StatsBar />
      <ComponentSearch />
      <PopularCategories />     {/* Каталог направлений */}
      <Advantages />
      <QualityControl />
      <HardCases />
      <LogisticsDetails />      {/* Логистика и ВЭД */}
      <Testimonials />
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