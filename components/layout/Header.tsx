'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Функция для прокрутки наверх при клике на логотип
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Если мы уже на главной странице, просто скроллим наверх
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-emerald-900/50 shadow-2xl' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* --- КЛИКАБЕЛЬНЫЙ ЛОГОТИП С ПРОКРУТКОЙ ВВЕРХ --- */}
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3 group cursor-pointer">
          {/* Иконка микросхемы (SVG) */}
          <div className="w-9 h-9 text-emerald-500 group-hover:text-emerald-400 transition-colors">
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
          {/* Текст логотипа */}
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            Chip<span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">Net</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#search" className="hover:text-emerald-400 transition-colors">Поиск</a>
          <a href="#bom" className="hover:text-emerald-400 transition-colors">Загрузить BOM</a>
          <a href="#about" className="hover:text-emerald-400 transition-colors">О компании</a>
          <a href="#contacts" className="hover:text-emerald-400 transition-colors">Контакты</a>
        </nav>

        <a href="#bom" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/25">
          Получить КП
        </a>
      </div>
    </motion.header>
  );
}