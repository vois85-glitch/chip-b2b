export default function Contacts() {
  return (
    <section id="contacts" className="py-24 px-4 bg-[#050807]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Контакты</h2>
          <p className="text-gray-400 text-lg">Свяжитесь с нами для обсуждения вашего проекта</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Левая часть - Информация */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-900/20 rounded-xl flex items-center justify-center text-2xl shrink-0">📞</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Телефон</h3>
                <a href="tel:+79103219191" className="text-gray-400 hover:text-emerald-400 transition-colors block">+7 (910) 321-91-91</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-900/20 rounded-xl flex items-center justify-center text-2xl shrink-0">📧</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <a href="mailto:vois85@yandex.ru" className="text-emerald-400 hover:text-emerald-300 transition-colors block">vois85@yandex.ru</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-900/20 rounded-xl flex items-center justify-center text-2xl shrink-0">📍</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Офис (Юридический и фактический)</h3>
                <p className="text-gray-400">308033, г. Белгород, ул. Шаландина, дом 4, корпус 3, офис 8</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-900/20 rounded-xl flex items-center justify-center text-2xl shrink-0">⏱️</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Режим работы</h3>
                <p className="text-gray-400">Пн-Пт: 9:00 - 18:00 (МСК)</p>
              </div>
            </div>
          </div>

          {/* Правая часть - Яндекс Карта */}
          <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-3xl overflow-hidden h-[400px] relative">
            {/* Фильтр для темной темы карты */}
            <div className="absolute inset-0 z-10 pointer-events-none border-2 border-transparent rounded-3xl" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }}></div>
            
            <iframe 
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A3e4f8e9dd1c4b1b1a4d0c7f8e9dd1c4b1b1a4d0c7f8e9dd1c4b1b1a4d0c7&source=constructor&z=16&text=Белгород%2C%20Шаландина%204%20к3" 
              width="100%" 
              height="100%" 
              frameBorder="0"
              style={{ filter: 'grayscale(80%) contrast(1.1) brightness(0.8)' }}
              title="Офис ООО Деловой Партнёр"
            ></iframe>
          </div>
        </div>

        {/* Реквизиты под картой */}
        <div className="mt-12 bg-emerald-950/10 border border-emerald-900/30 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6 text-emerald-400">Реквизиты компании</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-300 text-sm">
            <p><span className="text-gray-500">Полное наименование:</span> ООО «Деловой Партнёр»</p>
            <p><span className="text-gray-500">ИНН / КПП:</span> 3123341983 / 312301001</p>
            <p><span className="text-gray-500">ОГРН:</span> 1143123005838</p>
            <p><span className="text-gray-500">Юридический адрес:</span> 308033, г. Белгород, ул. Шаландина, дом 4, корпус 3, офис 8</p>
          </div>
        </div>

      </div>
    </section>
  );
}