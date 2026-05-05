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

// Generate WebP path from original image path
const getWebpPath = (src: string): string => {
  return src.replace(/\.[^.]+$/, '.webp');
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
  height
}: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const webpSrc = getWebpPath(src);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) {
      setIsInView(true);
      return;
    }

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
      {
        rootMargin: '100px 0px',
        threshold: 0.01
      }
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, [lazy, priority]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    // Try WebP first if available
    const tryLoad = (path: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        img.onload = () => {
          setImageSrc(path);
          setIsLoading(false);
          setHasError(false);
          onLoad?.();
          resolve();
        };
        img.onerror = () => {
          if (path === webpSrc) {
            // Fallback to original format
            reject(new Error('WebP failed, trying fallback'));
          } else {
            setIsLoading(false);
            setHasError(true);
            onError?.();
            resolve();
          }
        };
        img.src = path;
      });
    };

    // Chain: try WebP, fallback to original
    tryLoad(webpSrc).catch(() => tryLoad(src));
    
  }, [src, webpSrc, isInView, onLoad, onError]);

  // Generate placeholder style
  const placeholderStyle = {
    background: 'linear-gradient(110deg, #1e293b 8%, #334155 18%, #1e293b 33%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={width && height ? { aspectRatio: `${width}/${height}` } : {}}
    >
      {/* Blur placeholder */}
      {isLoading && !hasError && (
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={!imageSrc ? placeholderStyle : { opacity: 0 }}
          aria-hidden="true"
        />
      )}
      
      {/* Picture element for WebP support */}
      {isInView && !hasError && (
        <picture>
          {/* WebP source */}
          <source srcSet={webpSrc} type="image/webp" />
          {/* Fallback original format */}
          <img
            ref={imgRef}
            src={imageSrc || src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            width={width}
            height={height}
            className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              minHeight: priority ? '200px' : '100px',
            }}
          />
        </picture>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoader;
