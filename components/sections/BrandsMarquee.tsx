export default function BrandsMarquee() {
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

  const renderBrand = (brand: typeof brands[0], index: number) => (
    <a
      key={index}
      href={brand.href}
      className="brand-card-new flex-shrink-0 flex items-center justify-center bg-white rounded-xl mx-2 md:mx-3 cursor-pointer group overflow-hidden"
      style={{ width: '160px', height: '72px' }}
    >
      <img
        src={brand.logo}
        alt={brand.name}
        className="max-w-[130px] max-h-[50px] object-contain transition-all duration-300 opacity-80 group-hover:opacity-100"
        loading="lazy"
      />
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

      <div className="relative">
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

