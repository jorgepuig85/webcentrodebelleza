import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  delay?: number;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <div className="min-h-[300px]" />,
  rootMargin = '400px',
  delay = 2500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;

    // Safety fallback: ensure all content renders even if the user never scrolls
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          clearTimeout(timer);
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [isVisible, rootMargin, delay]);

  return (
    <div ref={containerRef}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazySection;
