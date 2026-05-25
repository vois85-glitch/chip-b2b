import Hero from '@/components/sections/Hero';
import BrandsMarquee from '@/components/sections/BrandsMarquee';
import StatsBar from '@/components/sections/StatsBar';
import ComponentSearch from '@/components/sections/ComponentSearch';
import PopularCategories from '@/components/sections/PopularCategories';
import Advantages from '@/components/sections/Advantages';
import QualityControl from '@/components/sections/QualityControl';
import HardCases from '@/components/sections/HardCases';
import LogisticsDetails from '@/components/sections/LogisticsDetails';
import Testimonials from '@/components/sections/Testimonials';
import PriceList from '@/components/sections/PriceList';
import BomUpload from '@/components/sections/BomUpload';
import Industries from '@/components/sections/Industries';
import HowWeWork from '@/components/sections/HowWeWork';
import FAQ from '@/components/sections/FAQ';
import AboutCompany from '@/components/sections/AboutCompany';
import Contacts from '@/components/sections/Contacts';
import SeoText from '@/components/sections/SeoText';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <BrandsMarquee />
      <StatsBar />
      <ComponentSearch />
      <PopularCategories />
      <Advantages />
      <QualityControl />
      <HardCases />
      <LogisticsDetails />
      <Testimonials />
      <PriceList />
      <BomUpload />
      <Industries />
      <HowWeWork />
      <FAQ />
      <AboutCompany />
      <Contacts />
      <SeoText />
    </main>
  );
}