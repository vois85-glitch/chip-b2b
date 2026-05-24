import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Загружаем правильный технологичный шрифт с кириллицей
const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ChipNet — Поставка электронных компонентов",
  description: "B2B поставка оригинальных электронных компонентов от 6 дней",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}