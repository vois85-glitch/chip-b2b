export default function BrandsMarquee() {
  // Бренды с их фирменными цветами для стилизованных логотипов
  const brands = [
    { name: 'NXP', color: '#6EBE5B', href: '/nxp' },
    { name: 'INFINEON', color: '#008C5E', href: '/infineon' },
    { name: 'STMICRO', color: '#0078D4', href: '/stmicroelectronics' },
    { name: 'RENESAS', color: '#3E93CF', href: '/renesas' },
    { name: 'ONSEMI', color: '#2E3192', href: '/onsemi' },
    { name: 'VISHAY', color: '#003366', href: '/vishay' },
    { name: 'MURATA', color: '#C8102E', href: '/murata' },
    { name: 'XILINX', color: '#D81B60', href: '/xilinx' },
    { name: 'ANALOG DEVICES', color: '#0066B2', href: '/analog-devices' },
    { name: 'TEXAS INSTRUMENTS', color: '#CC0000', href: '/texas-instruments' },
    { name: 'MICROCHIP', color: '#2E7D32', href: '/microchip' },
    { name: 'ALTERA', color: '#0071C5', href: '/altera' },
    { name: 'LATTICE', color: '#005CA9', href: '/lattice' },
    { name: 'NORDIC', color: '#00A9CE', href: '/nordic' },
    { name: 'MICRON', color: '#00559A', href: '/micron' },
    { name: 'GIGADEVICE', color: '#00A651', href: '/gigadevice' },
    { name: 'TDK', color: '#E4002B', href: '/tdk' },
    { name: 'WÜRTH', color: '#F00014', href: '/wurth-elektronik' },
    { name: 'DIODES INC.', color: '#E4002B', href: '/diodes-inc' },
    { name: 'FUJITSU', color: '#FF0000', href: '/fujitsu' },
  ];

  const renderBrand = (brand: typeof brands[0], index: number) => (
    <a
      key={index}
      href={brand.href}
      className="brand-card-new flex-shrink-0 flex items-center justify-center h-16 w-[140px] md:h-[72px] md:w-[160px] bg-white rounded-xl mx-2 md:mx-3 cursor-pointer group"
    >
      <span
        className="font-extrabold tracking-[0.15em] text-[11px] md:text-xs uppercase whitespace-nowrap transition-all duration-300"
        style={{ color: brand.color, opacity: 0.75 }}
      >
        {brand.name}
      </span>
    </a>
  );

  return (
    <section className="py-16 md:py-20 bg-[#f8f9fa] overflow-hidden marquee-container-new">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
          Официальные поставки от мировых производителей
        </h2>
        <p className="text-gray-500 text-sm mt-2">Более 50 брендов в каталоге</p>
      </div>

      {/* Single row — бесконечная прокрутка */}
      <div className="relative">
        {/* Градиентные маски по краям */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-brands-marquee">
          {brands.map(renderBrand)}
          {brands.map(renderBrand)}
        </div>
      </div>
    </section>
  );
}

