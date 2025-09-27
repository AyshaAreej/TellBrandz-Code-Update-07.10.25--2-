import React, { useEffect, useRef, useState } from 'react';

interface MobileGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPullToRefresh?: () => void;
  enablePullToRefresh?: boolean;
}

export const MobileGestures: React.FC<MobileGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onPullToRefresh,
  enablePullToRefresh = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      startY = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touch = e.touches[0];
      currentY = touch.clientY;
      
      // Pull to refresh logic
      if (enablePullToRefresh && window.scrollY === 0) {
        const pullDistance = Math.max(0, currentY - startY);
        setPullDistance(Math.min(pullDistance, 100));
        
        if (pullDistance > 80) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      
      // Swipe detection
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      // Pull to refresh
      if (enablePullToRefresh && pullDistance > 80 && onPullToRefresh) {
        setIsRefreshing(true);
        onPullToRefresh();
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 1000);
      } else {
        setPullDistance(0);
      }
      
      touchStartRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onPullToRefresh, enablePullToRefresh, pullDistance]);

  return (
    <div ref={containerRef} className="relative">
      {enablePullToRefresh && pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-orange-50 transition-all duration-200 z-10"
          style={{ height: `${pullDistance}px` }}
        >
          <div className="text-orange-600 text-sm">
            {isRefreshing ? '🔄 Refreshing...' : pullDistance > 80 ? '↓ Release to refresh' : '↓ Pull to refresh'}
          </div>
        </div>
      )}
      <div style={{ paddingTop: enablePullToRefresh ? `${pullDistance}px` : 0 }}>
        {children}
      </div>
    </div>
  );
};