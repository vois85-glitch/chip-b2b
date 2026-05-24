export default function BrandsMarquee() {
  // Все бренды с твоего списка
  const row1 = [
    'NXP', 'ALTERA', 'XILINX', 'TEXAS INSTRUMENTS', 
    'STMICROELECTRONICS', 'RENESAS', 'ANALOG DEVICES', 'MICROCHIP', 'INFINEON'
  ];

  const row2 = [
    'NORDIC', 'MICRON', 'VISHAY', 'ONSEMI', 
    'WÜRTH ELEKTRONIK', 'DIODES INC.', 'FUJITSU', 'TDK', 'GIGADEVICE'
  ];

  const renderBrand = (name: string) => (
    <div key={name} className="flex-shrink-0 mx-4 md:mx-6">
      {/* Стеклянный Техно-Бейдж */}
      <div className="flex items-center justify-center h-14 md:h-16 px-5 md:px-8 border border-emerald-900/40 rounded-lg bg-emerald-950/10 backdrop-blur-sm text-gray-500 font-bold tracking-[0.15em] text-xs md:text-sm hover:text-emerald-400 hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-default select-none whitespace-nowrap">
        {name}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-[#050807] border-y border-emerald-900/20 overflow-hidden marquee-container">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-500 tracking-widest uppercase">Наши партнеры и производители</h2>
      </div>

      {/* Ряд 1 - движется влево */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050807] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050807] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex animate-marquee">
          {row1.map(renderBrand)}
          {row1.map(renderBrand)}
        </div>
      </div>

      {/* Ряд 2 - движется вправо */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050807] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050807] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex animate-marquee-reverse">
          {row2.map(renderBrand)}
          {row2.map(renderBrand)}
        </div>
      </div>
    </section>
  );
}