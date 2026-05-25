export default function JsonLd() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ChipNet (ООО Деловой Партнёр)",
    "alternateName": "ChipNet",
    "url": "https://chip-net.ru",
    "description": "Поставка оригинальных электронных компонентов и промышленного оборудования для ВПК и производства.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Шаландина, дом 4, корпус 3, офис 8",
      "addressLocality": "Белгород",
      "postalCode": "308033",
      "addressCountry": "RU"
    },
    "telephone": "+7-910-321-91-91",
    "email": "vois85@yandex.ru",
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}