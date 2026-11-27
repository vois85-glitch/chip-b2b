'use client';

import { trackGoal } from '@/lib/metrika';

export default function Contacts() {
  return (
    <section id="contacts" className="py-6 px-4 bg-[#f0f4ee] scroll-mt-[195px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Контакты</h2>
          <p className="text-[#666] text-sm">Свяжитесь с нами для обсуждения вашего проекта</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">📞</div>
              <div>
                <h3 className="text-sm font-semibold text-[#121212]">Телефон</h3>
                <a href="tel:+79103219191" className="text-[#666] text-sm hover:text-primary transition-colors" onClick={() => trackGoal('lead_phone_click', { phone: '+79103219191' })}>+7 (910) 321-91-91</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">📧</div>
              <div>
                <h3 className="text-sm font-semibold text-[#121212]">Email</h3>
                <a href="mailto:info@chip-net.ru" className="text-primary text-sm hover:text-primary-dark transition-colors" onClick={() => trackGoal('lead_email_click', { email: 'info@chip-net.ru' })}>info@chip-net.ru</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">📍</div>
              <div>
                <h3 className="text-sm font-semibold text-[#121212]">Офис</h3>
                <p className="text-[#666] text-sm">308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-section-alt rounded-lg flex items-center justify-center text-xl shrink-0">⏱️</div>
              <div>
                <h3 className="text-sm font-semibold text-[#121212]">Режим работы</h3>
                <p className="text-[#666] text-sm">Пн-Пт: 9:00 - 18:00 (МСК)</p>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl overflow-hidden h-[200px] relative shadow-sm">
            <iframe loading="lazy"
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A619abb19c4c878892657356a3e329d1788ec96a002538002228dffa402cebfd0&source=constructor&z=16&text=%D0%91%D0%B5%D0%BB%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%2C%20%D0%A8%D0%B0%D0%BB%D0%B0%D0%BD%D0%B4%D0%B8%D0%BD%D0%B0%204%20%D0%BA3"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Офис ООО Деловой Партнёр"
            />
          </div>
        </div>

        <div className="mt-4 bg-section-alt border border-[#bbd3ba] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-sm font-bold text-primary">Реквизиты компании</h3>
            <a
              href="/requisites.pdf"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              onClick={() => trackGoal('requisites_pdf_download', { section: 'contacts' })}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Скачать реквизиты (PDF)
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[#333] text-xs">
            <p><span className="text-[#757575]">Наименование:</span> ООО «Деловой Партнёр»</p>
            <p><span className="text-[#757575]">ИНН / КПП:</span> 3123341983 / 312301001</p>
            <p><span className="text-[#757575]">ОГРН:</span> 1143123005838</p>
            <p><span className="text-[#757575]">Адрес:</span> 308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8</p>
          </div>
        </div>

      </div>
    </section>
  );
}
