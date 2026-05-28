import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Страница не найдена — 404',
 description: 'Запрашиваемая страница не найдена. Перейдите на главную или воспользуйтесь поиском.',
 robots: { index: false, follow: false },
};

export default function NotFound() {
 return (
 <main className="min-h-screen bg-background text-[#121212] flex items-center justify-center">
 <div className="text-center px-4 py-20">
 <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
 <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
 <p className="text-[#666] mb-8 max-w-md mx-auto">
 Запрашиваемая страница не существует или была перемещена. Попробуйте найти нужный компонент в каталоге.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/"
 className="px-8 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition-colors"
 >
 На главную
 </Link>
 <Link
 href="/catalog"
 className="px-8 py-3 border border-primary text-primary hover:bg-primary/5 rounded-lg font-semibold transition-colors"
 >
 Каталог компонентов
 </Link>
 </div>
 </div>
 </main>
 );
}
