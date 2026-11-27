import { redirect } from 'next/navigation';

// Гарантированный серверный редирект /contacts → /kontakty
// Дублирует next.config.ts redirects() для надёжности (если middleware перехватит раньше)
export default function ContactsRedirect() {
  redirect('/kontakty');
}
