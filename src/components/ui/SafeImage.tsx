"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

/**
 * A robust wrapper for Next.js' Image component that handles runtime loading errors 
 * and swaps in a high-quality "hidden gem" fallback image (Spiti Valley).
 */
interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function SafeImage({ src, fallbackSrc, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const globalFallback = "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200";

  // If initial src changes, reset state
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc || globalFallback);
      }}
    />
  );
}
