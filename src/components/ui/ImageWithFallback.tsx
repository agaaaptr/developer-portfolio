'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  isDark?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  isDark = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-br from-dark-400 via-dark-500 to-dark-600' 
          : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
      } ${fill ? 'absolute inset-0' : ''}`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
          isDark 
            ? 'bg-dark-300/50 border border-gray-700/50' 
            : 'bg-white/50 border border-gray-300'
        }`}>
          <ImageOff className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`flex items-center justify-center ${
          isDark 
            ? 'bg-gradient-to-br from-dark-400 via-dark-500 to-dark-600' 
            : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
        } ${fill ? 'absolute inset-0' : ''}`}>
          <div className={`w-8 h-8 rounded-full border-2 animate-spin ${
            isDark 
              ? 'border-gray-600 border-t-accent-400' 
              : 'border-gray-300 border-t-accent-500'
          }`} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
};
