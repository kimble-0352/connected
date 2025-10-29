'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className, 
  size = 'md',
  text = '로딩 중...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto mb-4',
          sizeClasses[size],
          className
        )} />
        <h2 className="text-2xl font-bold mb-2">Connected</h2>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
