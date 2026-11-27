// components/ui/ProductCard.tsx
// Единая карточка товара — 2026-10-31.
// Требование заказчика: товары НИГДЕ не должны выглядеть текстовым списком —
// только карточками с зоной фотографии (как на overview /catalog).
// Используется на /brand/[slug], /catalog/<parent>/<child> и других витринах.
import Link from 'next/link';
import ComponentImage from '@/components/ui/ComponentImage';

export type ProductCardData = {
  sku: string;
  name: string;
  brand: string;
  category?: string;
  status?: string;
  attributes?: Record<string, string> | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const url = `/component/${encodeURIComponent(product.sku)}`;
  const isEol = Boolean(product.status && product.status !== 'В производстве');
  return (
    <div className="group bg-white border border-[#e4eae2] rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-200 flex flex-col">
      {/* Зона фотографии компонента */}
      <Link
        prefetch={false}
        href={url}
        className="relative flex items-center justify-center h-32 bg-white border-b border-[#eef2ec] overflow-hidden"
      >
        <ComponentImage
          sku={product.sku}
          name={product.name}
          category={product.category || ''}
          size={96}
          attributes={product.attributes || null}
          className="w-24 h-24 transition-transform duration-300 group-hover:scale-105"
        />
        {isEol && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
            EOL
          </span>
        )}
      </Link>

      {/* Тело карточки */}
      <div className="flex-1 p-4 flex flex-col">
        <Link prefetch={false} href={url}>
          <span className="font-mono font-bold text-sm text-[#121212] hover:text-primary transition-colors leading-tight break-all">
            {product.sku}
          </span>
        </Link>
        {product.name && (
          <p className="text-[#666] text-xs leading-relaxed line-clamp-2 mt-1 min-h-[2rem]">
            {product.name}
          </p>
        )}
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
          <span className="px-2 py-0.5 bg-[#eaf5f2] rounded-full text-[10px] text-primary-dark font-medium">
            {product.brand}
          </span>
          {product.category && (
            <span className="px-2 py-0.5 bg-[#f4f6f3] border border-[#e9eee7] rounded-full text-[10px] text-[#555] truncate max-w-[150px]">
              {product.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
