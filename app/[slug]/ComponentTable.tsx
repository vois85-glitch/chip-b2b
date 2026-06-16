'use client';

import Link from 'next/link';
import { cleanComponentText } from '@/lib/clean-text';

type Component = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  status: string;
  analogs: string[];
};

export default function ComponentTable({ components }: { components: Component[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
            <th className="text-left py-4 px-4 text-[#666] font-medium">SKU</th>
            <th className="text-left py-4 px-4 text-[#666] font-medium">Наименование</th>
            <th className="text-left py-4 px-4 text-[#666] font-medium">Бренд</th>
            <th className="text-left py-4 px-4 text-[#666] font-medium">Статус</th>
            <th className="text-left py-4 px-4 text-[#666] font-medium">Аналоги</th>
          </tr>
        </thead>
        <tbody>
          {components.map((comp) => (
            <tr key={comp.sku} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
              <td className="py-3 px-4">
                <Link
                  href={`/component/${comp.sku}`}
                  className="text-primary hover:text-primary-dark font-mono font-medium transition-colors"
                >
                  {comp.sku}
                </Link>
              </td>
              <td className="py-3 px-4 text-[#333] max-w-xs truncate">
                <Link href={`/component/${comp.sku}`} className="hover:text-primary transition-colors">
                  {cleanComponentText(comp.name)}
                </Link>
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/brand/${comp.brand.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-|-$/g, '')}`}
                  className="text-[#666] hover:text-primary transition-colors"
                >
                  {comp.brand}
                </Link>
              </td>
              <td className="py-3 px-4">
                {comp.status === 'EOL' ? (
                  <span className="px-2 py-1 rounded-full bg-red-50 text-danger text-xs">EOL</span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-section-alt text-primary text-xs">В производстве</span>
                )}
              </td>
              <td className="py-3 px-4 text-[#757575] text-xs max-w-xs truncate">
                {comp.analogs && comp.analogs.length > 0
                  ? comp.analogs.join(', ')
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
