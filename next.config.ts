import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
      {
        source: "/stm32",
        destination: "/arm-kontrollery",
        permanent: true,
      },
      {
        source: "/stm32-analogs",
        destination: "/podbor-analogov",
        permanent: true,
      },
      {
        source: "/stm32-zamena",
        destination: "/podbor-analogov",
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
        destination: "/podbor-analogov",
        permanent: true,
      },
      {
        source: "/cross-reference",
        destination: "/podbor-analogov",
        permanent: true,
      },
      // Brand alternate slugs
      {
        source: "/brand/stm",
        destination: "/brand/stmicroelectronics",
        permanent: true,
      },
      {
        source: "/brand/ti",
        destination: "/brand/texas-instruments",
        permanent: true,
      },
      {
        source: "/brand/adi",
        destination: "/brand/analog-devices",
        permanent: true,
      },
      {
        source: "/brand/microchip-technology",
        destination: "/brand/microchip",
        permanent: true,
      },
      {
        source: "/brand/on-semiconductor",
        destination: "/brand/onsemi",
        permanent: true,
      },
      {
        source: "/brand/wurth",
        destination: "/brand/wurth-elektronik",
        permanent: true,
      },
      {
        source: "/brand/diodes",
        destination: "/brand/diodes-inc",
        permanent: true,
      },
      {
        source: "/brand/aimtec",
        destination: "/brand/aimtec",
        permanent: true,
      },
      // /import-komponentov page exists as a separate file → keep it
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
    ];
  },
};

export default nextConfig;
