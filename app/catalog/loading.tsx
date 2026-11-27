// app/catalog/loading.tsx — Скелетоны пока каталог грузится
export default function CatalogLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Загрузка каталога">
      {/* Скелетон hero-блока */}
      <div className="rounded-2xl border border-[#e8e8e8] bg-[#f0f4ee] px-6 py-7 mb-6">
        <div className="h-8 w-2/3 max-w-md bg-[#dde7db] rounded-lg mb-3" />
        <div className="h-4 w-1/3 max-w-xs bg-[#dde7db] rounded mb-4" />
        <div className="flex gap-2">
          <div className="h-7 w-36 bg-[#dde7db] rounded-full" />
          <div className="h-7 w-28 bg-[#dde7db] rounded-full" />
          <div className="h-7 w-32 bg-[#dde7db] rounded-full" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Скелетон сайдбара */}
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">
          <div className="bg-white border border-[#e8e8e8] rounded-xl p-4">
            <div className="h-3.5 w-24 bg-[#e6ede4] rounded mb-3" />
            <div className="h-9 w-full bg-[#eef2ec] rounded-lg mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 bg-[#eef2ec] rounded-lg" style={{ width: `${95 - (i % 3) * 8}%` }} />
              ))}
            </div>
          </div>
          <div className="bg-white border border-[#e8e8e8] rounded-xl p-4">
            <div className="h-3.5 w-20 bg-[#e6ede4] rounded mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-[#eef2ec] rounded-lg" style={{ width: `${90 - (i % 4) * 7}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Скелетон сетки карточек */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between bg-white border border-[#e8e8e8] rounded-xl px-4 py-3 mb-5">
            <div className="h-4 w-40 bg-[#e6ede4] rounded" />
            <div className="flex gap-2">
              <div className="h-9 w-40 bg-[#eef2ec] rounded-lg" />
              <div className="h-9 w-20 bg-[#eef2ec] rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
                <div className="h-32 bg-[#f0f4ee] border-b border-[#eef2ec]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-[#e6ede4] rounded" />
                  <div className="h-3 w-full bg-[#eef2ec] rounded" />
                  <div className="h-3 w-2/3 bg-[#eef2ec] rounded" />
                  <div className="flex gap-1.5 pt-1">
                    <div className="h-5 w-20 bg-[#eef2ec] rounded-full" />
                    <div className="h-5 w-24 bg-[#eef2ec] rounded-full" />
                  </div>
                  <div className="h-7 w-32 bg-[#e6ede4] rounded-md mt-2" />
                </div>
                <div className="px-4 pb-4 flex items-center gap-2">
                  <div className="h-6 w-24 bg-[#e6ede4] rounded" />
                  <div className="flex-1" />
                  <div className="h-9 w-9 bg-[#eef2ec] rounded-lg" />
                  <div className="h-9 w-28 bg-[#eef2ec] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
