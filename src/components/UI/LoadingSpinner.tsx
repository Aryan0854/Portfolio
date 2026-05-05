import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = '#4a72f5',
  className = ''
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-transparent rounded-full animate-spin`}
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

export default LoadingSpinner;
