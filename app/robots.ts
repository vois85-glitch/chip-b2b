import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/api/", "/_next/"],
        crawlDelay: 5,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
        crawlDelay: 1,
      },
    ],
    sitemap: "https://www.chip-net.ru/sitemap.xml",
    host: "https://www.chip-net.ru",
  };
}

