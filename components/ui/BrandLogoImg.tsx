'use client';

/**
 * components/ui/BrandLogoImg.tsx — реальный логотип бренда с фолбэком.
 *
 * 1. Если для slug есть файл в /public/images/brands (манифест lib/brand-logos) —
 *    показываем настоящую картинку логотипа.
 * 2. Если файла нет или <Image> упал (onError) — рендерим стилизованный
 *    SVG-фолбэк BrandLogo (инициалы в фирменном цвете).
 */
import { useState } from 'react';
import Image from 'next/image';
import BrandLogo from './BrandLogo';
import { brandLogoSrc } from '@/lib/brand-logos';

type Props = {
  name: string;
  slug?: string | null;
  className?: string;
  alt?: string;
};

export default function BrandLogoImg({ name, slug, className = '', alt }: Props) {
  const src = brandLogoSrc(slug);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <BrandLogo name={name} slug={slug || ''} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt || `Логотип ${name}`}
      width={120}
      height={48}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
