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
          "/datasheet/",
          "/geo/",
          "/catalog?*",
          "/*?search=",
          "/*?page=",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/compare/",
          "/datasheet/",
          "/geo/",
          "/*?search=",
        ],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/compare/",
          "/datasheet/",
          "/geo/",
          "/*?search=",
          "/*?page=",
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: "https://www.chip-net.ru/sitemap.xml",
    host: "https://www.chip-net.ru",
  };
}
