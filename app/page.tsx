import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Catalog from '@/components/sections/Catalog';
import Advantages from '@/components/sections/Advantages';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Catalog />
      <Advantages />
      <Footer />
    </main>
  );
}