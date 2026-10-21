import { useState, useRef, useEffect } from 'react';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
}

const placeholderStyle: React.CSSProperties = {
  background: 'linear-gradient(110deg, #1e293b 8%, #334155 18%, #1e293b 33%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite linear',
};

const ImageLoader = ({
  src,
  alt,
  className = '',
  onLoad,
  onError,
  lazy = true,
  priority = false,
  width,
  height,
}: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---------- lazy-load IntersectionObserver ----------
  useEffect(() => {
    if (!lazy || priority) { setIsInView(true); return; }
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(container);
          }
        });
      },
      { rootMargin: '100px 0px', threshold: 0.01 }
    );
    observer.observe(container);
    return () => { observer.unobserve(container); };
  }, [lazy, priority]);

  // ---------- image load / error listeners ----------
  useEffect(() => {
    if (!isInView) return;

    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);

    // Use a dedicated image instance — never share one across concurrent loads
    const img = new Image();

    img.onload = () => {
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

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView, onLoad, onError]);

  // ---------- render ----------
  const isRound = /\brounded-full\b/.test(className);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      {isLoading && (
        <div
          className={`absolute inset-0 ${isRound ? 'rounded-full' : ''}`}
          style={placeholderStyle}
          aria-hidden="true"
        />
      )}

      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          width={width}
          height={height}
          className={`h-full w-full object-cover transition-all duration-500 hover:scale-105 ${
            isRound ? 'rounded-full' : ''
          } ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {hasError && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${
            isRound ? 'rounded-full' : ''
          }`}
        >
          <div className="text-center text-gray-400">
            <svg className="mx-auto mb-2 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoader;
