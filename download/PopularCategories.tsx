import Link from 'next/link';

const categories = [
  { title: 'Микросхемы', desc: 'Драйверы, контроллеры, генераторы, специализированные ИС.', href: '/mikroshemy', icon: '🔌' },
  { title: 'Микроконтроллеры', desc: 'ARM Cortex-M, AVR, PIC. Подбор аналогов снятых с производства серий.', href: '/arm-kontrollery', icon: '🧠' },
  { title: 'ПЛИС (FPGA)', desc: 'Xilinx, Intel/Altera, Lattice. Кросс-референс и поставка.', href: '/fpga', icon: '🔲' },
  { title: 'Транзисторы', desc: 'MOSFET, IGBT, биполярные. Силовые ключи для автоматики.', href: '/tranzistory', icon: '⚡' },
  { title: 'Диоды', desc: 'Шоттки, стабилитроны, выпрямительные мосты, TVS.', href: '/diody', icon: '🔴' },
  { title: 'Конденсаторы', desc: 'Керамика, электролиты, тантал от Murata, TDK, KEMET.', href: '/kondensatory', icon: '🔋' },
  { title: 'Резисторы', desc: 'SMD, выводные, подстроечные от Yageo, Bourns, Vishay.', href: '/rezistory', icon: '📏' },
  { title: 'Разъёмы', desc: 'Molex, JST, Amphenol, TE, Phoenix Contact.', href: '/razemy', icon: '🔗' },
  { title: 'Модули и платы', desc: 'Raspberry Pi, Arduino, беспроводные модули, IoT.', href: '/moduli-i-platy', icon: '💻' },
  { title: 'Датчики', desc: 'MEMS, IMU, температуры, давления, Холла.', href: '/datchiki', icon: '📡' },
  { title: 'Питание', desc: 'AC/DC, DC/DC преобразователи, LDO стабилизаторы.', href: '/pitaniya', icon: '🔋' },
  { title: 'Оптоэлектроника', desc: 'Светодиоды, оптроны, дисплеи, фотодиоды.', href: '/optoelektronika', icon: '💡' },
];

export default function PopularCategories() {
  return (
    <section className="py-24 px-4 bg-[#050807]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Каталог направлений</h2>
          <p className="text-gray-400 text-lg">Работаем со всеми типами компонентов. Выберите категорию или откройте полный каталог.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={`/catalog?category=${encodeURIComponent(cat.title)}`}
              className="group block bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">{cat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white transition-colors text-lg"
          >
            Все 2600+ компонентов
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
