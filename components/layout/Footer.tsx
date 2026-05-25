import Link from 'next/link'; // <-- Добавили импорт Link

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-black border-t border-emerald-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Колонка 1: Новый кликабельный логотип */}
          <div>
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-8 h-8 text-emerald-500 group-hover:text-emerald-400 transition-colors">
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
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Chip<span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">Net</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mt-4 ml-1">
              Поставка оригинальных электронных компонентов и промышленного оборудования для ВПК и производства.
            </p>
          </div>

          {/* Колонка 2: Навигация */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Навигация</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="#search" className="hover:text-emerald-400 transition-colors">Поиск компонентов</a>
              <a href="#bom" className="hover:text-emerald-400 transition-colors">Загрузить BOM</a>
              <a href="#about" className="hover:text-emerald-400 transition-colors">О компании</a>
              <a href="#contacts" className="hover:text-emerald-400 transition-colors">Контакты</a>
            </div>
          </div>

          {/* Колонка 3: Контакты */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-300">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="tel:+79103219191" className="hover:text-emerald-400 transition-colors">+7 (910) 321-91-91</a>
              <a href="mailto:vois85@yandex.ru" className="hover:text-emerald-400 transition-colors">vois85@yandex.ru</a>
              <span>г. Белгород, ул. Шаландина, 4 к3 оф8</span>
            </div>
          </div>
        </div>

        {/* Юридическая строка */}
        <div className="border-t border-emerald-900/20 pt-6 text-xs text-gray-600 text-center md:text-left flex flex-col md:flex-row justify-between gap-4">
          <div>
            © {new Date().getFullYear()} ООО «Деловой Партнёр». Все права защищены. ИНН 3123341983, ОГРН 1143123005838
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
}