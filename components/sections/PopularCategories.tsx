import Link from 'next/link';

const categories = [
  { title: 'Микросхемы', desc: 'Драйверы, контроллеры, ИС', href: '/mikroshemy', icon: '🔌' },
  { title: 'Микроконтроллеры', desc: 'ARM, AVR, PIC, аналоги', href: '/arm-kontrollery', icon: '🧠' },
  { title: 'ПЛИС (FPGA)', desc: 'Xilinx, Altera, Lattice', href: '/fpga', icon: '🔲' },
  { title: 'Транзисторы', desc: 'MOSFET, IGBT, биполярные', href: '/tranzistory', icon: '⚡' },
  { title: 'Диоды', desc: 'Шоттки, стабилитроны, TVS', href: '/diody', icon: '🔴' },
  { title: 'Конденсаторы', desc: 'Керамика, электролиты, тантал', href: '/kondensatory', icon: '🔋' },
  { title: 'Резисторы', desc: 'SMD, выводные, подстроечные', href: '/rezistory', icon: '📏' },
  { title: 'Разъёмы', desc: 'Molex, JST, Amphenol, TE', href: '/razemy', icon: '🔗' },
  { title: 'Модули и платы', desc: 'Raspberry Pi, IoT модули', href: '/moduli-i-platy', icon: '💻' },
  { title: 'Датчики', desc: 'MEMS, IMU, температуры', href: '/datchiki', icon: '📡' },
  { title: 'Питание', desc: 'AC/DC, DC/DC, LDO', href: '/pitaniya', icon: '🔋' },
  { title: 'Оптоэлектроника', desc: 'Светодиоды, оптроны', href: '/optoelektronika', icon: '💡' },
];

export default function PopularCategories() {
  return (
    <section className="py-6 px-4 bg-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Каталог направлений</h2>
          <p className="text-[#666] text-sm">Выберите категорию или откройте полный каталог</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group block bg-white border border-[#e8e8e8] rounded-lg p-3 hover:bg-section-alt hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <h3 className="text-sm font-bold text-[#121212] group-hover:text-primary transition-colors">{cat.title}</h3>
              <p className="text-[#757575] text-xs leading-snug">{cat.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white transition-colors text-sm shadow-sm"
          >
            Все 2600+ компонентов
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
