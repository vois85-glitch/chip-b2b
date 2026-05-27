'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { submitRequest } from '@/app/actions/request-action';

export default function BomUpload() {
  const [fileName, setFileName] = useState('');
  
  const [state, formAction, isPending] = useActionState(submitRequest, { success: false, message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="bom" className="py-6 px-4 bg-section-alt relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Запрос коммерческого предложения</h2>
          <p className="text-[#555] text-sm">Загрузите BOM-лист или опишите необходимые компоненты</p>
        </div>

        <motion.form 
          action={formAction}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-4 md:p-6 shadow-lg"
        >
          {state.message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-4 px-4 py-3 rounded-lg text-center text-sm font-semibold ${
                state.success ? 'bg-section-alt border border-primary/30 text-primary' : 'bg-red-50 border border-danger/30 text-danger'
              }`}
            >
              {state.message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">Компания</label>
              <input 
                type="text" 
                name="company_name"
                required
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="ООО Инжиниринг"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">ИНН</label>
              <input 
                type="text" 
                name="inn"
                required
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="7712345678"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="info@company.ru"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">Телефон</label>
              <input 
                type="tel" 
                name="phone"
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-[#333] mb-1">Список компонентов или комментарий</label>
            <textarea 
              name="message"
              rows={3}
              className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
              placeholder="STM32F103C8T6 - 500 шт, LM7805CT - 200 шт..."
            />
          </div>

          <input type="hidden" name="bom_file_name" value={fileName} />

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#333] mb-1">Прикрепить BOM-лист</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[#cbcbcb] rounded-xl cursor-pointer hover:bg-section-alt hover:border-primary/50 transition-all">
                <div className="flex flex-col items-center justify-center py-2">
                  <svg className="w-6 h-6 mb-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <p className="text-xs text-[#555]">
                    {fileName ? <span className="font-semibold text-primary">{fileName}</span> : <span>Перетащите файл или <span className="text-primary underline">выберите</span></span>}
                  </p>
                </div>
                <input type="file" className="hidden" accept=".xlsx,.csv,.pdf,.xls" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg duration-300 text-white ${
              isPending ? 'bg-primary/60 cursor-wait' : 'bg-primary hover:bg-primary-dark shadow-primary/25 hover:shadow-primary/40'
            }`}
          >
            {isPending ? 'Отправка...' : 'Получить предложение'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
