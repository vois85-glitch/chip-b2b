export default function BrandsMarquee() {
  // Массив брендов с их ФИРМЕННЫМИ ЦВЕТАМИ (как на картинке)
  const row1 = [
    { name: 'NXP', color: '#6EBE5B' },
    { name: 'ALTERA', color: '#0071C5' },
    { name: 'XILINX', color: '#D81B60' },
    { name: 'TEXAS INSTRUMENTS', color: '#CC0000' },
    { name: 'STMICRO', color: '#0078D4' },
    { name: 'RENESAS', color: '#3E93CF' },
    { name: 'ANALOG DEVICES', color: '#0066B2' },
    { name: 'MICROCHIP', color: '#2E7D32' },
    { name: 'INFINEON', color: '#008C5E' },
  ];

  const row2 = [
    { name: 'NORDIC', color: '#00A9CE' },
    { name: 'MICRON', color: '#00559A' },
    { name: 'VISHAY', color: '#E31937' },
    { name: 'ONSEMI', color: '#2E3192' },
    { name: 'WÜRTH ELEKTRONIK', color: '#F00014' },
    { name: 'DIODES INC.', color: '#E4002B' },
    { name: 'FUJITSU', color: '#FF0000' },
    { name: 'TDK', color: '#E4002B' },
    { name: 'GIGADEVICE', color: '#00A651' },
  ];

  const renderBrand = (brand: { name: string, color: string }, index: number) => (
    <div key={index} className="flex-shrink-0 mx-3 md:mx-5">
      <div 
        className="brand-card flex items-center justify-center h-14 md:h-16 px-5 md:px-8 rounded-lg font-extrabold tracking-[0.2em] text-[11px] md:text-xs cursor-default whitespace-nowrap uppercase"
        style={{ '--brand-color': brand.color } as React.CSSProperties}
      >
        {brand.name}
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