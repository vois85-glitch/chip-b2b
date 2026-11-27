'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyRfqBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [partNumber, setPartNumber] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  // Try to extract part number from page
  useEffect(() => {
    const h1 = document.querySelector('h1');
    if (h1) {
      const text = h1.textContent?.trim() || '';
      // Component pages have SKU in h1
      if (text.match(/^[A-Z0-9]/)) {
        setPartNumber(text.split(' ')[0]);
      }
    }
  }, []);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#02a391]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-10 h-10 bg-[#02a391]/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#121212] truncate">
                  {partNumber ? `Запросить КП на ${partNumber}` : 'Запросить коммерческое предложение'}
                </div>
                <div className="text-xs text-[#757575]">Ответ за 2 часа • Гарантия оригинала • Контроль СВП</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/#bom"
                className="px-4 py-2 bg-gradient-to-r from-[#02a391] to-[#04c4a5] hover:from-[#02907f] hover:to-[#03b095] rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-[#02a391]/25"
              >
                Отправить RFQ
              </a>
              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 text-[#757575] hover:text-[#121212] transition-colors"
                aria-label="Закрыть"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
