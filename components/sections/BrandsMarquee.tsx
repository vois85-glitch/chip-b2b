'use client';

import { useRef, useEffect, useCallback } from 'react';

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

const AUTO_SPEED = 0.5;    // auto-scroll speed (px/frame)
const FRICTION = 0.955;    // momentum deceleration per frame
const MERGE_RATE = 0.03;   // how fast momentum merges back to auto-scroll

export default function BrandsMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // All physics in refs — no re-renders
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastScrollRef = useRef(0);
  const velocityRef = useRef(AUTO_SPEED); // current velocity — starts at auto speed
  const initializedRef = useRef(false);

  // Main animation loop
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) { requestAnimationFrame(animate); return; }

    // Initialize: start from middle set for seamless bidirectional loop
    if (!initializedRef.current && el.scrollWidth > 0) {
      el.scrollLeft = el.scrollWidth / 3;
      initializedRef.current = true;
    }

    const oneSet = el.scrollWidth / 3;

    if (isDraggingRef.current) {
      // While dragging: just track velocity (set in move handler)
      // Don't touch scrollLeft here — the move handler does it
      lastScrollRef.current = el.scrollLeft;

    } else {
      // Apply current velocity
      el.scrollLeft += velocityRef.current;

      // If in momentum mode (velocity != AUTO_SPEED), decelerate
      if (Math.abs(velocityRef.current - AUTO_SPEED) > 0.02) {
        // Momentum deceleration
        if (Math.abs(velocityRef.current) > AUTO_SPEED + 0.1) {
          velocityRef.current *= FRICTION;
        }
        // Smoothly merge back toward auto-scroll speed
        velocityRef.current += (AUTO_SPEED - velocityRef.current) * MERGE_RATE;
      } else {
        velocityRef.current = AUTO_SPEED;
      }

      // Seamless loop
      if (el.scrollLeft >= oneSet * 2) el.scrollLeft -= oneSet;
      if (el.scrollLeft < 0) el.scrollLeft += oneSet;
    }

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // --- Pointer / Touch handlers ---

  const handlePointerDown = (clientX: number) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    lastScrollRef.current = el.scrollLeft;
    velocityRef.current = 0; // stop while dragging
    el.style.cursor = 'grabbing';
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const dx = clientX - lastXRef.current;
    el.scrollLeft -= dx;

    // Track velocity for momentum release
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 2) {
      const instantVel = -dx / dt * 16; // normalize to ~60fps
      velocityRef.current = velocityRef.current * 0.5 + instantVel * 0.5;
    }

    lastXRef.current = clientX;
    lastTimeRef.current = now;
    lastScrollRef.current = el.scrollLeft;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const el = scrollRef.current;
    if (el) el.style.cursor = 'grab';
    // velocityRef already has flick velocity — animation loop decelerates it
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); handlePointerDown(e.clientX); };
  const onMouseMove = (e: React.MouseEvent) => { handlePointerMove(e.clientX); };
  const onMouseUp = () => { handlePointerUp(); };
  const onMouseLeave = () => { handlePointerUp(); };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => { handlePointerDown(e.touches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { handlePointerMove(e.touches[0].clientX); };
  const onTouchEnd = () => { handlePointerUp(); };

  // Arrow navigation — gives a flick impulse
  const scrollLeft_ = () => { velocityRef.current = -18; };
  const scrollRight = () => { velocityRef.current = 18; };

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
          className="flex overflow-x-auto scrollbar-hide cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Triple brands for seamless infinite loop */}
          {brands.map(renderBrand)}
          {brands.map(renderBrand)}
          {brands.map(renderBrand)}
        </div>
      </div>
    </section>
  );
}
