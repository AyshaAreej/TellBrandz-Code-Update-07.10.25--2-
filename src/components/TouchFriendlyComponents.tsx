import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  className,
  disabled
}) => {
  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };

  const variantClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    outline: 'border-2 border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    primary: 'bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'touch-manipulation select-none active:scale-95 transition-all duration-150',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Button>
  );
};

interface TouchCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export const TouchCard: React.FC<TouchCardProps> = ({
  children,
  onClick,
  className,
  hoverable = true
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'touch-manipulation select-none transition-all duration-200',
        hoverable && 'hover:shadow-lg hover:-translate-y-1 active:scale-98',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Card>
  );
};

interface SwipeIndicatorProps {
  direction: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({
  direction,
  className
}) => {
  const arrows = {
    left: '←',
    right: '→',
    up: '↑',
    down: '↓'
  };

  return (
    <div className={cn(
      'flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm animate-pulse',
      className
    )}>
      {arrows[direction]}
    </div>
  );
};

interface PullToRefreshProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  isRefreshing,
  children
}) => {
  return (
    <div className="relative">
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-orange-50 z-10">
          <div className="flex items-center space-x-2 text-orange-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
            <span className="text-sm">Refreshing...</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};