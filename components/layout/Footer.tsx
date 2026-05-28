"use client";

import { useState } from "react";
import Link from "next/link";

const catalogCategories = [
 { name: "Микросхемы", slug: "mikroshemy" },
 { name: "Микроконтроллеры", slug: "arm-kontrollery" },
 { name: "ПЛИС (FPGA)", slug: "fpga" },
 { name: "Транзисторы", slug: "tranzistory" },
 { name: "MOSFET", slug: "mosfet" },
 { name: "IGBT", slug: "igbt" },
 { name: "Диоды", slug: "diody" },
 { name: "Конденсаторы", slug: "kondensatory" },
 { name: "Резисторы", slug: "rezistory" },
 { name: "АЦП / ЦАП", slug: "adc-dac" },
 { name: "Стабилизаторы", slug: "stabilizatory" },
 { name: "Операционные усилители", slug: "operatsionnye-usiliteli" },
 { name: "Разъёмы", slug: "razemy" },
 { name: "Датчики", slug: "datchiki" },
 { name: "Оптоэлектроника", slug: "optoelektronika" },
 { name: "Питание", slug: "pitaniya" },
 { name: "Телекоммуникации", slug: "telekommunikatsii" },
 { name: "Память", slug: "pamyat" },
 { name: "Логика", slug: "logika" },
 { name: "Реле", slug: "rele" },
 { name: "Интерфейсы", slug: "interfeysy" },
 { name: "Модули и платы", slug: "moduli-i-platy" },
 { name: "Переключатели", slug: "pereklyuchateli" },
 { name: "Кварцы и резонаторы", slug: "kvartsy-i-rezonatory" },
 { name: "Предохранители", slug: "predokhraniteli" },
 { name: "Индуктивности", slug: "induktivnosti" },
 { name: "Кабели и провода", slug: "kabeli-i-provoda" },
 { name: "Фильтры", slug: "filtry" },
 { name: "Трансформаторы", slug: "transformatory" },
 { name: "Электроавтоматика", slug: "elektroavtomatika" },
 { name: "Монтаж и аксессуары", slug: "montazh-i-aksessuary" },
];

const serviceLinks = [
 { name: "Подбор аналогов", href: "/analogs" },
 { name: "Снятые с производства (EOL)", href: "/obsolete" },
 { name: "Даташиты компонентов", href: "/datasheets" },
 { name: "BOM-комплектация", href: "/bom" },
 { name: "Импортозамещение", href: "/importozameshchenie" },
 { name: "Проверка компонентов", href: "/proverka-komponentov" },
 { name: "Отраслевые решения", href: "/industries" },
 { name: "База знаний", href: "/knowledge-base" },
];

export default function Footer() {
 const [catalogOpen, setCatalogOpen] = useState(false);

 return (
 <footer className="py-8 px-4 bg-section-accent border-t border-[#bbd3ba]">
 <div className="max-w-7xl mx-auto">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
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
 <span className="text-xl font-bold tracking-tight text-[#121212] group-hover:text-primary transition-colors">
 Chip<span className="text-primary group-hover:text-primary-dark transition-colors">Net</span>
 </span>
 </Link>
 <p className="text-sm text-[#555] leading-relaxed mt-4 ml-1">
 Поставка оригинальных электронных компонентов для промышленности. Импортозамещение, подбор аналогов, проверка в лаборатории СВП.
 </p>
 </div>

 {/* Колонка 2: Навигация */}
 <div>
 <h4 className="font-semibold mb-4 text-[#121212]">Навигация</h4>
 <div className="flex flex-col gap-2 text-sm text-[#555]">
 <Link href="/catalog" className="hover:text-primary transition-colors">Каталог компонентов</Link>
 <Link href="/brands" className="hover:text-primary transition-colors">Производители</Link>
 <a href="#search" className="hover:text-primary transition-colors">Поиск компонентов</a>
 <a href="#bom" className="hover:text-primary transition-colors">Загрузить BOM</a>
 <a href="#about" className="hover:text-primary transition-colors">О компании</a>
 <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
 </div>
 </div>

 {/* Колонка 3: Услуги */}
 <div>
 <h4 className="font-semibold mb-4 text-[#121212]">Услуги</h4>
 <div className="flex flex-col gap-2 text-sm text-[#555]">
 {serviceLinks.map((link) => (
 <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
 {link.name}
 </Link>
 ))}
 </div>
 </div>

 {/* Колонка 4: Контакты */}
 <div>
 <h4 className="font-semibold mb-4 text-[#121212]">Контакты</h4>
 <div className="flex flex-col gap-2 text-sm text-[#555]">
 <a href="tel:+79103219191" className="hover:text-primary transition-colors">+7 (910) 321-91-91</a>
 <a href="mailto:info@chip-net.ru" className="hover:text-primary transition-colors">info@chip-net.ru</a>
 <span>г. Белгород, ул. Шаландина, 4 к3 оф8</span>
 <span className="text-xs text-[#555] mt-2">ИНН 3123341983, ОГРН 1143123005838</span>
 </div>
 </div>
 </div>

 {/* Каталог — на мобильных сворачивается под кнопку */}
 <div className="mb-6">
 <button
 onClick={() => setCatalogOpen(!catalogOpen)}
 className="md:hidden w-full flex items-center justify-between font-semibold mb-3 text-[#121212] cursor-pointer"
 >
 <span>Каталог</span>
 <svg
 className={`w-4 h-4 text-[#555] transition-transform duration-200 ${catalogOpen ? "rotate-180" : ""}`}
 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
 >
 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
 </svg>
 </button>

 <h4 className="hidden md:block font-semibold mb-3 text-[#121212]">Каталог</h4>

 <nav className={`flex flex-wrap gap-x-4 gap-y-1.5 ${catalogOpen ? "block" : "hidden"} md:flex`}>
 {catalogCategories.map((cat) => (
 <Link
 key={cat.slug}
 href={`/${cat.slug}`}
 className="text-sm text-[#555] hover:text-primary transition-colors"
 >
 {cat.name}
 </Link>
 ))}
 </nav>
 </div>

 {/* Юридическая строка */}
 <div className="border-t border-[#bbd3ba] pt-6 text-xs text-[#555] text-center md:text-left flex flex-col md:flex-row justify-between gap-4">
 <div>
 &copy; {new Date().getFullYear()} ООО &laquo;Деловой Партнёр&raquo;. Все права защищены. Поставка электронных компонентов для промышленности.
 </div>
 <div className="flex gap-4">
 <a href="#" className="hover:text-[#333]">Политика конфиденциальности</a>
 </div>
 </div>
 </div>
 </footer>
 );
}
