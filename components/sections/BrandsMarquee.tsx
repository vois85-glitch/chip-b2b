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

export default function BrandsMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Physics state (refs to avoid re-renders)
  const velocityRef = useRef(0.6);          // current velocity (px/frame)
  const targetVelocityRef = useRef(0.6);    // auto-scroll speed
  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastScrollLeftRef = useRef(0);
  const momentumVelocityRef = useRef(0);     // velocity from flick

  const FRICTION = 0.96;    // deceleration per frame
  const MIN_VEL = 0.3;      // minimum velocity before snapping back to auto
  const AUTO_SPEED = 0.6;   // auto-scroll speed

  // Main animation loop
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) { requestAnimationFrame(animate); return; }

    const thirdWidth = el.scrollWidth / 3;

    if (isDraggingRef.current) {
      // While dragging: track velocity for momentum
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        const currentVel = (el.scrollLeft - lastScrollLeftRef.current) / dt * 16; // normalize to ~60fps
        // Smooth velocity tracking (weighted average)
        momentumVelocityRef.current = momentumVelocityRef.current * 0.6 + currentVel * 0.4;
      }
      lastTimeRef.current = now;
      lastScrollLeftRef.current = el.scrollLeft;

    } else if (Math.abs(momentumVelocityRef.current) > 0.1) {
      // Momentum phase: decelerate gradually
      el.scrollLeft += momentumVelocityRef.current;
      momentumVelocityRef.current *= FRICTION;

      // Seamless loop
      if (el.scrollLeft >= thirdWidth * 2) el.scrollLeft -= thirdWidth;
      if (el.scrollLeft < 0) el.scrollLeft += thirdWidth;

      // When momentum dies, transition to auto-scroll
      if (Math.abs(momentumVelocityRef.current) < MIN_VEL) {
        momentumVelocityRef.current = 0;
        // Resume auto-scroll in the natural direction
        velocityRef.current = isHoveringRef.current ? 0 : AUTO_SPEED;
      }

    } else if (!isHoveringRef.current) {
      // Auto-scroll phase
      el.scrollLeft += AUTO_SPEED;
      if (el.scrollLeft >= thirdWidth) el.scrollLeft -= thirdWidth;
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
    momentumVelocityRef.current = 0;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    lastScrollLeftRef.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = clientX - lastXRef.current;
    el.scrollLeft -= dx;
    lastXRef.current = clientX;

    // Track velocity
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      const instantVel = -dx / dt * 16;
      momentumVelocityRef.current = momentumVelocityRef.current * 0.5 + instantVel * 0.5;
    }
    lastTimeRef.current = now;
    lastScrollLeftRef.current = el.scrollLeft;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const el = scrollRef.current;
    if (el) el.style.cursor = 'grab';
    // momentumVelocityRef is already set — animation loop will handle deceleration
  };

  // Mouse
  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); handlePointerDown(e.clientX); };
  const onMouseMove = (e: React.MouseEvent) => { handlePointerMove(e.clientX); };
  const onMouseUp = () => { handlePointerUp(); };
  const onMouseEnter = () => { isHoveringRef.current = true; };
  const onMouseLeave = () => { isHoveringRef.current = false; handlePointerUp(); };

  // Touch
  const onTouchStart = (e: React.TouchEvent) => { handlePointerDown(e.touches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { handlePointerMove(e.touches[0].clientX); };
  const onTouchEnd = () => { handlePointerUp(); };

  // Arrow navigation — gives a flick impulse
  const scrollByAmount = 340;
  const scrollLeft_ = () => {
    momentumVelocityRef.current = -scrollByAmount / 16 * 0.8;
  };
  const scrollRight = () => {
    momentumVelocityRef.current = scrollByAmount / 16 * 0.8;
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
          className="flex overflow-x-auto scrollbar-hide cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
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
