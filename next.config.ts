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

      // === Старые страницы → новые редиректы (301) ===
      // Информационные страницы, которые теперь секции на главной
      {
        source: "/kontakty",
        destination: "/#contacts",
        permanent: true,
      },
      {
        source: "/o-kompanii",
        destination: "/",
        permanent: true,
      },
      {
        source: "/kak-rabotaem",
        destination: "/",
        permanent: true,
      },

      // Старые категории → новые слаги
      {
        source: "/dc-dc-preobrazovateli",
        destination: "/pitaniya",
        permanent: true,
      },
      {
        source: "/esp32",
        destination: "/arm-kontrollery",
        permanent: true,
      },
      {
        source: "/intel",
        destination: "/altera",
        permanent: true,
      },

      // Возможные старые URL → актуальные
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
