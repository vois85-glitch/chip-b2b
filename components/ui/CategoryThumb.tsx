'use client';

// components/ui/CategoryThumb.tsx
// Превью категории с фото компонента.
// При ошибке загрузки — пробует дефолтное фото, затем показывает placeholder.
// Никаких зелёных SVG-схем: только реальные фотографии.

import { useState } from 'react';

const DEFAULT_PHOTO = '/images/photos/ic-dip.jpg';

type Props = {
  src?: string;
  categoryName: string;
  className?: string;
};

export default function CategoryThumb({ src, categoryName, className = '' }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src || DEFAULT_PHOTO);
  const [triedDefault, setTriedDefault] = useState(!src);

  const handleError = () => {
    if (!triedDefault) {
      setTriedDefault(true);
      setCurrentSrc(DEFAULT_PHOTO);
    }
  };

  return (
    <span
      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#eef2ec] bg-white flex items-center justify-center ${className}`}
    >
      <img
        src={currentSrc}
        alt=""
        loading="lazy"
        onError={handleError}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </span>
  );
}
