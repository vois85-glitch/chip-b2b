"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CallbackModal from "@/components/layout/CallbackModal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };


  const navLinks = [
    { label: "Каталог", href: "/catalog", hash: false },
    { label: "Поиск", href: "/#search", hash: true, sectionId: "search" },
    { label: "Загрузить BOM", href: "/#bom", hash: true, sectionId: "bom" },
    { label: "О компании", href: "/#about", hash: true, sectionId: "about" },
    { label: "Доставка", href: "/delivery", hash: false },
    { label: "Контакты", href: "/#contacts", hash: true, sectionId: "contacts" },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-black/5" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* === Верхняя панель: контакты === */}
        <div
          className={`transition-all duration-300 ${
            scrolled
              ? "bg-[#f0f4ee]/95 backdrop-blur-xl"
              : "bg-[#f0f4ee]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Логотип */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group cursor-pointer shrink-0"
            >
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
              <div className="leading-tight">
                <span className="text-xl font-bold tracking-tight text-[#121212]">
                  Chip<span className="text-primary">Net</span>
                </span>
                <div className="text-[10px] text-[#666] tracking-wide">
                  ЭЛЕКТРОННЫЕ КОМПОНЕНТЫ
                </div>
              </div>
            </Link>

            {/* Бейдж */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 bg-[#eaf0e8] rounded-full text-xs text-[#666]">
              <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Работаем только с юрлицами
            </div>

            {/* Контакты */}
            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+79103219191" className="flex items-center gap-1.5 text-sm text-[#333] hover:text-primary transition-colors">
                <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">+7-910-321-91-91</span>
              </a>
              <a href="mailto:info@chip-net.ru" className="flex items-center gap-1.5 text-sm text-[#333] hover:text-primary transition-colors">
                <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@chip-net.ru
              </a>
              <div className="flex items-center gap-1.5 text-xs text-[#666]">
                <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                г. Белгород, ул. Шаландина, д. 4, оф. 8
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCallbackOpen(true)}
                className="hidden sm:inline-flex bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
              >
                Обратный звонок
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 rounded-lg hover:bg-[#eaf0e8] transition-colors"
                aria-label="Меню"
              >
                <span className={`block w-5 h-0.5 bg-[#333] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-5 h-0.5 bg-[#333] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 bg-[#333] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* === Нижняя панель: навигация (тёмная) === */}
        <div className="bg-[#1e2a25]">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between">
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) =>
                link.hash && isHome ? (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.sectionId!)}
                    className="text-white/80 hover:text-white text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs font-semibold tracking-wide uppercase transition-colors ${
                      pathname === link.href ? "text-[#02a391]" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <svg className="w-3.5 h-3.5 text-[#02a391] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Поставляем по всей России от 6 дней</span>
              <span className="sm:hidden">Доставка по РФ от 6 дн.</span>
            </div>
          </nav>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-[#f0f4ee] border-t border-[#e8e8e8]"
            >
              <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                <div className="flex flex-col gap-2 pb-3 mb-3 border-b border-[#e8e8e8]">
                  <a href="tel:+79103219191" className="flex items-center gap-2 text-sm text-[#333]">
                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +7-910-321-91-91
                  </a>
                  <a href="mailto:info@chip-net.ru" className="flex items-center gap-2 text-sm text-[#333]">
                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@chip-net.ru
                  </a>
                  <div className="flex items-center gap-2 text-sm text-[#666]">
                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    г. Белгород, ул. Шаландина, д. 4, оф. 8
                  </div>
                </div>
                {navLinks.map((link) =>
                  link.hash && isHome ? (
                    <button
                      key={link.label}
                      onClick={() => scrollToSection(link.sectionId!)}
                      className="w-full text-left px-4 py-3 rounded-lg text-[#333] hover:text-primary hover:bg-[#eaf0e8] transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-[#333] hover:text-primary hover:bg-[#eaf0e8] transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <button
                  onClick={() => { setMobileOpen(false); setCallbackOpen(true); }}
                  className="mt-2 text-center bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                >
                  Обратный звонок
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CallbackModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}
