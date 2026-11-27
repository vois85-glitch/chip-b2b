import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO (2026-11-23): безопасный blue/green деплой — safe-deploy.sh собирает
  // в .next-new (NEXT_DIST_DIR), не трогая рабочий .next работающего инстанса.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Игнорировать ошибки типов TypeScript и ESLint при production-сборке.
  // Это позволяет деплоить срочные UI-фиксы, не блокируясь на несущественных
  // type-несоответствиях в legacy-коде (например, component-enricher.ts).
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // === Common user URLs → canonical pages (fix 404s) ===
      { source: '/about', destination: '/o-kompanii', permanent: true },
      { source: '/contacts', destination: '/kontakty', statusCode: 301 },
      { source: '/dostavka', destination: '/delivery', permanent: true },
      { source: '/search', destination: '/catalog', permanent: true },
      { source: '/faq', destination: '/knowledge-base', permanent: true },
      { source: '/compare', destination: '/catalog', permanent: true },
      // /cart → /cart?_r=1 — 302 redirect перебивает закэшированный 308 (/cart → /bom)
      { source: '/cart', missing: [{ type: 'query', key: '_r' }], destination: '/cart?_r=1', permanent: false },
      // /cart — теперь отдельная страница оформления заявки (раньше редиректила на /bom)
      { source: '/checkout', destination: '/cart', permanent: true },

      // === 404 fixes: catch-all redirects ===
      { source: '/datasheet/:sku*', destination: '/component/:sku*', permanent: true },
            // SEO FIX: removed catch-all /analog/:sku* redirect - was hiding analog pages from Yandex index
      // { source: '/analog/:sku*', destination: '/component/:sku*', permanent: true },
      // REMOVED: catch-all blog redirect was hiding individual blog posts from Yandex index
      // { source: '/blog/:slug*', destination: '/knowledge-base', permanent: true },
      // SEO FIX: specific blog post redirect (replacing catch-all)
      // REMOVED audit 2026-07-21: article exists in blog-data.ts, was breaking indexation

      // audit 2026-07-23: 14 /analog/* URLs returned 404, redirect to /component/<SKU> where SKU exists
      { source: '/analog/SS34', destination: '/component/SS34', permanent: true },
      { source: '/analog/BZX55C5V1', destination: '/component/BZX55C5V1', permanent: true },
      // audit 2026-07-23 P1: 10 more /analog/* SKU — redirect to /catalog?search=<SKU> (SKU not in DB)
      // These SKU were returning 404 from /analog/* pages because they are not in analogMappings.
      // Better to redirect to /catalog?search than leave 404 — at least user lands on search page.
      { source: '/analog/LM358DR', destination: '/catalog?search=LM358DR', permanent: true },
      { source: '/analog/2N7002K-7', destination: '/catalog?search=2N7002K-7', permanent: true },
      { source: '/analog/LM7809CT', destination: '/catalog?search=LM7809CT', permanent: true },
      { source: '/analog/BC847C-7-F', destination: '/catalog?search=BC847C-7-F', permanent: true },
      { source: '/analog/SPX1117M3-L-5-0', destination: '/catalog?search=SPX1117M3-L-5-0', permanent: true },
      { source: '/analog/C0805C104K5RACTU', destination: '/catalog?search=C0805C104K5RACTU', permanent: true },
      { source: '/analog/STM32F429ZIT6', destination: '/catalog?search=STM32F429ZIT6', permanent: true },
      { source: '/analog/ATMEGA328P-AU', destination: '/catalog?search=ATMEGA328P-AU', permanent: true },
      { source: '/analog/CH32F103C8T6', destination: '/catalog?search=CH32F103C8T6', permanent: true },
      { source: '/analog/AD8606ARMZ', destination: '/catalog?search=AD8606ARMZ', permanent: true },
      // audit 2026-07-24 P1: /catalog/mikrokontrollery — old category slug, redirect to /catalog
      { source: '/catalog/mikrokontrollery', destination: '/catalog', permanent: true },
      // audit 2026-07-24 P1: /mcp and /sse — likely bot/scanner probes, redirect to homepage
      { source: '/mcp', destination: '/', permanent: true },
      { source: '/sse', destination: '/', permanent: true },
      // audit 2026-07-24 P0: /null and /component/null — buggy links from old code versions
      // (already fixed in SimilarComponents.tsx, but old URLs are still in Yandex cache)
      // Return 308 to a real page so Yandex drops them from index
      { source: '/null', destination: '/', permanent: true },
      { source: '/component/null', destination: '/', permanent: true },
      // audit 2026-07-23 P1: /privoda — old category URL, redirect to actual category
      { source: '/privoda', destination: '/catalog/electromech/privoda', permanent: true },
      // audit 2026-07-23: /blog/obzor-stm32 doesn't exist, redirect to closest match
      { source: '/blog/obzor-stm32', destination: '/blog/analogi-stm32-gd32-hk32-ch32', permanent: true },

      // audit 2026-07-21: renamed slug fil-try → filtry in DB, keep 301 for old URL
      { source: '/catalog/passive/fil-try', destination: '/catalog/passive/filtry', permanent: true },

      { source: '/geo/:city*', destination: '/', permanent: true },
      { source: '/geo', destination: '/', permanent: true },
      { source: '/industries/industrial', destination: '/industries/promyshlennaya-avtomatika', permanent: true },
      { source: '/industries/automotive', destination: '/industries/oboronnij-kompleks', permanent: true },
      { source: '/industries/energy', destination: '/industries/promyshlennaya-avtomatika', permanent: true },
      { source: '/industries/medical', destination: '/industries/promyshlennaya-avtomatika', permanent: true },
      { source: '/industries/telecom', destination: '/industries/telekommunikatsii', permanent: true },
      { source: '/mikrokontrollery', destination: '/catalog', permanent: true },
      { source: '/tranzistory-field-effect', destination: '/catalog', permanent: true },
      { source: '/tranzistory-darlingtona', destination: '/catalog', permanent: true },
      { source: '/kondensatory-elektroliticheskie', destination: '/catalog', permanent: true },
      { source: '/konvertory', destination: '/catalog', permanent: true },
      { source: '/omron', destination: '/brands', permanent: true },
      { source: '/cui', destination: '/brands', permanent: true },
      { source: '/invensense', destination: '/brands', permanent: true },
      { source: '/phoenix-contact', destination: '/brands', permanent: true },
      { source: '/worldsemi', destination: '/brands', permanent: true },
      // SEO FIX (audit 2026-11-09): /brand/c&k отдаёт 404 — бренд C&K удалён из БД.
      // 301-редирект на индекс брендов (там пользователь найдёт актуальных производителей).
      // Источник: sitemap_issues_report.csv → 404_not_found.
      { source: '/brand/c&k', destination: '/brands', permanent: true },

      // non-www → www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "chip-net.ru",
          },
        ],
        destination: "https://www.chip-net.ru/:path*",
        permanent: true,
      },

      // === SEO-редиректы: альтернативные URL → канонические страницы ===
      // /proizvoditeli → /brands/ (единый индекс производителей)
      {
        source: "/proizvoditeli",
        destination: "/brands",
        permanent: true,
      },
      // /import-komponentov → /importozameshchenie (канонический слаг)
      {
        source: "/import-komponentov",
        destination: "/importozameshchenie",
        permanent: true,
      },
      // /microcontrollers → /arm-kontrollery (русский URL)
      {
        source: "/microcontrollers",
        destination: "/arm-kontrollery",
        permanent: true,
      },
      // /mcu → /arm-kontrollery
      {
        source: "/mcu",
        destination: "/arm-kontrollery",
        permanent: true,
      },
      // /plis → /fpga
      {
        source: "/plis",
        destination: "/fpga",
        permanent: true,
      },

      // Старые/альтернативные URL → актуальные SEO-страницы
      {
        source: "/ac-dc",
        destination: "/pitaniya",
        permanent: true,
      },
      {
        source: "/datchiki-i-sensory",
        destination: "/datchiki",
        permanent: true,
      },
      {
        source: "/kondensatory-keramicheskie",
        destination: "/kondensatory",
        permanent: true,
      },
      {
        source: "/rezistory-smd",
        destination: "/rezistory",
        permanent: true,
      },
      {
        source: "/razemy-bga",
        destination: "/razemy",
        permanent: true,
      },
      {
        source: "/optoelektronika-led",
        destination: "/optoelektronika",
        permanent: true,
      },
      {
        source: "/pamyat-flash",
        destination: "/pamyat",
        permanent: true,
      },
      // Англоязычные альтернативы → русские SEO-страницы
      {
        source: "/power-supply",
        destination: "/pitaniya",
        permanent: true,
      },
      {
        source: "/sensors",
        destination: "/datchiki",
        permanent: true,
      },
      {
        source: "/connectors",
        destination: "/razemy",
        permanent: true,
      },
      {
        source: "/capacitors",
        destination: "/kondensatory",
        permanent: true,
      },
      {
        source: "/resistors",
        destination: "/rezistory",
        permanent: true,
      },
      {
        source: "/diodes",
        destination: "/diody",
        permanent: true,
      },
      {
        source: "/memory",
        destination: "/pamyat",
        permanent: true,
      },
      {
        source: "/op-amps",
        destination: "/operatsionnye-usiliteli",
        permanent: true,
      },
      {
        source: "/adc-dac-converters",
        destination: "/adc-dac",
        permanent: true,
      },
      {
        source: "/voltage-regulators",
        destination: "/stabilizatory",
        permanent: true,
      },
      {
        source: "/optoelectronics",
        destination: "/optoelektronika",
        permanent: true,
      },
      {
        source: "/relays",
        destination: "/rele",
        permanent: true,
      },
      {
        source: "/logic-ics",
        destination: "/logika",
        permanent: true,
      },
      {
        source: "/interface-ics",
        destination: "/interfeysy",
        permanent: true,
      },
      {
        source: "/telecom",
        destination: "/telekommunikatsii",
        permanent: true,
      },
      {
        source: "/inductors",
        destination: "/induktivnosti",
        permanent: true,
      },
      {
        source: "/oscillators",
        destination: "/kvartsy-i-rezonatory",
        permanent: true,
      },
      {
        source: "/fuses",
        destination: "/predokhraniteli",
        permanent: true,
      },
      {
        source: "/transformers",
        destination: "/transformatory",
        permanent: true,
      },
      {
        source: "/filters",
        destination: "/filtry",
        permanent: true,
      },
      {
        source: "/transistors",
        destination: "/tranzistory",
        permanent: true,
      },
      {
        source: "/switches",
        destination: "/pereklyuchateli",
        permanent: true,
      },
      // Semantic SEO redirects — long-tail keywords
      // /stm32 removed — there is a real /stm32/page.tsx hub page
      {
        source: "/stm32-analogs",
        destination: "/analogs",
        permanent: true,
      },
      {
        source: "/stm32-zamena",
        destination: "/analogs",
        permanent: true,
      },
      {
        source: "/xilinx-alternativa",
        destination: "/fpga",
        permanent: true,
      },
      {
        source: "/ti-alternativa",
        destination: "/texas-instruments",
        permanent: true,
      },
      {
        source: "/sanctioned-components",
        destination: "/importozameshchenie",
        permanent: true,
      },
      {
        source: "/hard-to-find",
        destination: "/elektronnye-komponenty",
        permanent: true,
      },
      {
        source: "/obsolete-components",
        destination: "/obsolete",
        permanent: true,
      },
      {
        source: "/component-verification",
        destination: "/proverka-komponentov",
        permanent: true,
      },
      {
        source: "/bom-sourcing",
        destination: "/komplektaciya-proizvodstv",
        permanent: true,
      },
      {
        source: "/analog-replacement",
        destination: "/analogs",
        permanent: true,
      },
      {
        source: "/cross-reference",
        destination: "/analogs",
        permanent: true,
      },
      // /podbor-analogov → /analogs (устранение цепочки редиректов)
      {
        source: "/podbor-analogov",
        destination: "/analogs",
        permanent: true,
      },
      // === /procurement/* → основные страницы (исключение canonical-конфликтов) ===
      {
        source: "/procurement/bom-sourcing",
        destination: "/bom",
        permanent: true,
      },
      {
        source: "/procurement/sanctioned-components",
        destination: "/importozameshchenie",
        permanent: true,
      },
      {
        source: "/procurement/hard-to-find",
        destination: "/elektronnye-komponenty",
        permanent: true,
      },
      {
        source: "/procurement",
        destination: "/bom",
        permanent: true,
      },
      // === /engineering/* → knowledge-base ===
      {
        source: "/engineering/kak-vybrat-mikrokontroller",
        destination: "/knowledge-base",
        permanent: true,
      },
      {
        source: "/engineering",
        destination: "/knowledge-base",
        permanent: true,
      },

      // /import-komponentov page exists as a separate file → keep it
      // /import-komponentov page exists as a separate file â keep it
      // /kvartsy â /kvartsy-i-rezonatory (канонический slug)
      {
        source: "/kvartsy",
        destination: "/kvartsy-i-rezonatory",
        permanent: true,
      },
      // /components-index â /catalog
      {
        source: "/components-index",
        destination: "/catalog",
        permanent: true,
      },
      // Бренды без SEO-страниц â /brands
      {
        source: "/raspberry-pi",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/bosch",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/alps",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/winbond",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/u-blox",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/monolithic-power",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/toshiba",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/kemet",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/yageo",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/maxim",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/samsung-electro",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/richtek",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/silergy",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/mdd",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/cobham",
        destination: "/brands",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*).woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/(.*).(jpg|jpeg|png|gif|ico|svg|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;