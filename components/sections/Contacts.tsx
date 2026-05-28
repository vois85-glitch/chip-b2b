export default function Contacts() {
 return (
 <section id="contacts" className="py-6 px-4 bg-[#f0f4ee]">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-4">
 <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Контакты</h2>
 <p className="text-[#555] text-sm">Свяжитесь с нами для обсуждения вашего проекта</p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 <div className="space-y-4">
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-[#121212]">Телефон</h3>
 <a href="tel:+79103219191" className="text-[#555] text-sm hover:text-primary transition-colors">+7 (910) 321-91-91</a>
 </div>
 </div>

 <div className="flex items-start gap-3">
 <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-[#121212]">Email</h3>
 <a href="mailto:info@chip-net.ru" className="text-primary text-sm hover:text-primary-dark transition-colors">info@chip-net.ru</a>
 </div>
 </div>

 <div className="flex items-start gap-3">
 <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-[#121212]">Офис</h3>
 <p className="text-[#555] text-sm">308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8</p>
 </div>
 </div>

 <div className="flex items-start gap-3">
 <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-[#121212]">Режим работы</h3>
 <p className="text-[#555] text-sm">Пн-Пт: 9:00 - 18:00 (МСК)</p>
 </div>
 </div>
 </div>

 <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl overflow-hidden h-[200px] relative shadow-sm">
 <iframe
 src="https://yandex.ru/map-widget/v1/?um=constructor%3A3e4f8e9dd1c4b1b1a4d0c7f8e9dd1c4b1b1a4d0c7f8e9dd1c4b1b1a4d0c7&source=constructor&z=16&text=Белгород%2C%20Шаландина%204%20к3"
 width="100%"
 height="100%"
 frameBorder="0"
 title="Офис ООО Деловой Партнёр"
 ></iframe>
 </div>
 </div>

 <div className="mt-4 bg-section-alt border border-[#bbd3ba] rounded-xl p-4">
 <h3 className="text-sm font-bold mb-3 text-primary">Реквизиты компании</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[#333] text-xs">
 <p><span className="text-[#555]">Наименование:</span> ООО «Деловой Партнёр»</p>
 <p><span className="text-[#555]">ИНН / КПП:</span> 3123341983 / 312301001</p>
 <p><span className="text-[#555]">ОГРН:</span> 1143123005838</p>
 <p><span className="text-[#555]">Адрес:</span> 308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8</p>
 </div>
 </div>

 </div>
 </section>
 );
}
