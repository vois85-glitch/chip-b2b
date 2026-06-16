"use client";

import { usePathname } from "next/navigation";

const BASE_URL = 'https://www.chip-net.ru';

/**
 * Organization and WebSite schema markup.
 * ONLY rendered on homepage to avoid duplicate structured data across all pages.
 * Search engines penalize repeated identical schemas - they should appear once.
 */
export default function JsonLd() {
  const pathname = usePathname();

  // Only render Organization/WebSite schemas on homepage
  if (pathname !== "/") return null;

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ChipNet (ООО Деловой Партнёр)',
    alternateName: ['ChipNet', 'ООО Деловой Партнёр', 'Деловой Партнёр', 'ЧипНет'],
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-image.png`,
    description: 'Поставка оригинальных электронных компонентов для промышленности. Импортозамещение, подбор аналогов, проверка в лаборатории СВП.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Шаландина, дом 4, корпус 3, офис 8',
      addressLocality: 'Белгород',
      postalCode: '308033',
      addressRegion: 'Белгородская область',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '50.5960',
      longitude: '36.5870',
    },
    telephone: '+7-910-321-91-91',
    email: 'info@chip-net.ru',
    priceRange: '$$',
    foundingDate: '2018',
    taxID: '3123341983',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [],
    knowsAbout: [
      'Электронные компоненты',
      'Микросхемы',
      'FPGA',
      'Микроконтроллеры',
      'Импортозамещение',
      'Подбор аналогов',
      'BOM-комплектация',
      'Проверка оригинальности',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог электронных компонентов',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'Микроконтроллеры ARM' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'ПЛИС (FPGA)' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'Транзисторы MOSFET/IGBT' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'Конденсаторы' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'АЦП/ЦАП' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'Датчики' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'Разъёмы' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Category', name: 'Источники питания' } },
      ],
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-910-321-91-91',
      contactType: 'sales',
      availableLanguage: ['Russian'],
      areaServed: 'RU',
    },
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ChipNet',
    alternateName: 'ЧипНет',
    url: BASE_URL,
    inLanguage: 'ru-RU',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/catalog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
    </>
  );
}
