'use client';

import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  // Handle external images vs local images
  const isExternal = src.startsWith('http') || src.startsWith('https');
  
  // Create placeholder blur for local images that need blur but don't have blurDataURL
  const getBlurData = () => {
    if (blurDataURL) return blurDataURL;
    if (placeholder === 'blur' && !isExternal) {
      return 'data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
    }
    return undefined;
  };

  return (
    <div className={`relative ${className}`} style={{ overflow: 'hidden' }}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        fill={fill}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={getBlurData()}
        loading={priority ? 'eager' : 'lazy'}
        className={`${className} ${fill ? 'object-cover' : ''}`}
      />
    </div>
  );
} 