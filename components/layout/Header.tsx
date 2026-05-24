'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center font-bold text-white">C</div>
          <span className="text-xl font-bold tracking-tight">ChipNet</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#catalog" className="hover:text-emerald-400 transition-colors">Каталог</a>
          <a href="#bom" className="hover:text-emerald-400 transition-colors">Загрузить BOM</a>
          <a href="#about" className="hover:text-emerald-400 transition-colors">О компании</a>
          <a href="#contacts" className="hover:text-emerald-400 transition-colors">Контакты</a>
        </nav>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/25">
          Получить КП
        </button>
      </div>
    </motion.header>
  );
}