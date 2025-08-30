import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export const SeasonalCursor: React.FC = () => {
  const { season } = useContext(ThemeContext);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Use refs for animation to avoid re-renders
  const endX = useRef(0);
  const endY = useRef(0);
  const _x = useRef(0);
  const _y = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for touch device once
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }
    
    // Hide the default cursor
    document.body.style.cursor = 'none';

    const mouseMoveEvent = (e: MouseEvent) => {
      endX.current = e.clientX;
      endY.current = e.clientY;
    };
    document.addEventListener('mousemove', mouseMoveEvent);

    const animate = () => {
      // Lerp for smoothing effect
      _x.current += (endX.current - _x.current) * 0.15;
      _y.current += (endY.current - _y.current) * 0.15;
      
      const transform = `translate(${_x.current}px, ${_y.current}px)`;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = transform;
      }
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = transform;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    const mouseOverEvent = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input[type="checkbox"], input[type="radio"], .cursor-pointer')) {
        setIsHovering(true);
      }
    };
    const mouseOutEvent = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, input[type="checkbox"], input[type="radio"], .cursor-pointer')) {
            setIsHovering(false);
        }
    };

    document.addEventListener('mouseover', mouseOverEvent);
    document.addEventListener('mouseout', mouseOutEvent);

    return () => {
      document.body.style.cursor = 'auto'; // Restore cursor on unmount
      document.removeEventListener('mousemove', mouseMoveEvent);
      document.removeEventListener('mouseover', mouseOverEvent);
      document.removeEventListener('mouseout', mouseOutEvent);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  if (isTouchDevice) {
    return null;
  }
  
  // Base classes
  const dotBase = 'fixed w-2 h-2 top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform';
  const outlineBase = 'fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity,border-color,background-color] duration-300 ease-out will-change-transform';
  
  // Seasonal styles
  let dotStyle = '', outlineStyle = '';
  const outlineSize = isHovering ? 'w-12 h-12' : 'w-8 h-8';

  switch (season) {
    case 'spring': // Halo
      dotStyle = 'bg-theme-primary';
      outlineStyle = `border border-theme-primary ${outlineSize} opacity-50`;
      break;
    case 'summer': // Shimmer
      dotStyle = `bg-theme-primary cursor-summer-animate ${isHovering ? 'animation-none' : ''}`;
      outlineStyle = `border border-theme-primary/50 ${outlineSize} ${isHovering ? 'opacity-50' : 'opacity-0'}`;
      break;
    case 'autumn': // Trail
      dotStyle = 'bg-theme-primary w-2.5 h-2.5';
      outlineStyle = `bg-theme-primary/30 blur-sm ${outlineSize}`;
      break;
    case 'winter': // Blurred circle
      dotStyle = 'bg-white mix-blend-difference';
      outlineStyle = `border border-theme-primary/80 ${outlineSize}`;
      break;
    default:
      dotStyle = 'bg-theme-primary';
      outlineStyle = `border border-theme-primary/50 ${outlineSize}`;
  }

  return (
    <>
      <div ref={cursorDotRef} className={cn(dotBase, dotStyle)} />
      <div ref={cursorOutlineRef} className={cn(outlineBase, outlineStyle)} />
    </>
  );
};
