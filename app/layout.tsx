import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';
import JsonLd from '@/components/seo/JsonLd';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.chip-net.ru'),
  title: {
    default: "ChipNet — Поставка оригинальных электронных компонентов | B2B",
    template: "%s | ChipNet",
  },
  description: "Оптовые поставки микросхем, FPGA, микроконтроллеров и разъемов для промышленности и ВПК. Импортозамещение, подбор аналогов, доставка от 6 дней. ООО Деловой Партнёр, Белгород.",
  keywords: ["электронные компоненты", "микросхемы", "поставка чипов", "B2B электроника", "аналоги санкционных компонентов", "FPGA", "микроконтроллеры оптом", "импортозамещение"],
  alternates: {
    canonical: "https://www.chip-net.ru",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://www.chip-net.ru",
    siteName: "ChipNet",
    title: "ChipNet — Поставка оригинальных электронных компонентов",
    description: "Оптовые поставки микросхем, FPGA, микроконтроллеров для промышленности и ВПК. Импортозамещение, подбор аналогов.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={inter.className}>
        <Header />
        <div className="pt-20">
          {children}
        </div>
        <Footer />
        <FloatingCta />
        <JsonLd />

        {/* Яндекс.Метрика */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(109105382, "init", {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>

      </body>
    </html>
  );
}
