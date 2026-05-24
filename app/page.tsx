import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Catalog from '@/components/sections/Catalog';
import BomUpload from '@/components/sections/BomUpload';
import Advantages from '@/components/sections/Advantages';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta'; // <-- Добавили

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Catalog />
      <BomUpload />
      <Advantages />
      <Footer />
      <FloatingCta /> {/* <-- Вставили в самый конец */}
    </main>
  );
}