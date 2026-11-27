import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
 try {
 const body = await req.json();
 const { name, phone, email, company } = body;

 if (!name || !phone) {
 return NextResponse.json(
 { error: 'Имя и телефон обязательны' },
 { status: 400 }
 );
 }

 const botToken = process.env.TELEGRAM_BOT_TOKEN;
 const chatId = process.env.TELEGRAM_CHAT_ID;

 if (!botToken || !chatId) {
 console.error('Telegram credentials not configured');
 return NextResponse.json(
 { error: 'Сервис временно недоступен' },
 { status: 500 }
 );
 }

 const text = [
 '📞 <b>Заявка на обратный звонок</b>',
 '',
 `👤 <b>Имя:</b> ${escapeHtml(name)}`,
 `📱 <b>Телефон:</b> ${escapeHtml(phone)}`,
 email ? `📧 <b>E-Mail:</b> ${escapeHtml(email)}` : '',
 company ? `🏢 <b>Компания:</b> ${escapeHtml(company)}` : '',
 '',
 `🕐 <i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</i>`,
 ].filter(Boolean).join('\n');

 const tgResponse = await fetch(
 `https://api.telegram.org/bot${botToken}/sendMessage`,
 {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 chat_id: chatId,
 text,
 parse_mode: 'HTML',
 }),
 }
 );

 if (!tgResponse.ok) {
 const errText = await tgResponse.text();
 console.error('Telegram API error:', errText);
 return NextResponse.json(
 { error: 'Ошибка отправки уведомления' },
 { status: 500 }
 );
 }

 return NextResponse.json({ success: true });
 } catch (error) {
 console.error('Callback form error:', error);
 return NextResponse.json(
 { error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 );
 }
}

function escapeHtml(text: string): string {
 return text
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;');
}
