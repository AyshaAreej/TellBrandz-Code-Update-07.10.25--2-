import React, { useEffect, useRef, useState } from 'react';

interface SplitSectionStickyProps {
  children: React.ReactNode;
  className?: string;
}

const SplitSectionSticky: React.FC<SplitSectionStickyProps> = ({
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [stickyState, setStickyState] = useState<'normal' | 'sticky' | 'bottom'>('normal');

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !leftRef.current || !rightRef.current) return;

      const container = containerRef.current;
      const leftSection = leftRef.current;
      const rightSection = rightRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const leftHeight = leftSection.scrollHeight;
      const rightHeight = rightSection.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate thresholds more precisely
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const stickyOffset = 20;
      
      // Determine which phase we're in
      if (containerTop > stickyOffset) {
        // Container hasn't reached sticky point yet
        setStickyState('normal');
      } else if (containerBottom > rightHeight + stickyOffset) {
        // Container is in sticky range
        setStickyState('sticky');
      } else {
        // Container is past sticky range, pin to bottom
        setStickyState('bottom');
      }
    };

    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    window.addEventListener('resize', optimizedScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', optimizedScroll);
      window.removeEventListener('resize', optimizedScroll);
    };
  }, []);

  // Split children into left and right content
  const childrenArray = React.Children.toArray(children);
  const leftContent = childrenArray[0];
  const rightContent = childrenArray[1];

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Stories */}
          <div 
            ref={leftRef}
            className="lg:col-span-2 space-y-6"
          >
            {leftContent}
          </div>
          
          {/* Right Content - Sidebar */}
          <div className="lg:col-span-1 relative">
            <div 
              ref={rightRef}
              className={`
                w-full transition-all duration-150 ease-out
                ${stickyState === 'sticky' ? 'lg:sticky lg:top-5' : ''}
                ${stickyState === 'bottom' ? 'lg:absolute lg:bottom-0' : ''}
                ${stickyState === 'normal' ? 'relative' : ''}
              `}
            >
              {rightContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitSectionSticky;