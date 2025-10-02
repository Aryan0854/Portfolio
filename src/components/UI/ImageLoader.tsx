import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageLoader = ({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  onLoad,
  onError 
}: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };
    
    img.src = src;
  }, [src, onLoad, onError]);

  if (isLoading) {
    return (
      <div className={`relative bg-gray-800 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <LoadingSpinner size="lg" color="#4a72f5" />
            <p className="mt-2 text-sm text-gray-400">Loading...</p>
          </div>
        </div>
        {placeholder && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
            style={{ backgroundImage: `url(${placeholder})` }}
          />
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`relative bg-gray-800 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc || src}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
    </div>
  );
};

export default ImageLoader;
