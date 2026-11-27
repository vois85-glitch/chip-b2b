// lib/seo/item-list-schema.ts — B2B ItemList schema generator
// Used on /catalog and /brand/[slug] pages.
// B2B pattern: NO price field, uses priceSpecification with eligibleQuantity.
// seller includes taxID for E-E-A-T trust signals.

export type ItemListProduct = {
  sku: string;
  name: string;
  brand: string;
  category?: string;
  description?: string;
  status?: string;
};

const BASE_URL = 'https://www.chip-net.ru';
const SELLER = {
  '@type': 'Organization' as const,
  name: 'ChipNet (ООО Деловой Партнёр)',
  taxID: '3123341983',
  url: BASE_URL,
};

/**
 * Build a B2B-compliant ItemList JSON-LD schema for a listing page.
 * Each item is a Product with mpn, brand, and Offer WITHOUT price field.
 * The Offer uses priceSpecification with eligibleQuantity (min 1 pc)
 * to signal "price-on-request" to search engines.
 */
export function itemListSchema(
  items: ItemListProduct[],
  listName: string,
  listUrl: string,
  totalItems?: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl,
    numberOfItems: totalItems ?? items.length,
    itemListElement: items.slice(0, 20).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: item.sku,
        mpn: item.sku,                   // Manufacturer Part Number
        sku: item.sku,
        description: item.description || item.name,
        category: item.category,
        brand: { '@type': 'Brand', name: item.brand },
        url: `${BASE_URL}/component/${encodeURIComponent(item.sku)}`,
        offers: {
          '@type': 'Offer',
          url: `${BASE_URL}/component/${encodeURIComponent(item.sku)}`,
          priceCurrency: 'RUB',
          // ✅ B2B: NO price field — price depends on order volume
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'RUB',
            eligibleQuantity: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              unitCode: 'C62',          // pieces
            },
          },
          availability: item.status === 'EOL'
            ? 'https://schema.org/Discontinued'
            : 'https://schema.org/BackOrder',
          itemCondition: 'https://schema.org/NewCondition',
          businessFunction: 'https://schema.org/Sell',
          seller: SELLER,
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'RU',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
          },
        },
      },
    })),
  };
}
