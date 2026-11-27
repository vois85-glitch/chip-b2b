#!/usr/bin/env python3
"""
Upload updated chip-net.ru files to server via SSH.
Changes color scheme from dark emerald to light teal (chipget.ru style).
"""

import paramiko
import os
import sys

HOST = '45.155.52.105'
USER = 'root'
KEY = '/home/z/.ssh/id_ed25519'
REMOTE_BASE = '/var/www/chip-net'
LOCAL_DIR = '/home/z/my-project/download/chipnet-update'

def get_ssh():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, key_filename=KEY, timeout=15)
    return ssh

def upload_file(ssh, local_path, remote_path):
    sftp = ssh.open_sftp()
    sftp.put(local_path, remote_path)
    sftp.close()
    print(f'  ✓ Uploaded: {remote_path}')

def write_remote_file(ssh, remote_path, content):
    sftp = ssh.open_sftp()
    with sftp.file(remote_path, 'w') as f:
        f.write(content)
    sftp.close()
    print(f'  ✓ Written: {remote_path}')

def run_command(ssh, cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(f'  OUT: {out[:500]}')
    if err:
        print(f'  ERR: {err[:500]}')
    return out, err

def main():
    print('=== Connecting to server ===')
    ssh = get_ssh()
    print('Connected!')

    # ===== 1. globals.css =====
    print('\n--- Updating globals.css ---')
    globals_css = r'''@import "tailwindcss";

@theme {
  --color-background: #fafafa;
  --color-foreground: #121212;
  --color-card: #ffffff;
  --color-primary: #02a391;
  --color-primary-dark: #028a7a;
  --color-primary-light: #03b8a4;
  --color-section: #f3f3f3;
  --color-section-alt: #dee9e1;
  --color-section-accent: #cfded4;
  --color-section-green: #bbd3ba;
  --color-border: #e8e8e8;
  --color-border-dark: #cbcbcb;
  --color-muted: #757575;
  --color-dark: #303033;
  --color-danger: #ff3a3a;
  --font-sans: 'Inter', sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f3f3f3; }
::-webkit-scrollbar-thumb { background: #cbcbcb; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #999; }

@keyframes brands-marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-brands-marquee {
  animation: brands-marquee 35s linear infinite;
}

.marquee-container-new:hover .animate-brands-marquee {
  animation-play-state: paused;
}

.brand-logo-item {
  transition: all 0.3s ease;
  text-decoration: none;
}

.brand-logo-item:hover {
  transform: scale(1.05);
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/app/globals.css', globals_css)

    # ===== 2. layout.tsx =====
    print('\n--- Updating layout.tsx ---')
    layout_tsx = r'''import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';
import JsonLd from '@/components/seo/JsonLd';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.chip-net.ru'),
  title: {
    default: "ChipNet — Поставка оригинальных электронных компонентов | B2B",
    template: "%s | ChipNet",
  },
  description: "Оптовые поставки микросхем, FPGA, микроконтроллеров и разъемов для промышленности и ВПК. Импортозамещение, подбор аналогов, доставка от 6 дней. ООО Деловой Партнёр, Белгород.",
  keywords: ["электронные компоненты", "микросхемы", "поставка чипов", "B2B электроника", "аналоги санкционных компонентов", "FPGA", "микроконтроллеры оптом", "импортозамещение"],
  alternates: {
    canonical: "https://www.chip-net.ru",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://www.chip-net.ru",
    siteName: "ChipNet",
    title: "ChipNet — Поставка оригинальных электронных компонентов",
    description: "Оптовые поставки микросхем, FPGA, микроконтроллеров для промышленности и ВПК. Импортозамещение, подбор аналогов.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Header />
        <div className="pt-20">
          {children}
        </div>
        <Footer />
        <FloatingCta />
        <JsonLd />

        {/* Яндекс.Метрика */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(109105382, "init", {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>

      </body>
    </html>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/app/layout.tsx', layout_tsx)

    # ===== 3. Header.tsx =====
    print('\n--- Updating Header.tsx ---')
    header_tsx = r''''use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Каталог', href: '/catalog', hash: false },
    { label: 'Поиск', href: '/#search', hash: true, sectionId: 'search' },
    { label: 'Загрузить BOM', href: '/#bom', hash: true, sectionId: 'bom' },
    { label: 'О компании', href: '/#about', hash: true, sectionId: 'about' },
    { label: 'Контакты', href: '/#contacts', hash: true, sectionId: 'contacts' },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-white/80 backdrop-blur-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 text-primary group-hover:text-primary-dark transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#121212] group-hover:text-primary transition-colors">
            Chip<span className="text-primary group-hover:text-primary-dark transition-colors">Net</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#666]">
          {navLinks.map((link) => (
            link.hash && isHome ? (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.sectionId!)}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`hover:text-primary transition-colors ${pathname === link.href ? 'text-primary' : ''}`}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link href="/catalog" className="hidden sm:inline-flex bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25">
            Получить КП
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 rounded-lg hover:bg-[#f3f3f3] transition-colors"
            aria-label="Меню"
          >
            <span className={`block w-5 h-0.5 bg-[#333] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#333] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#333] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-t border-[#e8e8e8]"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                link.hash && isHome ? (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.sectionId!)}
                    className="w-full text-left px-4 py-3 rounded-lg text-[#333] hover:text-primary hover:bg-[#f3f3f3] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-lg text-[#333] hover:text-primary hover:bg-[#f3f3f3] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Link
                href="/catalog"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-lg text-sm font-semibold transition-all"
              >
                Получить КП
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/layout/Header.tsx', header_tsx)

    # ===== 4. Footer.tsx =====
    print('\n--- Updating Footer.tsx ---')
    footer_tsx = r'''import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-section-accent border-t border-[#bbd3ba]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Колонка 1: Логотип */}
          <div>
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-8 h-8 text-primary group-hover:text-primary-dark transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="23"></line>
                  <line x1="15" y1="20" x2="15" y2="23"></line>
                  <line x1="20" y1="9" x2="23" y2="9"></line>
                  <line x1="20" y1="14" x2="23" y2="14"></line>
                  <line x1="1" y1="9" x2="4" y2="9"></line>
                  <line x1="1" y1="14" x2="4" y2="14"></line>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#121212] group-hover:text-primary transition-colors">
                Chip<span className="text-primary group-hover:text-primary-dark transition-colors">Net</span>
              </span>
            </Link>
            <p className="text-sm text-[#666] leading-relaxed mt-4 ml-1">
              Поставка оригинальных электронных компонентов и промышленного оборудования для ВПК и производства.
            </p>
          </div>

          {/* Колонка 2: Навигация */}
          <div>
            <h4 className="font-semibold mb-4 text-[#121212]">Навигация</h4>
            <div className="flex flex-col gap-2 text-sm text-[#666]">
              <a href="#search" className="hover:text-primary transition-colors">Поиск компонентов</a>
              <a href="#bom" className="hover:text-primary transition-colors">Загрузить BOM</a>
              <a href="#about" className="hover:text-primary transition-colors">О компании</a>
              <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
            </div>
          </div>

          {/* Колонка 3: Контакты */}
          <div>
            <h4 className="font-semibold mb-4 text-[#121212]">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm text-[#666]">
              <a href="tel:+79103219191" className="hover:text-primary transition-colors">+7 (910) 321-91-91</a>
              <a href="mailto:vois85@yandex.ru" className="hover:text-primary transition-colors">vois85@yandex.ru</a>
              <span>г. Белгород, ул. Шаландина, 4 к3 оф8</span>
            </div>
          </div>
        </div>

        {/* Юридическая строка */}
        <div className="border-t border-[#bbd3ba] pt-6 text-xs text-[#757575] text-center md:text-left flex flex-col md:flex-row justify-between gap-4">
          <div>
            © {new Date().getFullYear()} ООО «Деловой Партнёр». Все права защищены. ИНН 3123341983, ОГРН 1143123005838
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#333]">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/layout/Footer.tsx', footer_tsx)

    # ===== 5. FloatingCta.tsx =====
    print('\n--- Updating FloatingCta.tsx ---')
    floating_cta = r''''use client';

import { motion } from 'framer-motion';

export default function FloatingCta() {
  return (
    <motion.a 
      href="#bom"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.3 }}
      className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-primary-dark text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all group"
      title="Оставить заявку"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </motion.a>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/layout/FloatingCta.tsx', floating_cta)

    # ===== 6. Hero.tsx =====
    print('\n--- Updating Hero.tsx ---')
    hero_tsx = r''''use client';

import { motion } from 'framer-motion';

const FloatingChip = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div 
    className={`absolute text-primary/8 pointer-events-none ${className}`}
    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line>
      <line x1="15" y1="1" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="23"></line>
      <line x1="15" y1="20" x2="15" y2="23"></line>
      <line x1="20" y1="9" x2="23" y2="9"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="1" y1="9" x2="4" y2="9"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
    </svg>
  </motion.div>
);

const FloatingCPU = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div 
    className={`absolute text-primary/8 pointer-events-none ${className}`}
    animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect>
      <line x1="7" y1="1" x2="7" y2="4"></line>
      <line x1="10" y1="1" x2="10" y2="4"></line>
      <line x1="14" y1="1" x2="14" y2="4"></line>
      <line x1="17" y1="1" x2="17" y2="4"></line>
      <line x1="7" y1="20" x2="7" y2="23"></line>
      <line x1="10" y1="20" x2="10" y2="23"></line>
      <line x1="14" y1="20" x2="14" y2="23"></line>
      <line x1="17" y1="20" x2="17" y2="23"></line>
      <line x1="20" y1="7" x2="23" y2="7"></line>
      <line x1="20" y1="10" x2="23" y2="10"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="20" y1="17" x2="23" y2="17"></line>
      <line x1="1" y1="7" x2="4" y2="7"></line>
      <line x1="1" y1="10" x2="4" y2="10"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
      <line x1="1" y1="17" x2="4" y2="17"></line>
    </svg>
  </motion.div>
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-section-alt">
      {/* Subtle decorative blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[200px] opacity-[0.07] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-section-accent rounded-full blur-[180px] opacity-30 pointer-events-none" />
      
      {/* Floating chip decorations */}
      <FloatingChip className="hidden lg:block top-1/4 left-[10%] w-48 h-48" delay={0} />
      <FloatingCPU className="hidden lg:block bottom-1/4 right-[10%] w-40 h-40" delay={1.5} />
      <FloatingChip className="hidden md:block top-[15%] right-[25%] w-24 h-24 opacity-50" delay={3} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[#bbd3ba] rounded-full bg-white/70 backdrop-blur-md text-sm text-primary"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Работаем с импортозамещением и санкционными компонентами
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 text-[#121212]"
        >
          Поставка оригинальных <br className="hidden md:block" />
          <span className="text-primary">электронных компонентов</span> <br className="hidden md:block" />
          от 6 дней
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-[#666] max-w-2xl mx-auto mb-10"
        >
          Гарантия оригинала. Постоплата для постоянных клиентов. 
          Подбор аналогов для unavailable позиций. Доставка из Европы и Азии.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#bom" className="px-8 py-4 bg-primary hover:bg-primary-dark rounded-xl text-lg font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white text-center">
            Получить КП за 2 часа
          </a>
          <a href="#bom" className="px-8 py-4 bg-white hover:bg-section border border-[#e8e8e8] rounded-xl text-lg font-semibold backdrop-blur-md transition-all text-[#121212] text-center shadow-sm">
            Загрузить BOM
          </a>
        </motion.div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/Hero.tsx', hero_tsx)

    # ===== 7. BrandsMarquee.tsx =====
    print('\n--- Updating BrandsMarquee.tsx ---')
    brands_tsx = r'''export default function BrandsMarquee() {
  const brands = [
    { name: 'NXP', logo: '/brands/nxp.svg', href: '/nxp' },
    { name: 'Infineon', logo: '/brands/infineon.svg', href: '/infineon' },
    { name: 'STMicroelectronics', logo: '/brands/stmicro.svg', href: '/stmicroelectronics' },
    { name: 'Renesas', logo: '/brands/renesas.svg', href: '/renesas' },
    { name: 'onsemi', logo: '/brands/onsemi.svg', href: '/onsemi' },
    { name: 'Vishay', logo: '/brands/vishay.svg', href: '/vishay' },
    { name: 'Murata', logo: '/brands/murata.svg', href: '/murata' },
    { name: 'Xilinx', logo: '/brands/xilinx.svg', href: '/xilinx' },
    { name: 'Analog Devices', logo: '/brands/analog-devices.svg', href: '/analog-devices' },
    { name: 'Texas Instruments', logo: '/brands/texas-instruments.svg', href: '/texas-instruments' },
    { name: 'Microchip', logo: '/brands/microchip.svg', href: '/microchip' },
    { name: 'Altera', logo: '/brands/altera.svg', href: '/altera' },
    { name: 'Lattice', logo: '/brands/lattice.svg', href: '/lattice' },
    { name: 'Nordic', logo: '/brands/nordic.svg', href: '/nordic' },
    { name: 'Micron', logo: '/brands/micron.svg', href: '/micron' },
    { name: 'GigaDevice', logo: '/brands/gigadevice.svg', href: '/gigadevice' },
    { name: 'TDK', logo: '/brands/tdk.svg', href: '/tdk' },
    { name: 'Würth Elektronik', logo: '/brands/wurth.svg', href: '/wurth-elektronik' },
    { name: 'Diodes Inc', logo: '/brands/diodes-inc.svg', href: '/diodes-inc' },
    { name: 'Fujitsu', logo: '/brands/fujitsu.svg', href: '/fujitsu' },
  ];

  const renderBrand = (brand: typeof brands[0], index: number) => (
    <a
      key={index}
      href={brand.href}
      className="brand-logo-item flex-shrink-0 flex items-center justify-center cursor-pointer group"
      style={{ width: '200px', height: '80px' }}
    >
      <img
        src={brand.logo}
        alt={brand.name}
        className="max-w-[180px] max-h-[64px] object-contain transition-all duration-300 group-hover:scale-110"
        loading="lazy"
      />
    </a>
  );

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden marquee-container-new">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold text-[#121212] tracking-wide">
          Официальные поставки от мировых производителей
        </h2>
        <p className="text-[#757575] text-sm mt-2">Более 50 брендов в каталоге</p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-brands-marquee">
          {brands.map(renderBrand)}
          {brands.map(renderBrand)}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/BrandsMarquee.tsx', brands_tsx)

    # ===== 8. StatsBar.tsx =====
    print('\n--- Updating StatsBar.tsx ---')
    stats_tsx = r''''use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '6+', label: 'Лет на рынке' },
  { value: '24ч', label: 'Ответ на заявку' },
  { value: '100%', label: 'Гарантия оригинала' },
  { value: '500+', label: 'Выполненных заказов' },
];

export default function StatsBar() {
  return (
    <section className="py-16 px-4 bg-section-accent border-y border-[#bbd3ba]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-[#666] text-sm md:text-base uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/StatsBar.tsx', stats_tsx)

    # ===== 9. ComponentSearch.tsx =====
    print('\n--- Updating ComponentSearch.tsx ---')
    search_tsx = r''''use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComponentSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const bomSection = document.getElementById('bom');
      if (bomSection) {
        bomSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const textarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
          if (textarea) {
            textarea.value = `Требуется подбор/проверка наличия:\n${searchQuery}`;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, 500);
      }
    }
  };

  return (
    <section id="search" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Поиск компонентов</h2>
          <p className="text-[#666] text-lg mb-10">Введите артикул (part number), и мы проверим наличие, подберем аналог или организуем поставку под заказ</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Например: STM32F103C8T6 или LM7805"
              className="flex-grow bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-6 py-4 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors text-lg"
            />
            <button 
              type="submit" 
              className="px-8 py-4 bg-primary hover:bg-primary-dark rounded-xl text-lg font-semibold transition-all shadow-lg shadow-primary/25 whitespace-nowrap text-white"
            >
              Найти / Запросить
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-[#757575]">
            <span>Часто ищут:</span>
            <button onClick={() => setSearchQuery('XC3S200A')} className="hover:text-primary transition-colors">XC3S200A (FPGA)</button>
            <button onClick={() => setSearchQuery('SN74HC595N')} className="hover:text-primary transition-colors">SN74HC595N</button>
            <button onClick={() => setSearchQuery('ATMEGA328P')} className="hover:text-primary transition-colors">ATMEGA328P</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/ComponentSearch.tsx', search_tsx)

    # ===== 10. PopularCategories.tsx =====
    print('\n--- Updating PopularCategories.tsx ---')
    categories_tsx = r'''import Link from 'next/link';

const categories = [
  { title: 'Микросхемы', desc: 'Драйверы, контроллеры, генераторы, специализированные ИС.', href: '/mikroshemy', icon: '🔌' },
  { title: 'Микроконтроллеры', desc: 'ARM Cortex-M, AVR, PIC. Подбор аналогов снятых с производства серий.', href: '/arm-kontrollery', icon: '🧠' },
  { title: 'ПЛИС (FPGA)', desc: 'Xilinx, Intel/Altera, Lattice. Кросс-референс и поставка.', href: '/fpga', icon: '🔲' },
  { title: 'Транзисторы', desc: 'MOSFET, IGBT, биполярные. Силовые ключи для автоматики.', href: '/tranzistory', icon: '⚡' },
  { title: 'Диоды', desc: 'Шоттки, стабилитроны, выпрямительные мосты, TVS.', href: '/diody', icon: '🔴' },
  { title: 'Конденсаторы', desc: 'Керамика, электролиты, тантал от Murata, TDK, KEMET.', href: '/kondensatory', icon: '🔋' },
  { title: 'Резисторы', desc: 'SMD, выводные, подстроечные от Yageo, Bourns, Vishay.', href: '/rezistory', icon: '📏' },
  { title: 'Разъёмы', desc: 'Molex, JST, Amphenol, TE, Phoenix Contact.', href: '/razemy', icon: '🔗' },
  { title: 'Модули и платы', desc: 'Raspberry Pi, Arduino, беспроводные модули, IoT.', href: '/moduli-i-platy', icon: '💻' },
  { title: 'Датчики', desc: 'MEMS, IMU, температуры, давления, Холла.', href: '/datchiki', icon: '📡' },
  { title: 'Питание', desc: 'AC/DC, DC/DC преобразователи, LDO стабилизаторы.', href: '/pitaniya', icon: '🔋' },
  { title: 'Оптоэлектроника', desc: 'Светодиоды, оптроны, дисплеи, фотодиоды.', href: '/optoelektronika', icon: '💡' },
];

export default function PopularCategories() {
  return (
    <section className="py-24 px-4 bg-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Каталог направлений</h2>
          <p className="text-[#666] text-lg">Работаем со всеми типами компонентов. Выберите категорию или откройте полный каталог.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={`/catalog?category=${encodeURIComponent(cat.title)}`}
              className="group block bg-white border border-[#e8e8e8] rounded-2xl p-6 hover:bg-section-alt hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-[#121212] group-hover:text-primary transition-colors">{cat.title}</h3>
              <p className="text-[#757575] text-sm leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark rounded-xl font-bold text-white transition-colors text-lg shadow-sm"
          >
            Все 2600+ компонентов
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/PopularCategories.tsx', categories_tsx)

    # ===== 11-18. Remaining sections =====
    # Advantages
    print('\n--- Updating Advantages.tsx ---')
    advantages_tsx = r''''use client';

import { motion } from 'framer-motion';

const advantages = [
  { title: '100% Оригинал', desc: 'Строгий контроль качества и проверка в собственной лаборатории', icon: '🛡️' },
  { title: 'Поставки от 6 дней', desc: 'Оперативная логистика из Китая, Тайваня, США и Европы', icon: '🚀' },
  { title: 'Инженерная поддержка', desc: 'Подбор аналогов и кросс-референсов для санкционных компонентов', icon: '⚙️' },
  { title: 'Постоплата', desc: 'Гибкие условия для постоянных B2B клиентов', icon: '💼' },
];

export default function Advantages() {
  return (
    <section className="py-24 px-4 bg-section-alt border-y border-[#bbd3ba]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Почему выбирают нас</h2>
          <p className="text-[#666] text-lg">Работаем с оборонными, промышленными и инженерными компаниями</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, index) => (
            <motion.div 
              key={adv.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="text-5xl mb-6">{adv.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-[#121212]">{adv.title}</h3>
              <p className="text-[#666] leading-relaxed">{adv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/Advantages.tsx', advantages_tsx)

    # QualityControl
    print('\n--- Updating QualityControl.tsx ---')
    quality_tsx = r''''use client';

import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Визуальный осмотр', desc: 'Проверка маркировки, корпуса, выводов и следов пайки под микроскопом.' },
  { step: '02', title: 'Электрический тест', desc: 'Измерение электрических параметров по даташиту на стенде.' },
  { step: '03', title: 'Рентген / Декапсуляция', desc: 'Вскрытие корпуса или рентген для подтверждения кристалла (по требованию).' },
  { step: '04', title: 'Документация', desc: 'Предоставление сертификатов соответствия и протоколов проверки.' },
];

export default function QualityControl() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Собственная лаборатория СВП</h2>
          <p className="text-[#666] text-lg max-w-2xl mx-auto">
            Защищаем ваше производство от контрафакта. Каждый компонент проходит входной контроль.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-[#e8e8e8] rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-6xl font-bold text-primary/10 absolute top-2 right-4 group-hover:text-primary/20 transition-colors">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#121212] relative z-10">{item.title}</h3>
              <p className="text-[#666] text-sm relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/QualityControl.tsx', quality_tsx)

    # HardCases
    print('\n--- Updating HardCases.tsx ---')
    cases_tsx = r''''use client';

import { motion } from 'framer-motion';

const cases = [
  {
    problem: 'Компоненты попали под санкции, производство встало',
    solution: 'Нашли азиатские аналоги с полной совместимостью по даташиту, провели тестирование, запустили производство за 10 дней.',
    tag: 'Импортозамещение'
  },
  {
    problem: 'Срочно нужна партия FPGA для оборонного контракта',
    solution: 'Организовали цепочку поставки через ОАЭ, оформили документацию, доставили под заказ за 6 дней.',
    tag: 'Срочная логистика'
  },
  {
    problem: 'Закупщик нашел чипы на 30% дешевле рынка в интернете',
    solution: 'Провели экспертизу — выявили контрафакт. Поставили клиента на прямые поставки от Ti/ST, защитили от брака.',
    tag: 'Контроль качества'
  },
];

export default function HardCases() {
  return (
    <section className="py-24 px-4 bg-section relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Решаем нестандартные задачи</h2>
          <p className="text-[#666] text-lg">Где другие отказывают — мы находим решение</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((c, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white border border-[#e8e8e8] rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-semibold text-primary bg-section-alt px-3 py-1 rounded-full self-start mb-6">
                {c.tag}
              </span>
              <div className="mb-6 flex-grow">
                <h3 className="text-lg font-bold mb-2 text-[#333] flex items-start gap-2">
                  <span className="text-danger text-xl mt-0.5 shrink-0">&#9888;</span> 
                  <span>Проблема:</span> 
                </h3>
                <p className="text-[#666] text-sm mb-6 ml-8">{c.problem}</p>
                
                <h3 className="text-lg font-bold mb-2 text-[#333] flex items-start gap-2">
                  <span className="text-primary text-xl mt-0.5 shrink-0">&#10003;</span> 
                  <span>Решение ChipNet:</span>
                </h3>
                <p className="text-[#666] text-sm ml-8">{c.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/HardCases.tsx', cases_tsx)

    # LogisticsDetails
    print('\n--- Updating LogisticsDetails.tsx ---')
    logistics_tsx = r''''use client';

import { motion } from 'framer-motion';

const details = [
  {
    title: 'Таможенное оформление (ВЭД)',
    text: 'Берем на себя все хлопоты по растаможке. Ввоз по кодам ЕТН ВЭД, оформление сертификатов соответствия и отказных писем. Клиент получает груз на складе в РФ со всеми документами.'
  },
  {
    title: 'Сложные схемы оплаты',
    text: 'Работаем с контрагентами из ОАЭ, Турции, Китая и Тайваня. Принимаем рубли и валюту. Для постоянных клиентов — постоплата по договору.'
  },
  {
    title: 'Защита от санкций',
    text: 'Вносим компоненты в импортозамещающие перечни Минпромторга. Подбираем полные аналоги (cross-reference) по электрическим параметрам и корпусам для отсутствующих позиций.'
  },
  {
    title: 'Страхование груза',
    text: 'Все отправления застрахованы. В случае потери или повреждения на таможне или в пути — компенсация 100% стоимости партии.'
  },
];

export default function LogisticsDetails() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Импорт и логистика без рисков</h2>
          <p className="text-[#666] text-lg max-w-2xl mx-auto">
            Поставка электронных компонентов — это не просто покупка. Это сложный процесс ВЭД, где мы берем все риски на себя.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {details.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-[#e8e8e8] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">{item.title}</h3>
              <p className="text-[#666] leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/LogisticsDetails.tsx', logistics_tsx)

    # Testimonials
    print('\n--- Updating Testimonials.tsx ---')
    testimonials_tsx = r''''use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Искали редкие ПЛИС для оборонного контракта. ChipNet нашли аналоги и доставили за неделю. Спасли запуск серии.",
    name: "Алексей В.",
    role: "Ведущий инженер, НИИ РЭТ"
  },
  {
    quote: "Работаем по постоплате уже второй год. Всегда честные сроки, ни разу не прислали восстановленных чипов под видом новых.",
    name: "Ирина С.",
    role: "Руководитель закупок, Завод Промэлектроника"
  },
  {
    quote: "Организовали сложную логистику из Тайваня, когда обычные каналы закрылись. Профессионалы своего дела.",
    name: "Дмитрий К.",
    role: "Директор по производству, ТехноСофт"
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 bg-section-alt">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Нам доверяют</h2>
          <p className="text-[#666] text-lg">Отзывы инженеров и руководителей закупок</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white border border-[#e8e8e8] rounded-2xl p-8 shadow-sm"
            >
              <svg className="w-8 h-8 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-[#333] mb-6 leading-relaxed italic">{t.quote}</p>
              <div>
                <p className="text-[#121212] font-semibold">{t.name}</p>
                <p className="text-[#757575] text-sm">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/Testimonials.tsx', testimonials_tsx)

    # PriceList
    print('\n--- Updating PriceList.tsx ---')
    pricelist_tsx = r''''use client';

import { motion } from 'framer-motion';

export default function PriceList() {
  return (
    <section className="py-24 px-4 bg-section border-y border-[#e8e8e8]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#121212]">Нет времени искать?</h2>
          <p className="text-[#666] text-lg mb-10 max-w-2xl mx-auto">
            Отправьте нам список нужных компонентов (BOM-лист), и мы сами найдем лучшие цены, проверим наличие на складах и выставим коммерческое предложение.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-semibold text-lg mb-2 text-[#121212]">Загрузите BOM</h3>
              <p className="text-[#666] text-sm">Excel, CSV или PDF — примем в любом удобном для вас формате</p>
            </div>
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg mb-2 text-[#121212]">Мы ищем и проверяем</h3>
              <p className="text-[#666] text-sm">Подберем оригиналы или аналоги, проверим в лаборатории СВП</p>
            </div>
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-lg mb-2 text-[#121212]">Получите КП</h3>
              <p className="text-[#666] text-sm">Коммерческое предложение с актуальными ценами и сроками поставки</p>
            </div>
          </div>

          <a href="#bom" className="inline-block px-10 py-5 bg-primary hover:bg-primary-dark rounded-xl text-xl font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white">
            Отправить заявку на расчет
          </a>
        </motion.div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/PriceList.tsx', pricelist_tsx)

    # BomUpload
    print('\n--- Updating BomUpload.tsx ---')
    bom_tsx = r''''use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { submitRequest } from '@/app/actions/request-action';

export default function BomUpload() {
  const [fileName, setFileName] = useState('');
  
  const [state, formAction, isPending] = useActionState(submitRequest, { success: false, message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="bom" className="py-24 px-4 bg-section-alt relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Запрос коммерческого предложения</h2>
          <p className="text-[#666] text-lg">Загрузите ваш BOM-лист (Excel/CSV) или опишите необходимые компоненты</p>
        </div>

        <motion.form 
          action={formAction}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-[#e8e8e8] rounded-3xl p-8 md:p-12 shadow-lg"
        >
          {state.message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-8 px-6 py-4 rounded-xl text-center text-lg font-semibold ${
                state.success ? 'bg-section-alt border border-primary/30 text-primary' : 'bg-red-50 border border-danger/30 text-danger'
              }`}
            >
              {state.message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">Компания</label>
              <input 
                type="text" 
                name="company_name"
                required
                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-4 py-3 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="ООО Инжиниринг"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">ИНН</label>
              <input 
                type="text" 
                name="inn"
                required
                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-4 py-3 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="7712345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-4 py-3 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="info@company.ru"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">Телефон</label>
              <input 
                type="tel" 
                name="phone"
                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-4 py-3 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#333] mb-2">Список компонентов или комментарий</label>
            <textarea 
              name="message"
              rows={4}
              className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-4 py-3 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
              placeholder="STM32F103C8T6 - 500 шт, LM7805CT - 200 шт..."
            />
          </div>

          <input type="hidden" name="bom_file_name" value={fileName} />

          <div className="mb-8">
            <label className="block text-sm font-medium text-[#333] mb-2">Прикрепить BOM-лист (Excel, CSV, PDF)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#cbcbcb] rounded-2xl cursor-pointer hover:bg-section-alt hover:border-primary/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <p className="mb-1 text-sm text-[#666]">
                    {fileName ? <span className="font-semibold text-primary">{fileName}</span> : <span>Перетащите файл сюда или <span className="text-primary underline">выберите</span></span>}
                  </p>
                  <p className="text-xs text-[#757575]">XLSX, CSV, PDF (MAX. 10MB)</p>
                </div>
                <input type="file" className="hidden" accept=".xlsx,.csv,.pdf,.xls" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all shadow-lg duration-300 text-white ${
              isPending ? 'bg-primary/60 cursor-wait' : 'bg-primary hover:bg-primary-dark shadow-primary/25 hover:shadow-primary/40'
            }`}
          >
            {isPending ? 'Отправка...' : 'Получить предложение'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/BomUpload.tsx', bom_tsx)

    # Industries
    print('\n--- Updating Industries.tsx ---')
    industries_tsx = r''''use client';

import { motion } from 'framer-motion';

const industries = [
  { title: 'Оборонно-промышленный комплекс', desc: 'Поставка санкционных компонентов и аналогов для ВПК', icon: '🛡️' },
  { title: 'Промышленность', desc: 'Автоматизация производств, ПЛК, датчики и приводная техника', icon: '🏭' },
  { title: 'Научные институты (НИИ)', desc: 'Обеспечение опытных образцов и мелких серий уникальными чипами', icon: '🔬' },
  { title: 'Производство электроники', desc: 'Комплектующие для серийного и массового производства плат', icon: '💻' },
  { title: 'Энергетика', desc: 'Силовые модули, реле и блоки питания для энергосистем', icon: '⚡' },
  { title: 'Телекоммуникации', desc: 'RF-компоненты, трансиверы и оборудование связи', icon: '📡' },
];

export default function Industries() {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Сферы применения</h2>
          <p className="text-[#666] text-lg">Обеспечиваем компонентами самые требовательные отрасли</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, index) => (
            <motion.div 
              key={ind.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex gap-5 p-6 bg-white border border-[#e8e8e8] rounded-2xl hover:bg-section-alt hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              <div className="text-4xl">{ind.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#121212] group-hover:text-primary transition-colors">{ind.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{ind.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/Industries.tsx', industries_tsx)

    # HowWeWork
    print('\n--- Updating HowWeWork.tsx ---')
    how_tsx = r''''use client';

import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Заявка', desc: 'Вы оставляете заявку на сайте или загружаете BOM-лист', icon: '📝' },
  { step: '02', title: 'Подбор', desc: 'Находим компоненты у проверенных поставщиков по всему миру', icon: '🔍' },
  { step: '03', title: 'Проверка', desc: 'Контроль качества и оригинальности в собственной лаборатории', icon: '🛡️' },
  { step: '04', title: 'Доставка', desc: 'Оперативная логистика от 6 дней с таможенным оформлением', icon: '🚀' },
  { step: '05', title: 'Гарантия', desc: 'Гарантия оригинальности, постоплата и документация', icon: '✅' },
];

export default function HowWeWork() {
  return (
    <section className="py-24 px-4 bg-section relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Как мы работаем</h2>
          <p className="text-[#666] text-lg">Прозрачный процесс от заявки до поставки на ваше производство</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

          {steps.map((item, index) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center z-10"
            >
              <div className="w-24 h-24 bg-white border-2 border-primary/40 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-primary/5">
                {item.icon}
              </div>
              <div className="text-primary font-bold text-sm mb-2">Шаг {item.step}</div>
              <h3 className="text-xl font-bold mb-2 text-[#121212]">{item.title}</h3>
              <p className="text-[#666] text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/HowWeWork.tsx', how_tsx)

    # FAQ
    print('\n--- Updating FAQ.tsx ---')
    faq_tsx = r''''use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Как вы гарантируете оригинальность компонентов?',
    a: 'Мы работаем только с авторизованными дистрибьюторами и заводами-производителями. Все партии проходят входной контроль в собственной лаборатории СВП (рентген, декапсуляция, электрическое тестирование).'
  },
  {
    q: 'Работаете ли вы с физическими лицами?',
    a: 'Нет, мы специализируемся исключительно на B2B-рынке. Мы работаем с юридическими лицами (ООО, АО) и ИП по договору поставки с закрывающими документами.'
  },
  {
    q: 'Какие условия оплаты?',
    a: 'Для постоянных клиентов действует постоплата (отсрочка платежа до 30 дней). Для новых клиентов — предоплата 50% или 100% в зависимости от суммы заказа и редкости компонентов.'
  },
  {
    q: 'За сколько времени вы даете коммерческое предложение?',
    a: 'Стандартный прайс-лист мы присылаем в течение 1-2 часов. Заявки на редкие или санкционные компоненты, требующие поиска аналогов, обрабатываются в течение 24 часов.'
  },
  {
    q: 'Что если компонент попадет под санкции после оплаты?',
    a: 'В случае невозможности поставки мы возвращаем средства в полном объеме в течение 3 рабочих дней, либо бесплатно подбираем функциональный аналог из доступных.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Частые вопросы</h2>
          <p className="text-[#666] text-lg">Отвечаем на главные опасения инженеров и закупщиков</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-[#e8e8e8] rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-section transition-colors"
              >
                <span className="text-lg font-semibold text-[#333] pr-4">{faq.q}</span>
                <span className={`text-primary text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e8e8] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/FAQ.tsx', faq_tsx)

    # AboutCompany
    print('\n--- Updating AboutCompany.tsx ---')
    about_tsx = r''''use client';

import { motion } from 'framer-motion';

export default function AboutCompany() {
  return (
    <section id="about" className="py-24 px-4 bg-section-alt relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#121212]">
              Надежный партнер для <span className="text-primary">промышленности</span> и <span className="text-primary">ВПК</span>
            </h2>
            <p className="text-[#666] text-lg mb-6 leading-relaxed">
              ChipNet — это команда инженеров и логистов, которые решают самые сложные задачи по поставке электронных компонентов. Мы работаем напрямую с заводами-производителями и авторизованными дистрибьюторами из Китая, Тайваня, США и Европы.
            </p>
            <p className="text-[#666] text-lg leading-relaxed">
              В условиях санкций мы обеспечиваем непрерывность вашего производства: подбираем аналоги, организуем сложную логистику и гарантируем 100% оригинальность каждой детали.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">6+</div>
              <div className="text-[#333]">Дней срок поставки</div>
            </div>
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-[#333]">Гарантия оригинала</div>
            </div>
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">4+</div>
              <div className="text-[#333]">Региона поставок</div>
            </div>
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">СВП</div>
              <div className="text-[#333]">Собственная лаборатория</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/AboutCompany.tsx', about_tsx)

    # Contacts
    print('\n--- Updating Contacts.tsx ---')
    contacts_tsx = r'''export default function Contacts() {
  return (
    <section id="contacts" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212]">Контакты</h2>
          <p className="text-[#666] text-lg">Свяжитесь с нами для обсуждения вашего проекта</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-section-alt rounded-xl flex items-center justify-center text-2xl shrink-0">📞</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#121212]">Телефон</h3>
                <a href="tel:+79103219191" className="text-[#666] hover:text-primary transition-colors block">+7 (910) 321-91-91</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-section-alt rounded-xl flex items-center justify-center text-2xl shrink-0">📧</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#121212]">Email</h3>
                <a href="mailto:vois85@yandex.ru" className="text-primary hover:text-primary-dark transition-colors block">vois85@yandex.ru</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-section-alt rounded-xl flex items-center justify-center text-2xl shrink-0">📍</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#121212]">Офис (Юридический и фактический)</h3>
                <p className="text-[#666]">308033, г. Белгород, ул. Шаландина, дом 4, корпус 3, офис 8</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-section-alt rounded-xl flex items-center justify-center text-2xl shrink-0">⏱️</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#121212]">Режим работы</h3>
                <p className="text-[#666]">Пн-Пт: 9:00 - 18:00 (МСК)</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e8e8e8] rounded-3xl overflow-hidden h-[400px] relative shadow-sm">
            <iframe 
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A3e4f8e9dd1c4b1b1a4d0c7f8e9dd1c4b1b1a4d0c7f8e9dd1c4b1b1a4d0c7&source=constructor&z=16&text=Белгород%2C%20Шаландина%204%20к3" 
              width="100%" 
              height="100%" 
              frameBorder="0"
              title="Офис ООО Деловой Партнёр"
            ></iframe>
          </div>
        </div>

        <div className="mt-12 bg-section-alt border border-[#bbd3ba] rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6 text-primary">Реквизиты компании</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[#333] text-sm">
            <p><span className="text-[#757575]">Полное наименование:</span> ООО «Деловой Партнёр»</p>
            <p><span className="text-[#757575]">ИНН / КПП:</span> 3123341983 / 312301001</p>
            <p><span className="text-[#757575]">ОГРН:</span> 1143123005838</p>
            <p><span className="text-[#757575]">Юридический адрес:</span> 308033, г. Белгород, ул. Шаландина, дом 4, корпус 3, офис 8</p>
          </div>
        </div>

      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/Contacts.tsx', contacts_tsx)

    # SeoText
    print('\n--- Updating SeoText.tsx ---')
    seo_tsx = r'''export default function SeoText() {
  return (
    <section className="py-24 px-4 bg-section border-t border-[#e8e8e8]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#121212]">
          Надежный поставщик электронных компонентов для промышленности
        </h2>
        <div className="text-[#666] leading-relaxed space-y-4 text-sm md:text-base">
          <p>
            Компания <strong className="text-[#121212]">ООО «Деловой Партнёр» (ChipNet)</strong> — это прямой поставщик оригинальных электронных компонентов и промышленной автоматики. Мы специализируемся на обеспечении предприятий ВПК, НИИ и производств радиоэлектронной аппаратуры критически важными комплектующими.
          </p>
          <p>
            В условиях санкций и разрыва цепочек поставок мы предлагаем комплексные решения по <strong className="text-[#121212]">импортозамещению</strong>: от подбора точных аналогов (кросс-референс) для unavailable позиций до организации сложной логистики из Китая, Тайваня, США и Европы. Сроки поставки — от 6 рабочих дней.
          </p>
          <p>
            В нашем каталоге представлены микросхемы (FPGA, микроконтроллеры, процессоры), разъемы, блоки питания, датчики и пассивные компоненты от ведущих мировых производителей: Texas Instruments, STMicroelectronics, NXP, Xilinx, Microchip и других. Вся продукция проходит входной контроль качества и сопровождается документацией.
          </p>
          <p>
            Мы работаем по договору поставки с постоплатой для постоянных клиентов. Чтобы получить коммерческое предложение, загрузите ваш BOM-лист (список компонентов) на сайте или свяжитесь с нашими инженерами.
          </p>
        </div>
      </div>
    </section>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/SeoText.tsx', seo_tsx)

    # ===== 19. Catalog page.tsx =====
    print('\n--- Updating catalog/page.tsx ---')
    catalog_page = r'''import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import CatalogClient from './CatalogClient';

const BASE_URL = 'https://www.chip-net.ru';

export const metadata: Metadata = {
  title: 'Каталог электронных компонентов — ChipNet | Микросхемы, транзисторы, ПЛИС, разъёмы',
  description: 'Каталог электронных компонентов: микросхемы, микроконтроллеры, ПЛИС, транзисторы, диоды, конденсаторы, резисторы, разъёмы. Более 2600 наименований от 70+ производителей. Проверка в лаборатории СВП.',
  alternates: { canonical: `${BASE_URL}/catalog` },
  openGraph: {
    title: 'Каталог электронных компонентов — ChipNet',
    description: 'Более 2600 наименований электронных компонентов от 70+ производителей.',
    url: `${BASE_URL}/catalog`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const ITEMS_PER_PAGE = 48;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params.page || '1')));
  const category = String(params.category || '');
  const brand = String(params.brand || '');
  const search = String(params.search || '');

  let query = supabase.from('components').select('*', { count: 'exact' });

  if (category) {
    query = query.eq('category', category);
  }
  if (brand) {
    query = query.eq('brand', brand);
  }
  if (search) {
    query = query.or(`sku.ilike.%${search}%,name.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: components, count } = await query
    .order('id', { ascending: true })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  const { data: catData } = await supabase.from('components').select('category');
  const categoryCounts: Record<string, number> = {};
  if (catData) {
    catData.forEach((item: { category: string }) => {
      if (item.category) categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
  }

  const { data: brandData } = await supabase.from('components').select('brand');
  const brandCounts: Record<string, number> = {};
  if (brandData) {
    brandData.forEach((item: { brand: string }) => {
      if (item.brand) brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
    });
  }

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <section className="pt-28 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-[#757575] mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
            <span className="text-[#cbcbcb]">/</span>
            <span className="text-[#333]">Каталог</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
            Каталог электронных компонентов
          </h1>
          <p className="text-[#666] text-lg">
            {count ? `${count.toLocaleString()} наименований` : 'Загрузка...'} от {sortedBrands.length} производителей
          </p>
        </div>
      </section>

      <CatalogClient
        components={components || []}
        currentPage={page}
        totalPages={totalPages}
        totalItems={count || 0}
        currentCategory={category}
        currentBrand={brand}
        currentSearch={search}
        categories={sortedCategories}
        brands={sortedBrands}
      />
    </>
  );
}
'''
    write_remote_file(ssh, f'{REMOTE_BASE}/app/catalog/page.tsx', catalog_page)

    # ===== 20. CatalogClient.tsx =====
    print('\n--- Updating CatalogClient.tsx ---')
    # Read current file first to get the full content
    stdin, stdout, stderr = ssh.exec_command(f'cat {REMOTE_BASE}/app/catalog/CatalogClient.tsx')
    catalog_client_content = stdout.read().decode()
    
    # Apply systematic replacements
    replacements = {
        'bg-gray-900/80': 'bg-white',
        'bg-gray-900/50': 'bg-[#fafafa]',
        'bg-gray-800/60': 'bg-white',
        'bg-gray-800/50': 'bg-[#f3f3f3]',
        'border-gray-800/50': 'border-[#e8e8e8]',
        'border-gray-700/50': 'border-[#e8e8e8]',
        'border-gray-700/40': 'border-[#e8e8e8]',
        'border-gray-800': 'border-[#e8e8e8]',
        'border-gray-800/30': 'border-[#e8e8e8]',
        'text-white': 'text-[#121212]',
        'placeholder-gray-500': 'placeholder-[#999]',
        'placeholder-gray-600': 'placeholder-[#999]',
        'text-gray-400': 'text-[#666]',
        'text-gray-500': 'text-[#757575]',
        'text-gray-600': 'text-[#898989]',
        'text-gray-300': 'text-[#333]',
        'hover:text-white': 'hover:text-[#121212]',
        'hover:bg-gray-800/50': 'hover:bg-[#f3f3f3]',
        'bg-emerald-900/40': 'bg-section-alt',
        'text-emerald-400': 'text-primary',
        'bg-emerald-600': 'bg-primary',
        'hover:bg-emerald-500': 'hover:bg-primary-dark',
        'focus:border-emerald-500/50': 'focus:border-primary',
        'focus:ring-emerald-500/30': 'focus:ring-primary/30',
        'bg-cyan-900/40': 'bg-section-alt',
        'text-cyan-400': 'text-primary',
        'bg-purple-900/30': 'bg-section-alt',
        'text-purple-400': 'text-primary',
        'bg-emerald-950/10': 'bg-white',
        'border-emerald-900/30': 'border-[#e8e8e8]',
        'shadow-emerald-600/25': 'shadow-primary/25',
    }
    
    for old, new in replacements.items():
        catalog_client_content = catalog_client_content.replace(old, new)
    
    write_remote_file(ssh, f'{REMOTE_BASE}/app/catalog/CatalogClient.tsx', catalog_client_content)

    # ===== 21. [slug]/page.tsx =====
    print('\n--- Updating [slug]/page.tsx ---')
    stdin, stdout, stderr = ssh.exec_command(f'cat {REMOTE_BASE}/app/[slug]/page.tsx')
    slug_content = stdout.read().decode()
    
    slug_replacements = {
        'bg-[#050807]': 'bg-background',
        'text-white': 'text-[#121212]',
        'text-gray-500': 'text-[#757575]',
        'text-gray-400': 'text-[#666]',
        'text-gray-300': 'text-[#333]',
        'hover:text-emerald-400': 'hover:text-primary',
        'text-emerald-400': 'text-primary',
        'from-emerald-400 to-cyan-400': 'from-primary to-primary-dark',
        'bg-emerald-950/10': 'bg-white',
        'border-emerald-900/30': 'border-[#e8e8e8]',
        'bg-emerald-900/40': 'bg-section-alt',
        'bg-red-900/40': 'bg-red-50',
        'text-red-400': 'text-danger',
        'border-emerald-800/50': 'border-[#cbcbcb]',
        'bg-emerald-900/20': 'bg-section-alt',
        'border-emerald-900/20': 'border-[#e8e8e8]',
        'bg-gray-900/80': 'bg-[#fafafa]',
        'border-gray-800': 'border-[#e8e8e8]',
        'border-gray-800/50': 'border-[#e8e8e8]',
        'hover:bg-gray-900/40': 'hover:bg-[#f3f3f3]',
        'bg-emerald-600': 'bg-primary',
        'hover:bg-emerald-700': 'hover:bg-primary-dark',
        'shadow-emerald-600/25': 'shadow-primary/25',
        'hover:shadow-emerald-600/40': 'hover:shadow-primary/40',
        'from-emerald-900/30 to-cyan-900/20': 'from-primary/10 to-primary-dark/5',
        'bg-emerald-800/30': 'bg-section-alt',
        # Remove Header/Footer from slug page since they're in layout
        # But they may be there intentionally, let's keep them but fix their container bg
    }
    
    for old, new in slug_replacements.items():
        slug_content = slug_content.replace(old, new)
    
    write_remote_file(ssh, f'{REMOTE_BASE}/app/[slug]/page.tsx', slug_content)

    # ===== 22. component/[sku]/page.tsx =====
    print('\n--- Updating component/[sku]/page.tsx ---')
    stdin, stdout, stderr = ssh.exec_command(f'cat {REMOTE_BASE}/app/component/[sku]/page.tsx')
    sku_content = stdout.read().decode()
    
    sku_replacements = {
        'bg-[#050807]': 'bg-background',
        'text-white': 'text-[#121212]',
        'text-gray-500': 'text-[#757575]',
        'text-gray-400': 'text-[#666]',
        'text-gray-300': 'text-[#333]',
        'hover:text-emerald-400': 'hover:text-primary',
        'hover:text-emerald-300': 'hover:text-primary-dark',
        'text-emerald-400': 'text-primary',
        'bg-emerald-950/10': 'bg-white',
        'border-emerald-900/30': 'border-[#e8e8e8]',
        'bg-emerald-900/30': 'bg-section-alt',
        'border-emerald-800/50': 'border-[#cbcbcb]',
        'text-emerald-500': 'text-primary',
        'bg-emerald-900/20': 'bg-section-alt',
        'bg-red-900/30': 'bg-red-50',
        'border-red-800/50': 'border-danger/30',
        'text-red-400': 'text-danger',
        'bg-black/40': 'bg-[#fafafa]',
        'bg-emerald-800/30': 'bg-section-alt',
        'bg-emerald-600': 'bg-primary',
        'hover:bg-emerald-700': 'hover:bg-primary-dark',
        'shadow-emerald-600/25': 'shadow-primary/25',
        'hover:shadow-emerald-600/40': 'hover:shadow-primary/40',
    }
    
    for old, new in sku_replacements.items():
        sku_content = sku_content.replace(old, new)
    
    write_remote_file(ssh, f'{REMOTE_BASE}/app/component/[sku]/page.tsx', sku_content)

    ssh.close()
    print('\n=== All files updated successfully! ===')

if __name__ == '__main__':
    main()
