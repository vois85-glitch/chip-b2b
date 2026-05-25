import Link from 'next/link';

const categories = [
  {
    title: 'Микроконтроллеры',
    desc: 'ARM Cortex-M, AVR, PIC. Подбор аналогов снятых с производства серий.',
    href: '/arm-kontrollery',
    icon: '🧠'
  },
  {
    title: 'ПЛИС (FPGA)',
    desc: 'Xilinx, Intel/Altera, Lattice. Кросс-референс и поставка санкционных серий.',
    href: '/fpga',
    icon: '🔲'
  },
  {
    title: 'Транзисторы',
    desc: 'MOSFET, IGBT, биполярные. Силовые ключи для промышленной автоматики.',
    href: '/tranzistory',
    icon: '⚡'
  },
  {
    title: 'Конденсаторы',
    desc: 'Керамика, электролиты, тантал. SMD и выводные от Murata, TDK, Samwha.',
    href: '/kondensatory',
    icon: '🔋'
  },
  {
    title: 'Analog Devices',
    desc: 'АЦП, ЦАП, операционные усилители, RF-компоненты. Оригинал и кроссы.',
    href: '/analog-devices',
    icon: '📶'
  },
  {
    title: 'Xilinx (AMD)',
    desc: 'Spartan, Artix, Kintex, Virtex. Поставка и подбор аналогов Gowin/Efinix.',
    href: '/xilinx',
    icon: '🛡️'
  },
];

export default function PopularCategories() {
  return (
    <section className="py-24 px-4 bg-[#050807]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Каталог направлений</h2>
          <p className="text-gray-400 text-lg">Работаем со всеми типами компонентов. Выберите категорию или введите артикул в поиск.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.href} 
              href={cat.href}
              className="group block bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-8 hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">{cat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{cat.desc}</p>
              <span className="text-emerald-500 text-sm font-semibold group-hover:underline">
                Подробнее →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}