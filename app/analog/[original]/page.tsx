import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

type Component = {
 sku: string;
 name: string;
 brand: string;
 category: string;
 description: string;
 status: string;
 analogs: string[];
};

type Props = {
 params: Promise<{ original: string }>;
};

// Common analog mappings for SEO
const analogMappings: Record<string, {
 title: string;
 description: string;
 h1: string;
 text: string;
 analogs: { original: string; replacement: string; manufacturer: string; compatibility: string }[];
 faq: { question: string; answer: string }[];
}> = {
 "stm32f103-gd32f103": {
 title: "Аналог STM32F103 — GD32F103 | Кросс-референс замена",
 description: "GD32F103 — полный аналог STM32F103 с совместимостью pin-to-pin и программной. Сравнение параметров, миграция проектов, проверка в СВП.",
 h1: "GD32F103 как аналог STM32F103",
 text: "GD32F103 от Gigadevice Semiconductor является полным аналогом STM32F103 от STMicroelectronics с совместимостью pin-to-pin, программной и периферийной. Микроконтроллер построен на ядре ARM Cortex-M3 с рабочей частотой до 108 МГц (STM32F103 — 72 МГц). Область применения: промышленная автоматика, системы управления двигателями, измерительные приборы. Для миграции проекта достаточно заменить заголовочные файлы и пересобрать прошивку. Компоненты GD32 доступны без санкционных ограничений.",
 analogs: [
 { original: "STM32F103C8T6", replacement: "GD32F103C8T6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F103RBT6", replacement: "GD32F103RBT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F103VET6", replacement: "GD32F103VET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F103ZET6", replacement: "GD32F103ZET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 ],
 faq: [
 { question: "Полностью ли совместим GD32F103 со STM32F103?", answer: "Да, GD32F103 совместим pin-to-pin и программно с STM32F103. Периферийные регистры идентичны, прошивка может быть пересобрана без изменения кода." },
 { question: "В чём разница между STM32F103 и GD32F103?", answer: "Основное отличие — максимальная частота: GD32F103 работает до 108 МГц против 72 МГц у STM32F103. Остальные параметры аналогичны." },
 { question: "Нужна ли перекладка платы при замене?", answer: "Нет, замена не требует изменений в разводке платы — корпуса и расположение выводов идентичны." },
 ],
 },
 "stm32f407-gd32f407": {
 title: "Аналог STM32F407 — GD32F407 | Кросс-референс замена",
 description: "GD32F407 — полный аналог STM32F407. ARM Cortex-M4, совместимость pin-to-pin. Миграция проектов, проверка в СВП.",
 h1: "GD32F407 как аналог STM32F407",
 text: "GD32F407 от Gigadevice — полный аналог STM32F407 от STMicroelectronics на базе ARM Cortex-M4 с FPU и частотой до 168 МГц. Полная совместимость pin-to-pin и программная позволяет заменить STM32F407 без перекладки платы и переписывания прошивки. Компоненты GD32 доступны без санкционных ограничений и являются оптимальным решением для импортозамещения.",
 analogs: [
 { original: "STM32F407VGT6", replacement: "GD32F407VGT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F407ZGT6", replacement: "GD32F407ZGT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F407VET6", replacement: "GD32F407VET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 ],
 faq: [
 { question: "Совместим ли GD32F407 по периферии?", answer: "Да, все периферийные модули (UART, SPI, I2C, CAN, USB, Ethernet) идентичны по регистрам." },
 { question: "Поддерживает ли GD32F407 DSP инструкции?", answer: "Да, ядро ARM Cortex-M4 с FPU поддерживает DSP инструкции аналогично STM32F407." },
 ],
 },
 "spartan-6-gowin": {
 title: "Аналог Xilinx Spartan-6 — Gowin | Кросс-референс FPGA",
 description: "ПЛИС Gowin GW1N/GW2A как аналоги Xilinx Spartan-6. Миграция проектов, совместимость, проверка в СВП.",
 h1: "Gowin как аналог Xilinx Spartan-6",
 text: "ПЛИС Gowin Semiconductor серий GW1N и GW2A являются альтернативой Xilinx Spartan-6 для проектов, требующих доступных FPGA. Gowin предлагает инструменты миграции проектов (Gowin EDA), поддерживающие импорт VHDL/Verilog из Xilinx ISE/Vivado. Серии GW1N компактные (от 1K до 55K LUT), GW2A — среднего класса (от 20K до 200K LUT). Gowin доступен без санкционных ограничений.",
 analogs: [
 { original: "XC6SLX9", replacement: "GW1N-9", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
 { original: "XC6SLX16", replacement: "GW1N-16", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
 { original: "XC6SLX45", replacement: "GW2A-55", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
 ],
 faq: [
 { question: "Насколько сложно мигрировать проект с Spartan-6 на Gowin?", answer: "Миграция зависит от сложности проекта. Синтезируемый HDL-код переносится легко. IP-ядра Xilinx требуют замены на аналогичные от Gowin." },
 ],
 },
};

export async function generateStaticParams() {
 return Object.keys(analogMappings).map((original) => ({ original }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { original } = await params;
 const mapping = analogMappings[original];

 if (!mapping) {
 return { title: 'Кросс-референс не найден' };
 }

 const url = `${BASE_URL}/analog/${original}`;

 return {
 title: mapping.title,
 description: mapping.description,
 alternates: { canonical: url },
 openGraph: {
 title: mapping.title,
 description: mapping.description,
 url,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
 };
}

export default async function AnalogPage({ params }: Props) {
 const { original } = await params;
 const mapping = analogMappings[original];

 if (!mapping) {
 notFound();
 }

 const url = `${BASE_URL}/analog/${original}`;

 // Try to find components from DB
 let components: Component[] = [];
 const { data } = await supabase
.from('components')
.select('*')
.or(`sku.ilike.%${original.split('-')[0]}%,name.ilike.%${original.split('-')[0]}%`)
.limit(20);
 if (data) components = data as Component[];

 const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'Подбор аналогов', item: `${BASE_URL}/analogs` },
 { '@type': 'ListItem', position: 3, name: mapping.h1, item: url },
 ],
 };

 const faqLd = mapping.faq.length > 0 ? {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: mapping.faq.map((f) => ({
 '@type': 'Question',
 name: f.question,
 acceptedAnswer: { '@type': 'Answer', text: f.answer },
 })),
 } : null;

 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
 {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
 <main className="min-h-screen bg-background text-[#121212]">
 <section className="pt-32 pb-16 px-4">
 <div className="max-w-7xl mx-auto">
 <nav className="text-sm text-[#666] mb-6 flex items-center gap-2">
 <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
 <span className="text-[#cbcbcb]">/</span>
 <Link href="/analogs" className="hover:text-primary transition-colors">Подбор аналогов</Link>
 <span className="text-[#cbcbcb]">/</span>
 <span className="text-[#333]">{mapping.h1}</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 {mapping.h1}
 </h1>
 <p className="text-lg text-[#666] max-w-3xl mb-8">{mapping.description}</p>
 </div>
 </section>

 <section className="px-4 pb-12">
 <div className="max-w-7xl mx-auto">
 <ComponentSearch />
 </div>
 </section>

 {/* Cross-reference table */}
 <section className="px-4 pb-16">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">Таблица кросс-референсов</h2>
 <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
 <th className="text-left py-4 px-4 text-[#666] font-medium">Оригинал</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Аналог</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Производитель</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Совместимость</th>
 </tr>
 </thead>
 <tbody>
 {mapping.analogs.map((a, i) => (
 <tr key={i} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
 <td className="py-3 px-4">
 <Link href={`/component/${a.original}`} className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors">
 {a.original}
 </Link>
 </td>
 <td className="py-3 px-4">
 <Link href={`/component/${a.replacement}`} className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors">
 {a.replacement}
 </Link>
 </td>
 <td className="py-3 px-4 text-[#333]">{a.manufacturer}</td>
 <td className="py-3 px-4">
 <span className="px-2 py-1 rounded-full bg-section-alt text-primary text-xs">{a.compatibility}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </section>

 {/* SEO Text */}
 <section className="px-4 pb-16">
 <div className="max-w-4xl mx-auto">
 <p className="text-[#333] leading-relaxed text-lg">{mapping.text}</p>
 </div>
 </section>

 {/* FAQ */}
 {mapping.faq.length > 0 && (
 <section className="px-4 pb-16">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
 <div className="space-y-4">
 {mapping.faq.map((f, i) => (
 <div key={i} className="bg-[#f0f4ee] border border-[#d4ddd2] rounded-xl p-6">
 <h3 className="font-semibold text-[#121212] mb-2">{f.question}</h3>
 <p className="text-[#555] leading-relaxed">{f.answer}</p>
 </div>
 ))}
 </div>
 </div>
 </section>
 )}

 {/* CTA */}
 <section className="px-4 pb-20">
 <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
 <h2 className="text-2xl md:text-3xl font-bold mb-4">Нужна помощь с подбором аналогов?</h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 Отправьте BOM — проанализируем спецификацию, подберём аналоги и проверим совместимость.
 </p>
 <Link
 href="/#bom"
 className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Отправить BOM
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 </div>
 </section>
 </main>
 </>
 );
}
