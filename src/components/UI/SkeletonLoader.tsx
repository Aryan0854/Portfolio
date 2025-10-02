import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'image' | 'card' | 'avatar';
  className?: string;
  lines?: number;
}

const SkeletonLoader = ({ 
  type = 'text', 
  className = '',
  lines = 1
}: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'avatar':
        return (
          <div className={`animate-pulse bg-gray-700 rounded-full ${className}`} />
        );
      
      case 'image':
        return (
          <div className={`animate-pulse bg-gray-700 rounded-lg ${className}`} />
        );
      
      case 'card':
        return (
          <div className={`animate-pulse bg-gray-800 rounded-lg p-4 ${className}`}>
            <div className="h-4 bg-gray-700 rounded mb-2" />
            <div className="h-3 bg-gray-700 rounded mb-2 w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
        );
      
      case 'text':
      default:
        return (
          <div className={className}>
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`animate-pulse bg-gray-700 rounded mb-2 ${
                  index === lines - 1 ? 'w-3/4' : 'w-full'
                }`}
                style={{ height: '1rem' }}
              />
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
