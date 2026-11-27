import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import ThemeProvider from "@/components/layout/ThemeProvider";
import JsonLd from "@/components/seo/JsonLd";
import Script from "next/script";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
 metadataBase: new URL("https://www.chip-net.ru"),
 title: {
 default: "ChipNet — Поставка оригинальных электронных компонентов | B2B Поставщик",
 template: "%s | ChipNet",
 },
 description:
 "Поставка электронных компонентов для промышленности: микросхемы, FPGA, микроконтроллеры. Подбор аналогов, BOM-комплектация. Проверка в СВП. Доставка от 6 дней.",
 alternates: {
 canonical: "https://www.chip-net.ru",
 },
 openGraph: {
 type: "website",
 locale: "ru_RU",
 url: "https://www.chip-net.ru",
 siteName: "ChipNet",
 title: "ChipNet — Поставка оригинальных электронных компонентов",
 description:
 "Поставщик оригинальных электронных компонентов для промышленности. Микросхемы, FPGA, микроконтроллеры, подбор аналогов, BOM-комплектация. Проверка в лаборатории СВП.",
 images: [
 {
 url: "/og-image.png",
 width: 1344,
 height: 768,
 alt: "ChipNet — Поставка электронных компонентов для промышленности",
 },
 ],
 },
 icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-120.png", sizes: "120x120", type: "image/png" },
    ],
    apple: "/logo.png",
  },
 robots: {
 index: true,
 follow: true,
 googleBot: {
 index: true,
 follow: true,
 'max-video-preview': -1,
 'max-image-preview': 'large',
 'max-snippet': -1,
 },
 },
 verification: {
 google: "JQOXPdz4QFDJ_b7ZXnrbDeu9hBvJHCXnbfF2kOBVpZE",
 yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
 },
 category: "Electronics Components B2B",
  twitter: {
    card: 'summary_large_image',
    title: 'ChipNet — Поставка оригинальных электронных компонентов',
    description: 'Микросхемы, FPGA, микроконтроллеры. Подбор аналогов, BOM-комплектация. Проверка в СВП. Доставка от 6 дней.',
    images: ['/og-image.png'],
  },
};

const YM_ID = 109105382;

// Explicit viewport — required for mobile browsers
// Without this, mobile browsers render at 980px width (desktop mode)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#059669',
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="ru">
      <head>
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="preload" as="image" href="/hero-illustration.webp" fetchPriority="high" />
        <meta name="theme-color" content="#059669" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
 <body className={inter.className}>
 <CartProvider>
 <Header />
 {children}
 <Footer />
 <FloatingCta />
 <CartDrawer />
 <JsonLd />

 {/* Schema.org Organization */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify({
 '@context': 'https://schema.org',
 '@type': 'Organization',
 name: 'ChipNet',
 legalName: 'ООО «Деловой Партнёр»',
 alternateName: 'Chip-Net',
 url: 'https://www.chip-net.ru',
 logo: 'https://www.chip-net.ru/logo.png',
 email: 'info@chip-net.ru',
 telephone: '+7-910-321-91-91',
 address: {
 '@type': 'PostalAddress',
 addressLocality: 'Белгород',
 addressRegion: 'Белгородская область',
 postalCode: '308033',
 streetAddress: 'ул. Шаландина, д. 4, к. 3, оф. 8',
 addressCountry: 'RU',
 },
 contactPoint: [{
 '@type': 'ContactPoint',
 telephone: '+7-910-321-91-91',
 contactType: 'sales',
 email: 'info@chip-net.ru',
 areaServed: 'RU',
 availableLanguage: ['Russian'],
 }],
 })
 }}
 />

 {/* Schema.org WebSite */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify({
 '@context': 'https://schema.org',
 '@type': 'WebSite',
 name: 'ChipNet',
 alternateName: 'Chip-Net',
 url: 'https://www.chip-net.ru',
 description: 'Каталог электронных компонентов: микросхемы, FPGA, микроконтроллеры. 52 000+ позиций. B2B-поставка с проверкой в СВП.',
 publisher: {
 '@type': 'Organization',
 name: 'ChipNet',
 url: 'https://www.chip-net.ru',
 },
 potentialAction: {
 '@type': 'SearchAction',
 target: {
 '@type': 'EntryPoint',
 urlTemplate: 'https://www.chip-net.ru/catalog?search={search_term_string}',
 },
 'query-input': 'required name=search_term_string',
 },
 })
 }}
 />

 {/* Яндекс.Метрика */}
 <Script id="yandex-metrika" strategy="lazyOnload">
 {`
 (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
 ym(${YM_ID}, "init", {
 clickmap:true,
 trackLinks:true,
 accurateTrackBounce:true,
 webvisor:true,
 ecommerce:"dataLayer"
 });
 `}
 </Script>
 <noscript>
 <div>
 <img
 src={`https://mc.yandex.ru/watch/${YM_ID}`}
 style={{ position: "absolute", left: "-9999px" }}
 alt=""
 />
 </div>
 </noscript>
 </CartProvider>
 </body>
 </html>
 );
}
