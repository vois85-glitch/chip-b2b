'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitRequest } from '@/app/actions/request-action';

export default function BomUpload() {
  const searchParams = useSearchParams();
  const [fileName, setFileName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Проверяем, вернулись ли мы после успешной отправки
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setIsSuccess(true);
      const timer = setTimeout(() => setIsSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="bom" className="py-24 px-4 bg-[#050807] relative overflow-hidden">
      {/* Декоративное свечение */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[200px] opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Запрос коммерческого предложения</h2>
          <p className="text-gray-400 text-lg">Загрузите ваш BOM-лист (Excel/CSV) или опишите необходимые компоненты</p>
        </div>

        {/* Уведомление об успехе */}
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-green-900/30 border border-green-500/50 text-green-300 px-6 py-4 rounded-xl text-center text-lg font-semibold backdrop-blur-md"
          >
            ✓ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
          </motion.div>
        )}

        <motion.form 
          action={submitRequest}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-emerald-950/10 backdrop-blur-xl border border-emerald-900/30 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Компания</label>
              <input 
                type="text" 
                name="company_name"
                required
                className="w-full bg-black/40 border border-emerald-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="ООО Инжиниринг"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ИНН</label>
              <input 
                type="text" 
                name="inn"
                required
                className="w-full bg-black/40 border border-emerald-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="7712345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full bg-black/40 border border-emerald-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="info@company.ru"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
              <input 
                type="tel" 
                name="phone"
                className="w-full bg-black/40 border border-emerald-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Список компонентов или комментарий</label>
            <textarea 
              name="message"
              rows={4}
              className="w-full bg-black/40 border border-emerald-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              placeholder="STM32F103C8T6 - 500 шт, LM7805CT - 200 шт..."
            />
          </div>

          {/* Скрытое поле для имени файла */}
          <input type="hidden" name="bom_file_name" value={fileName} />

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Прикрепить BOM-лист (Excel, CSV, PDF)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-emerald-800/50 rounded-2xl cursor-pointer hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <p className="mb-1 text-sm text-gray-400">
                    {fileName ? <span className="font-semibold text-emerald-400">{fileName}</span> : <span>Перетащите файл сюда или <span className="text-emerald-400 underline">выберите</span></span>}
                  </p>
                  <p className="text-xs text-gray-500">XLSX, CSV, PDF (MAX. 10MB)</p>
                </div>
                <input type="file" className="hidden" accept=".xlsx,.csv,.pdf,.xls" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40"
          >
            Получить предложение
          </button>
        </motion.form>
      </div>
    </section>
  );
}