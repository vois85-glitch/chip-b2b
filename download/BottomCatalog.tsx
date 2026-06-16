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
    <section className="py-10 md:py-14 px-4 bg-white border-t border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        {/* Аналоги санкционных компонентов */}
        <div className="mb-10 md:mb-14">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#121212] mb-2">
              Аналоги санкционных и unavailable компонентов
            </h2>
            <p className="text-[#666] text-sm max-w-2xl mx-auto">
              Подбираем функциональные аналоги снятых с производства и санкционных компонентов с полным кросс-референсом электрических параметров
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {analogGroups.map((item, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 bg-[#f8f8f8] hover:bg-[#f0f8f6] border border-[#e8e8e8] hover:border-[#02a391]/30 rounded-lg px-4 py-3 transition-all"
              >
                <div className="shrink-0">
                  <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-mono font-semibold text-[#333]">{item.original}</span>
                    <svg className="w-3.5 h-3.5 text-[#02a391] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-sm font-mono font-semibold text-[#02a391]">{item.analog}</span>
                  </div>
                  <div className="text-[11px] text-[#999] mt-0.5">{item.brand}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <a
              href="#bom"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#02a391] hover:text-[#028a7a] transition-colors"
            >
              Запросить подбор аналога
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>

        {/* Каталог направлений */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#121212] mb-2">
              Каталог электронных компонентов
            </h2>
            <p className="text-[#666] text-sm">
              30 категорий, 2600+ позиций, 71 бренд — подберём комплектацию для любого проекта
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {catalogCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group block bg-[#f8f8f8] hover:bg-[#f0f8f6] border border-[#e8e8e8] hover:border-[#02a391]/30 rounded-lg px-3 py-2.5 transition-all text-center"
              >
                <span className="text-sm font-medium text-[#333] group-hover:text-[#02a391] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition-colors text-sm shadow-sm"
            >
              Все 2600+ компонентов
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
