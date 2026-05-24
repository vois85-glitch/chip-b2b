'use server'

import { supabase } from '@/lib/supabase'

export async function submitRequest(prevState: any, formData: FormData) {
  const companyName = formData.get('company_name') as string
  const inn = formData.get('inn') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const message = formData.get('message') as string
  const bomFileName = formData.get('bom_file_name') as string

  // 1. Сохраняем заявку в Supabase
  const { error } = await supabase.from('requests').insert([
    { company_name: companyName, inn, email, phone, message, bom_file_name: bomFileName, status: 'Новая' }
  ])

  if (error) {
    console.error('Ошибка сохранения заявки:', error)
    return { success: false, message: 'Произошла ошибка при отправке. Попробуйте позже.' }
  }

  // 2. Отправляем уведомление в Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (botToken && chatId) {
    const text = `🔥 *НОВАЯ ЗАЯВКА НА ЧИПЫ!*\n\n` +
      `🏢 *Компания:* ${companyName}\n` +
      `🔢 *ИНН:* ${inn}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *Телефон:* ${phone || 'Не указан'}\n\n` +
      `📝 *Запрос:*\n${message || 'Без комментария'}\n\n` +
      `📎 *BOM-лист:* ${bomFileName || 'Не прикреплен'}`

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' })
      })
    } catch (tgError) {
      console.error('Ошибка отправки в Telegram:', tgError)
    }
  }

  // Возвращаем успех (без перезагрузки страницы!)
  return { success: true, message: '✓ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' }
}