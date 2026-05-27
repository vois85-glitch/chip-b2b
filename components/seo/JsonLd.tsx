const BASE_URL = 'https://www.chip-net.ru';

export default function JsonLd() {
  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ChipNet (ООО Деловой Партнёр)',
    alternateName: ['ChipNet', 'ООО Деловой Партнёр', 'Деловой Партнёр'],
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-image.png`,
    description: 'Поставка оригинальных электронных компонентов и промышленного оборудования для ВПК и производства.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Шаландина, дом 4, корпус 3, офис 8',
      addressLocality: 'Белгород',
      postalCode: '308033',
      addressRegion: 'Белгородская область',
      addressCountry: 'RU',
    },
    telephone: '+7-910-321-91-91',
    email: 'info@chip-net.ru',
    priceRange: '20421',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [],
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ChipNet',
    url: BASE_URL,
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

