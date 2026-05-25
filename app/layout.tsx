import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ChipNet — Поставка оригинальных электронных компонентов | B2B",
  description: "Оптовые поставки микросхем, FPGA, микроконтроллеров и разъемов для промышленности и ВПК. Импортозамещение, подбор аналогиов, доставка от 6 дней. ООО Деловой Партнёр, Белгород.",
  keywords: ["электронные компоненты", "микросхемы", "поставка чипов", "B2B электроника", "аналоги санкционных компонентов", "FPGA", "микроконтроллеры оптом", "импортозамещение"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={inter.className}>
        <JsonLd />
        <Header />
        {/* pt-20 нужен, чтобы фиксированная шапка не закрывала контент */}
        <div className="pt-20"> 
          {children}
        </div>
        <Footer />
        <FloatingCta />
      </body>
    </html>
  );
}