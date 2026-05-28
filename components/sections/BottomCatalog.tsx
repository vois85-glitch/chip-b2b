import Link from 'next/link';

const catalogCategories = [
  { name: 'Микросхемы', slug: 'mikroshemy' },
  { name: 'Микроконтроллеры', slug: 'arm-kontrollery' },
  { name: 'ПЛИС (FPGA)', slug: 'fpga' },
  { name: 'Транзисторы', slug: 'tranzistory' },
  { name: 'MOSFET', slug: 'mosfet' },
  { name: 'Диоды', slug: 'diody' },
  { name: 'Конденсаторы', slug: 'kondensatory' },
  { name: 'Резисторы', slug: 'rezistory' },
  { name: 'АЦП / ЦАП', slug: 'adc-dac' },
  { name: 'Стабилизаторы', slug: 'stabilizatory' },
  { name: 'Операционные усилители', slug: 'operatsionnye-usiliteli' },
  { name: 'Разъёмы', slug: 'razemy' },
  { name: 'Датчики', slug: 'datchiki' },
  { name: 'Оптоэлектроника', slug: 'optoelektronika' },
  { name: 'Питание', slug: 'pitaniya' },
  { name: 'Телекоммуникации', slug: 'telekommunikatsii' },
  { name: 'Память', slug: 'pamyat' },
  { name: 'Логика', slug: 'logika' },
  { name: 'Реле', slug: 'rele' },
  { name: 'Интерфейсы', slug: 'interfeysy' },
  { name: 'Модули и платы', slug: 'moduli-i-platy' },
  { name: 'Переключатели', slug: 'pereklyuchateli' },
  { name: 'Кварцы и резонаторы', slug: 'kvartsy-i-rezonatory' },
  { name: 'Предохранители', slug: 'predokhraniteli' },
  { name: 'Индуктивности', slug: 'induktivnosti' },
  { name: 'Кабели и провода', slug: 'kabeli-i-provoda' },
  { name: 'Фильтры', slug: 'filtry' },
  { name: 'Трансформаторы', slug: 'transformatory' },
  { name: 'Электроавтоматика', slug: 'elektroavtomatika' },
  { name: 'Монтаж и аксессуары', slug: 'montazh-i-aksessuary' },
];

const analogGroups = [
  { original: 'STM32F103', analog: 'GD32F103', brand: 'GigaDevice' },
  { original: 'STM32F407', analog: 'GD32F407', brand: 'GigaDevice' },
  { original: 'ATmega328P', analog: 'LGT8F328P', brand: 'LogicGreen' },
  { original: 'XC3S200A', analog: 'GW1N-4', brand: 'Gowin' },
  { original: 'EP3C5E144', analog: 'ECP5-12', brand: 'Lattice' },
  { original: 'LM7805CT', analog: 'AMS1117-5.0', brand: 'AMS' },
  { original: 'NE555', analog: 'TLC555', brand: 'Texas Instruments' },
  { original: 'LM358', analog: 'MCP6002', brand: 'Microchip' },
  { original: 'AT24C256', analog: 'BL24C256', brand: 'Belling' },
  { original: 'MAX232', analog: 'SP3232', brand: 'Sipex' },
  { original: 'IRF540N', analog: 'IPP540N', brand: 'Infineon' },
  { original: 'TL431', analog: 'KA431', brand: 'Fairchild' },
];

export default function BottomCatalog() {
  return (
    <section className="py-8 md:py-12 px-4 bg-[#f0f4ee] border-t border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">

        {/* Аналоги санкционных компонентов */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-base md:text-lg font-bold text-[#121212] mb-3">
            Аналоги санкционных компонентов
          </h2>
          <p className="text-[#555] text-xs mb-4">
            Подбираем функциональные аналоги снятых с производства и санкционных компонентов с полным кросс-референсом параметров
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#555]">
            {analogGroups.map((item, i) => (
              <span key={i} className="whitespace-nowrap">
                <span className="font-mono text-[#333]">{item.original}</span>
                <span className="mx-1 text-[#02a391]">&rarr;</span>
                <span className="font-mono text-[#02a391]">{item.analog}</span>
                <span className="text-[#555] text-xs ml-0.5">({item.brand})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Каталог направлений */}
        <div>
          <h2 className="text-base md:text-lg font-bold text-[#121212] mb-3">
            Каталог электронных компонентов
          </h2>
          <p className="text-[#555] text-xs mb-4">
            30 категорий, 2600+ позиций, 71 бренд
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1.5">
            {catalogCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-sm text-[#555] hover:text-[#02a391] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </section>
  );
}
