'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

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

export default function BrandsMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(0.6); // px per frame

  // Auto-scroll animation
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (!isPaused && !isDragging) {
      el.scrollLeft += speedRef.current;
      // Seamless loop: when we've scrolled past the first set, reset
      const halfWidth = el.scrollWidth / 3;
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isDragging]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  // Arrow navigation
  const scrollByAmount = 320;
  const scrollLeft_ = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
  };
  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
  };

  const renderBrand = (brand: typeof brands[0], index: number) => (
    <a
      key={index}
      href={brand.href}
      className="brand-logo-item flex-shrink-0 flex items-center justify-center cursor-pointer group select-none"
      style={{ width: '160px', height: '56px' }}
      draggable={false}
    >
      <img
        src={brand.logo}
        alt={brand.name}
        className="max-w-[140px] max-h-[44px] object-contain transition-all duration-300 group-hover:scale-110 pointer-events-none"
        loading="lazy"
        draggable={false}
      />
    </a>
  );

  return (
    <section className="py-6 md:py-8 bg-[#f0f4ee] overflow-hidden">
      <div className="text-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-[#121212] tracking-wide">
          Официальные поставки от мировых производителей
        </h2>
        <p className="text-[#666] text-xs mt-1">Более 50 брендов в каталоге</p>
      </div>

      <div className="relative group/carousel">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#f0f4ee] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#f0f4ee] to-transparent z-10 pointer-events-none" />

        {/* Left arrow */}
        <button
          onClick={scrollLeft_}
          className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md border border-[#d4ddd2] text-[#555] hover:text-[#02a391] transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
          aria-label="Прокрутить влево"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md border border-[#d4ddd2] text-[#555] hover:text-[#02a391] transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
          aria-label="Прокрутить вправо"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); onMouseUp(); }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Triple the brands for seamless infinite loop */}
          {brands.map(renderBrand)}
          {brands.map(renderBrand)}
          {brands.map(renderBrand)}
        </div>
      </div>
    </section>
  );
}
