'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallbackModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');
 const [email, setEmail] = useState('');
 const [company, setCompany] = useState('');
 const [consent, setConsent] = useState(false);
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState('');
 const overlayRef = useRef<HTMLDivElement>(null);

 // Close on Escape
 useEffect(() => {
 const handleKey = (e: KeyboardEvent) => {
 if (e.key === 'Escape') onClose();
 };
 if (isOpen) document.addEventListener('keydown', handleKey);
 return () => document.removeEventListener('keydown', handleKey);
 }, [isOpen, onClose]);

 // Prevent body scroll when open
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => { document.body.style.overflow = ''; };
 }, [isOpen]);

 // Reset form on close
 useEffect(() => {
 if (!isOpen) {
 setTimeout(() => {
 setName('');
 setPhone('');
 setEmail('');
 setCompany('');
 setConsent(false);
 setLoading(false);
 setSuccess(false);
 setError('');
 }, 300);
 }
 }, [isOpen]);

 const formatPhone = (value: string) => {
 const digits = value.replace(/\D/g, '');
 if (digits.length === 0) return '';
 let formatted = '+7';
 if (digits.length > 1) formatted += ' ' + digits.substring(1, 4);
 if (digits.length > 4) formatted += ' ' + digits.substring(4, 7);
 if (digits.length > 7) formatted += ' ' + digits.substring(7, 9);
 if (digits.length > 9) formatted += ' ' + digits.substring(9, 11);
 return formatted;
 };

 const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const raw = e.target.value.replace(/\D/g, '');
 if (raw.length <= 11) {
 setPhone(raw);
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!name.trim() || phone.length < 10) {
 setError('Заполните имя и телефон');
 return;
 }
 if (!consent) {
 setError('Необходимо согласие на обработку данных');
 return;
 }

 setLoading(true);
 setError('');

 try {
 const res = await fetch('/api/callback', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 name: name.trim(),
 phone: formatPhone(phone),
 email: email.trim(),
 company: company.trim(),
 }),
 });

 if (!res.ok) {
 const data = await res.json();
 throw new Error(data.error || 'Ошибка отправки');
 }

 setSuccess(true);
 } catch (err: any) {
 setError(err.message || 'Произошла ошибка');
 } finally {
 setLoading(false);
 }
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 ref={overlayRef}
 className="fixed inset-0 z-[100] flex items-center justify-center p-4"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 onClick={(e) => {
 if (e.target === overlayRef.current) onClose();
 }}
 >
 {/* Backdrop */}
 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

 {/* Modal */}
 <motion.div
 className="relative w-full max-w-md bg-[#f0f4ee] rounded-2xl shadow-2xl overflow-hidden"
 initial={{ scale: 0.9, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.9, opacity: 0, y: 20 }}
 transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
 >
 {/* Green header */}
 <div className="bg-gradient-to-r from-[#02a391] to-[#04c4a5] px-6 pt-6 pb-5 text-white relative">
 <button
 onClick={onClose}
 className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f4ee]/20 hover:bg-[#f0f4ee]/30 transition-colors"
 aria-label="Закрыть"
 >
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 <h2 className="text-xl font-bold mb-1">Оставьте заявку</h2>
 <p className="text-white/80 text-sm">Наш менеджер свяжется с Вами в ближайшее время</p>
 </div>

 {/* Body */}
 <div className="px-6 py-5">
 {/* Info badge */}
 <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-[#eaf0e8] rounded-lg">
 <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
 <span className="text-xs text-[#555]">Работаем только с юридическими лицами</span>
 </div>

 {success ? (
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center py-6"
 >
 <div className="w-16 h-16 bg-[#02a391]/10 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <h3 className="text-lg font-bold text-[#121212] mb-2">Заявка отправлена!</h3>
 <p className="text-sm text-[#555]">Мы перезвоним вам в ближайшее время</p>
 <button
 onClick={onClose}
 className="mt-5 px-6 py-2.5 bg-[#02a391] hover:bg-[#028a7a] text-white rounded-xl text-sm font-semibold transition-colors"
 >
 Закрыть
 </button>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-3.5">
 <div>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Имя *"
 required
 className="w-full px-4 py-3 bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-[#02a391] focus:ring-1 focus:ring-[#02a391]/20 transition-colors"
 />
 </div>
 <div>
 <input
 type="tel"
 value={formatPhone(phone)}
 onChange={handlePhoneChange}
 placeholder="Телефон *"
 required
 className="w-full px-4 py-3 bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-[#02a391] focus:ring-1 focus:ring-[#02a391]/20 transition-colors"
 />
 </div>
 <div>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="E-Mail"
 className="w-full px-4 py-3 bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-[#02a391] focus:ring-1 focus:ring-[#02a391]/20 transition-colors"
 />
 </div>
 <div>
 <input
 type="text"
 value={company}
 onChange={(e) => setCompany(e.target.value)}
 placeholder="Компания"
 className="w-full px-4 py-3 bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-[#02a391] focus:ring-1 focus:ring-[#02a391]/20 transition-colors"
 />
 </div>

 {/* Consent checkbox */}
 <label className="flex items-start gap-2.5 cursor-pointer group">
 <div className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
 consent ? 'bg-[#02a391] border-[#02a391]' : 'border-[#cbcbcb] group-hover:border-[#02a391]'
 }`}>
 {consent && (
 <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 )}
 </div>
 <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="sr-only" />
 <span className="text-[11px] text-[#999] leading-relaxed">
 Нажимая кнопку &laquo;Заказать звонок&raquo;, вы даете согласие на обработку персональных данных и соглашаетесь с политикой конфиденциальности
 </span>
 </label>

 {/* Error message */}
 {error && (
 <p className="text-xs text-red-500">{error}</p>
 )}

 {/* Submit button */}
 <button
 type="submit"
 disabled={loading || !consent}
 className="w-full py-3 bg-gradient-to-r from-[#02a391] to-[#04c4a5] hover:from-[#02907f] hover:to-[#03b095] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#02a391]/25 hover:shadow-[#02a391]/40"
 >
 {loading ? (
 <span className="flex items-center justify-center gap-2">
 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
 </svg>
 Отправка...
 </span>
 ) : 'Свяжитесь со мной'}
 </button>
 </form>
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
