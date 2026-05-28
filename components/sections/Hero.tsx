'use client';

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
 return (
 <section className="relative bg-[#0c1f1e] overflow-hidden pt-[108px] mt-0" style={{ backgroundImage: 'linear-gradient(to bottom right, #0c1f1e, #0f2e2b, #091b1a)' }}>
 {/* Background decorative elements */}
 <div className="absolute inset-0 pointer-events-none">
 <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px]" />
 <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#02a391]/15 rounded-full blur-[150px]" />
 {/* Circuit pattern overlay */}
 <div className="absolute inset-0 opacity-[0.03]" style={{
 backgroundImage: "linear-gradient(#02a391 1px, transparent 1px), linear-gradient(90deg, #02a391 1px, transparent 1px)",
 backgroundSize: "60px 60px"
 }} />
 </div>

 <div className="relative z-10 max-w-7xl mx-auto px-4 pt-4 pb-8 md:pt-6 md:pb-12 lg:pt-8 lg:pb-16">
 <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 md:gap-6 lg:gap-10 items-center">
 {/* Text Content */}
 <div className="text-center lg:text-left order-1">
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.15 }}
 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-bold tracking-tight leading-[1.1] mb-2 md:mb-3 text-white"
 >
 Поставка оригинальных{" "}
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#02a391] to-[#04d4b0]">
 электронных компонентов
 </span>{" "}
 для промышленности и разработки
 </motion.h1>

 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.3 }}
 className="text-sm md:text-base text-[#94a3b8] max-w-xl mx-auto lg:mx-0 mb-4 md:mb-6 leading-relaxed"
 >
 Chip-Net помогает производителям электроники, инженерам и procurement-командам находить и поставлять микросхемы, FPGA, микроконтроллеры и дефицитные компоненты с проверкой подлинности и международной логистикой.
 </motion.p>

 {/* Value Proposition */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.38 }}
 className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1.5 mb-4 md:mb-6"
 >
 {['Поставки от 6 дней', 'Европа и Азия', 'BOM-комплектация', 'Подбор аналогов', 'Контроль качества'].map((tag) => (
 <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-[#94a3b8]">
 <span className="w-1.5 h-1.5 bg-[#02a391] rounded-full" />
 {tag}
 </span>
 ))}
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.45 }}
 className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center lg:justify-start mb-4 md:mb-6"
 >
 <a href="#bom" className="group px-5 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-[#02a391] to-[#04c4a5] hover:from-[#02907f] hover:to-[#03b095] rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#02a391]/25 hover:shadow-[#02a391]/40 text-white text-center flex items-center justify-center gap-2">
 Запросить поставку
 <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </a>
 <a href="#bom" className="px-5 py-2 md:px-6 md:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm font-semibold backdrop-blur-md transition-all text-white text-center">
 Загрузить BOM
 </a>
 </motion.div>

 {/* Stats */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.6 }}
 className="grid grid-cols-3 gap-3 md:gap-4 max-w-xs sm:max-w-md mx-auto lg:mx-0"
 >
 <div className="text-center lg:text-left">
 <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">2600+</div>
 <div className="text-[10px] sm:text-xs md:text-sm text-[#64748b] mt-0.5">Компонентов</div>
 </div>
 <div className="text-center lg:text-left border-x border-white/10 px-2 md:px-4">
 <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">71</div>
 <div className="text-[10px] sm:text-xs md:text-sm text-[#64748b] mt-0.5">Бренд</div>
 </div>
 <div className="text-center lg:text-left">
 <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">6 дн.</div>
 <div className="text-[10px] sm:text-xs md:text-sm text-[#64748b] mt-0.5">Доставка</div>
 </div>
 </motion.div>
 </div>

 {/* Hero Image — visible on ALL screens */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.3 }}
 className="relative order-2 w-full max-w-lg md:max-w-xl mx-auto lg:max-w-none"
 >
 <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl shadow-[#02a391]/20 border border-[#02a391]/20">
 <Image
 src="/hero-photo.jpeg"
 alt="Электронные компоненты Chip-Net — микросхемы, FPGA, микроконтроллеры"
 width={1344}
 height={768}
 className="w-full h-auto object-cover"
 priority
 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
 />
 {/* Gradient overlays */}
 <div className="absolute inset-0 bg-gradient-to-r from-[#0c1f1e] via-transparent to-transparent opacity-40 lg:opacity-60" />
 <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f1e] via-transparent to-transparent opacity-20 lg:opacity-30" />
 </div>
 
 {/* Floating badge — bottom left */}
 <div className="absolute -bottom-3 -left-2 md:-bottom-4 md:-left-4 bg-[#0f2e2b]/90 backdrop-blur-md border border-[#02a391]/30 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-xl">
 <div className="flex items-center gap-2 md:gap-3">
 <div className="w-8 h-8 md:w-10 md:h-10 bg-[#02a391]/20 rounded-lg flex items-center justify-center shrink-0">
 <svg className="w-4 h-4 md:w-5 md:h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
 </div>
 <div>
 <div className="text-xs md:text-sm font-semibold text-white">Контроль качества</div>
 <div className="text-[10px] md:text-xs text-[#64748b]">Проверка подлинности</div>
 </div>
 </div>
 </div>

 {/* Top-right floating badge */}
 <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-[#0f2e2b]/90 backdrop-blur-md border border-[#02a391]/30 rounded-lg md:rounded-xl px-2.5 py-2 md:px-4 md:py-2.5 shadow-xl">
 <div className="flex items-center gap-1.5 md:gap-2">
 <div className="w-7 h-7 md:w-8 md:h-8 bg-[#02a391]/20 rounded-lg flex items-center justify-center shrink-0">
 <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
 </div>
 <div className="text-xs md:text-sm font-semibold text-white whitespace-nowrap">От 6 дней</div>
 </div>
 </div>
 </motion.div>
 </div>
 </div>

 {/* Bottom wave separator */}
 <div className="absolute bottom-0 left-0 right-0">
 <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
 <path d="M0 60L60 54C120 48 240 36 360 30C480 24 600 24 720 28C840 32 960 40 1080 42C1200 44 1320 40 1380 38L1440 36V60H0Z" fill="white"/>
 </svg>
 </div>
 </section>
 );
}
