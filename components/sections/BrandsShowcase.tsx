'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const brands = [
 {
 name: 'STM32',
 desc: 'Микроконтроллеры STM32 для embedded-систем, промышленной автоматизации и IoT-решений.',
 logo: '/brands/stmicro.svg',
 href: '/stmicroelectronics',
 },
 {
 name: 'Texas Instruments',
 desc: 'Аналоговые и power management решения для промышленной и высокотехнологичной электроники.',
 logo: '/brands/texas-instruments.svg',
 href: '/texas-instruments',
 },
 {
 name: 'Infineon',
 desc: 'Полупроводниковые решения для automotive, industrial automation и силовой электроники.',
 logo: '/brands/infineon.svg',
 href: '/infineon',
 },
 {
 name: 'Xilinx',
 desc: 'FPGA и adaptive computing платформы для embedded и high-performance систем.',
 logo: '/brands/xilinx.svg',
 href: '/xilinx',
 },
 {
 name: 'Analog Devices',
 desc: 'Высокоточные аналоговые компоненты и mixed-signal решения для профессиональной электроники.',
 logo: '/brands/analog-devices.svg',
 href: '/analog-devices',
 },
];

export default function BrandsShowcase() {
 return (
 <section className="py-16 px-4 bg-white relative">
 <div className="max-w-7xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="text-center mb-10"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#121212]">Бренды</h2>
 <p className="text-[#555] text-base max-w-2xl mx-auto">
 Работаем с ведущими мировыми производителями электронных компонентов
 </p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {brands.map((brand, index) => (
 <motion.div
 key={brand.name}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4, delay: index * 0.08 }}
 >
 <Link
 href={brand.href}
 className="group block bg-[#f0f4ee] border border-[#e8e8e8] rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full"
 >
 <div className="flex items-center gap-4 mb-4">
 <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-[#e8e8e8] p-1">
 <img src={brand.logo} alt={brand.name} className="max-w-[56px] max-h-[32px] object-contain" />
 </div>
 <h3 className="text-lg font-bold text-[#121212] group-hover:text-primary transition-colors">{brand.name}</h3>
 </div>
 <p className="text-[#555] text-sm leading-relaxed">{brand.desc}</p>
 </Link>
 </motion.div>
 ))}
 </div>

 <div className="text-center mt-8">
 <Link
 href="/brands"
 className="inline-flex items-center gap-2 px-7 py-3 border border-primary text-primary hover:bg-primary/5 rounded-xl font-semibold transition-colors text-sm"
 >
 Все бренды каталога
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 </div>
 </div>
 </section>
 );
}
