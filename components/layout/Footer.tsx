export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-[#050807] border-t border-emerald-900/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center font-bold text-white">C</div>
          <span className="text-xl font-bold tracking-tight">ChipNet</span>
        </div>
        
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-emerald-400 transition-colors">Каталог</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">О компании</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Доставка</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Контакты</a>
        </div>

        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} ChipNet. Все права защищены.
        </div>
      </div>
    </footer>
  );
}