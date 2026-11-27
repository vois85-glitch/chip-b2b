'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trackGoal } from '@/lib/metrika';

export default function FloatingCta() {
 const [showScrollTop, setShowScrollTop] = useState(false);
 const pathname = usePathname();

 useEffect(() => {
 const handleScroll = () => {
 setShowScrollTop(window.scrollY > 400);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const scrollToTop = () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 // На главной кнопка ведёт к секции BOM-загрузки (#bom), на остальных
 // страницах якоря #bom нет — открываем окно заявки (CallbackModal).
 const isHome = pathname === '/';
 const ctaProps = isHome
 ? { href: '#bom' }
 : {
 type: 'button' as const,
 onClick: () => {
 trackGoal('callback_open', { source: 'floating_cta' });
 window.dispatchEvent(new CustomEvent('open-callback-modal'));
 },
 };

 const CtaTag = isHome ? 'a' : 'button';

 return (
 <>
 {/* CTA кнопка — заявка */}
 <motion.div
 initial={{ opacity: 0, scale: 0.5 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 2, duration: 0.3 }}
 className="fixed bottom-6 right-4 z-30"
 >
 <CtaTag
 {...ctaProps}
 className="bg-primary hover:bg-primary-dark text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all group cursor-pointer"
 title="Оставить заявку"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </CtaTag>
 </motion.div>

 {/* Кнопка наверх — внизу по центру */}
 <AnimatePresence>
 {showScrollTop && (
 <motion.button
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 20 }}
 transition={{ duration: 0.3 }}
 onClick={scrollToTop}
 className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 hover:border-[#059669]/40 transition-all group shadow-lg cursor-pointer"
 title="Наверх"
 >
 <svg className="w-4 h-4 md:w-5 md:h-5 text-[#059669] group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
 </svg>
 <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#059669]/50 absolute top-2 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
 </svg>
 </motion.button>
 )}
 </AnimatePresence>
 </>
 );
}
