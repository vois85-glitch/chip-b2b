'use client';

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
