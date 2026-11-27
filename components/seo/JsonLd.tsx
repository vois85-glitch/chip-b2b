"use client";

import { usePathname } from "next/navigation";

const BASE_URL = 'https://www.chip-net.ru';

/**
 * Organization and WebSite schema markup.
 * ONLY rendered on homepage to avoid duplicate structured data across all pages.
 * Search engines penalize repeated identical schemas - they should appear once.
 *
 * Schema type: ['Organization', 'LocalBusiness'] — LocalBusiness extends Organization
 * and validates geo, priceRange, openingHoursSpecification fields (Yandex requirement).
 */
export default function JsonLd() {
  const pathname = usePathname();

  // Only render Organization/WebSite schemas on homepage
  if (pathname !== "/") return null;

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
    '@id': `${BASE_URL}#organization`,
    name: 'ChipNet (ООО Деловой Партнёр)',
    alternateName: ['ChipNet', 'ООО Деловой Партнёр', 'Деловой Партнёр', 'ЧипНет'],
    legalName: 'ООО Деловой Партнёр',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/og-image.png`,
    description: 'Поставка оригинальных электронных компонентов для промышленности. Импортозамещение, подбор аналогов, проверка в лаборатории СВП.',
    slogan: 'Поставка электронных компонентов для промышленности',
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
    currenciesAccepted: 'RUB, USD, EUR',
    paymentAccepted: 'Безналичный расчёт, предоплата, постоплата',
    foundingDate: '2018',
    taxID: '3123341983',
    areaServed: [
      { '@type': 'Country', name: 'Россия' },
      { '@type': 'Country', name: 'Казахстан' },
      { '@type': 'Country', name: 'Беларусь' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    // External profiles — important for Yandex IKS calculation
    sameAs: [
      'https://yandex.ru/maps/org/chipnet',
    ],
    knowsAbout: [
      'Электронные компоненты',
      'Микросхемы',
      'FPGA',
      'Программируемая логика',
      'Микроконтроллеры',
      'Аналоговые компоненты',
      'Импортозамещение',
      'Подбор аналогов',
      'BOM-комплектация',
      'Проверка оригинальности',
      'СВП лаборатория',
      'Параллельный импорт',
      'Texas Instruments',
      'Analog Devices',
      'STMicroelectronics',
      'Xilinx',
      'Intel FPGA',
      'Lattice Semiconductor',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог электронных компонентов и услуг',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Микроконтроллеры ARM Cortex-M',
            category: 'Микроконтроллеры',
            brand: { '@type': 'Brand', name: 'STMicroelectronics' },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'ПЛИС (FPGA) Xilinx, Intel, Gowin',
            category: 'Программируемая логика',
            brand: { '@type': 'Brand', name: 'Xilinx' },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Силовые MOSFET и IGBT транзисторы',
            category: 'Силовая электроника',
            brand: { '@type': 'Brand', name: 'Infineon' },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Конденсаторы керамические и танталовые',
            category: 'Пассивные компоненты',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'АЦП и ЦАП высокой точности',
            category: 'Аналоговые компоненты',
            brand: { '@type': 'Brand', name: 'Analog Devices' },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'BOM-комплектация производств',
            serviceType: 'Комплектация по спецификации',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Подбор аналогов санкционных компонентов',
            serviceType: 'Инжиниринг',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Проверка оригинальности в лаборатории СВП',
            serviceType: 'Контроль качества',
          },
        },
      ],
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+7-910-321-91-91',
        contactType: 'sales',
        email: 'info@chip-net.ru',
        availableLanguage: ['Russian'],
        areaServed: 'RU',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+7-910-321-91-91',
        contactType: 'technical support',
        email: 'info@chip-net.ru',
        availableLanguage: ['Russian'],
      },
    ],
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}#website`,
    name: 'ChipNet',
    alternateName: 'ЧипНет',
    url: BASE_URL,
    inLanguage: 'ru-RU',
    publisher: { '@id': `${BASE_URL}#organization` },
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
