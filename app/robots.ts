import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/compare/",
        ],
        crawlDelay: 3,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/compare/",
        ],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/compare/",
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: "https://www.chip-net.ru/sitemap.xml",
    host: "https://www.chip-net.ru",
  };
}
