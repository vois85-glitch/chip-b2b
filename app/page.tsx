import { supabase } from '@/lib/supabase'

export default async function Home() {
  // Получаем товары и ошибку из базы данных
  const { data: products, error } = await supabase.from('products').select('*')

  // Если пришла ошибка — выводим её в терминал
  if (error) {
    console.error("ОШИБКА SUPABASE:", error.message)
  }

  // Выводим в терминал то, что мы получили из базы
  console.log("Данные из базы:", products)

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Каталог компонентов</h1>
        
        {/* Если есть ошибка, покажем её на экране */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            Ошибка загрузки: {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Артикул: {product.sku}</p>
              <p className="text-sm text-gray-600 mt-2">{product.description}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">
                  {product.price ? `${product.price} ₽` : 'По запросу'}
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {product.stock}
                </span>
              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Запросить цену
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}