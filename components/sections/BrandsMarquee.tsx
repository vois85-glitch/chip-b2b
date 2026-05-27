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
      className="brand-logo-item flex-shrink-0 flex items-center justify-center cursor-pointer group"
      style={{ width: '160px', height: '56px' }}
    >
      <img
        src={brand.logo}
        alt={brand.name}
        className="max-w-[140px] max-h-[44px] object-contain transition-all duration-300 group-hover:scale-110"
        loading="lazy"
      />
    </a>
  );

  return (
    <section className="py-6 md:py-8 bg-[#f0f4ee] overflow-hidden marquee-container-new">
      <div className="text-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-[#121212] dark:text-white tracking-wide">
          Официальные поставки от мировых производителей
        </h2>
        <p className="text-[#757575] dark:text-[#7a8a84] text-xs mt-1">Более 50 брендов в каталоге</p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-brands-marquee">
          {brands.map(renderBrand)}
          {brands.map(renderBrand)}
        </div>
      </div>
    </section>
  );
}
