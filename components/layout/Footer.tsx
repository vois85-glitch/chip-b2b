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

export default function Footer() {
  return (
    <footer className="py-8 px-4 bg-section-accent dark:bg-[#0a0f0d] border-t border-[#bbd3ba] dark:border-[#1e2a25] dark:border-[#1e2a25]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          
          {/* Колонка 1: Логотип */}
          <div>
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-8 h-8 text-primary group-hover:text-primary-dark transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="23"></line>
                  <line x1="15" y1="20" x2="15" y2="23"></line>
                  <line x1="20" y1="9" x2="23" y2="9"></line>
                  <line x1="20" y1="14" x2="23" y2="14"></line>
                  <line x1="1" y1="9" x2="4" y2="9"></line>
                  <line x1="1" y1="14" x2="4" y2="14"></line>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#121212] dark:text-white group-hover:text-primary transition-colors">
                Chip<span className="text-primary group-hover:text-primary-dark transition-colors">Net</span>
              </span>
            </Link>
            <p className="text-sm text-[#666] dark:text-[#8a9a94] leading-relaxed mt-4 ml-1">
              Поставка оригинальных электронных компонентов и промышленного оборудования для ВПК и производства.
            </p>
          </div>

          {/* Колонка 2: Навигация */}
          <div>
            <h4 className="font-semibold mb-4 text-[#121212] dark:text-white">Навигация</h4>
            <div className="flex flex-col gap-2 text-sm text-[#666] dark:text-[#8a9a94]">
              <a href="#search" className="hover:text-primary transition-colors">Поиск компонентов</a>
              <a href="#bom" className="hover:text-primary transition-colors">Загрузить BOM</a>
              <a href="#about" className="hover:text-primary transition-colors">О компании</a>
              <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
            </div>
          </div>

          {/* Колонка 3: Контакты */}
          <div>
            <h4 className="font-semibold mb-4 text-[#121212] dark:text-white">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm text-[#666] dark:text-[#8a9a94]">
              <a href="tel:+79103219191" className="hover:text-primary transition-colors">+7 (910) 321-91-91</a>
              <a href="mailto:info@chip-net.ru" className="hover:text-primary transition-colors">info@chip-net.ru</a>
              <span>г. Белгород, ул. Шаландина, 4 к3 оф8</span>
            </div>
          </div>
        </div>

        {/* Каталог — категории текстовыми ссылками */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-[#121212]">Каталог</h4>
          <nav className="flex flex-wrap gap-x-4 gap-y-1.5">
            {catalogCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-sm text-[#666] hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Юридическая строка */}
        <div className="border-t border-[#bbd3ba] dark:border-[#1e2a25] pt-6 text-xs text-[#757575] text-center md:text-left flex flex-col md:flex-row justify-between gap-4">
          <div>
            © {new Date().getFullYear()} ООО «Деловой Партнёр». Все права защищены. ИНН 3123341983, ОГРН 1143123005838
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#333]">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
