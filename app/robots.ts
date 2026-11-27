import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Yandex",
        allow: [
          "/",
          "/catalog?*page=",
          "/catalog/page/",
          "/datasheet/",
          "/geo/",
          "/component/",
          "/blog/",
          "/analog/",
          "/knowledge-base/",
        ],
        disallow: [          "/api/",
          "/_next/",
          "/compare/",
          "/catalog?*sort=",
          "/catalog?*capacity=",
          "/catalog?*resistance=",
          "/catalog?*voltage=",
          "/catalog?*price=",
          "/catalog?*in_stock=",
          "/*?utm_",
          "/*?yclid=",
          "/*?gclid=",
          "/*?fbclid=",
        ],
        // Crawl-delay убран — ускоряет индексацию 50k URL
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [          "/api/",
          "/_next/",
          "/compare/",
          "/catalog?*sort=",
          "/catalog?*capacity=",
          "/catalog?*resistance=",
          "/catalog?*voltage=",
          "/catalog?*price=",
          "/catalog?*in_stock=",
          "/*?utm_",
          "/*?yclid=",
          "/*?gclid=",
        ],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/compare/", "/*?utm_", "/*?yclid=", "/*?gclid=", "/*?fbclid="],
      },
    ],
    sitemap: "https://www.chip-net.ru/sitemap.xml",
    // Host: удалён — Yandex не поддерживает с марта 2018
  };
}
