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
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">📞</div>
              <div>
                <h3 className="text-sm font-semibold text-[#121212]">Телефон</h3>
                <a href="tel:+79103219191" className="text-[#555] text-sm hover:text-primary transition-colors">+7 (910) 321-91-91</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">📧</div>
              <div>
                <h3 className="text-sm font-semibold text-[#121212]">Email</h3>
                <a href="mailto:info@chip-net.ru" className="text-primary text-sm hover:text-primary-dark transition-colors">info@chip-net.ru</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">📍</div>
              <div>
                <h3 className="text-sm font-semibold text-[#121212]">Офис</h3>
                <p className="text-[#555] text-sm">308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">⏱️</div>
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
