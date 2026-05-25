import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ChipNet — Поставка оригинальных электронных компонентов | B2B",
  description: "Оптовые поставки микросхем, FPGA, микроконтроллеров и разъемов для промышленности и ВПК. Импортозамещение, подбор аналогов, доставка от 6 дней. ООО Деловой Партнёр, Белгород.",
  keywords: ["электронные компоненты", "микросхемы", "поставка чипов", "B2B электроника", "аналоги санкционных компонентов", "FPGA", "микроконтроллеры оптом", "импортозамещение"],
  openGraph: {
    title: "ChipNet — Поставка электронных компонентов от 6 дней",
    description: "Оригинальные микросхемы и промышленная автоматика. Работаем с ВПК и НИИ.",
    url: "https://chip-net.ru",
    siteName: "ChipNet",
    locale: "ru_RU",
    type: "website",
  },
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