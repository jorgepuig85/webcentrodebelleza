
import React, { useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { Flower2, Sun, Leaf, Snowflake } from 'lucide-react';

interface SeasonalPromoIconProps {
  isVisible: boolean;
  onHide: () => void;
}

const SeasonalPromoIcon: React.FC<SeasonalPromoIconProps> = ({ isVisible, onHide }) => {
  const { season } = useContext(ThemeContext);

  // --- Component Logic ---
  useEffect(() => {
    // Exit early if the component is not supposed to be visible.
    if (!isVisible) return;

    // Hide the icon after a set duration.
    const hideTimer = setTimeout(() => {
      onHide();
    }, 9000); // 9 seconds after it becomes visible.

    // Hide the icon on scroll. The listener is added only when visible.
    const handleScroll = () => {
      if (window.scrollY > 50) {
        onHide();
      }
    };
    
    // Using `once: true` is a good practice here as we only need to trigger hide once on scroll.
    window.addEventListener('scroll', handleScroll, { passive: true, once: true });

    // Cleanup timers and event listener when the component unmounts or visibility changes.
    return () => {
      clearTimeout(hideTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, onHide]);

  // --- Scroll to Promotions ---
  const handleIconClick = () => {
    const promotionsSection = document.getElementById('promociones');
    if (promotionsSection) {
      promotionsSection.scrollIntoView({ behavior: 'smooth' });
    }
    onHide(); // Hide after click
  };

  // --- Seasonal Icons and Animations ---
  const icons: { [key: string]: React.ReactNode } = {
    spring: <Flower2 className="w-8 h-8 text-theme-primary transition-transform duration-300 group-hover:rotate-45" />,
    summer: <Sun className="w-8 h-8 text-theme-primary transition-transform duration-500 group-hover:rotate-90" />,
    autumn: <Leaf className="w-8 h-8 text-theme-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />,
    winter: <Snowflake className="w-8 h-8 text-theme-primary animate-spin-slow group-hover:scale-125 transition-transform duration-300" />,
  };
  
  const selectedIcon = icons[season] || icons['spring'];

  // Define a slow-spin animation for the winter snowflake
  useEffect(() => {
      const styleSheet = document.styleSheets[0];
      if (styleSheet) {
          const keyframes = `@keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }`;
          const animationClass = `.animate-spin-slow { animation: spin-slow 15s linear infinite; }`;

          // A simple check to avoid inserting the same rules multiple times
          if (!styleSheet.cssRules[0] || !Array.from(styleSheet.cssRules).some(rule => rule.cssText.includes('spin-slow'))) {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            styleSheet.insertRule(animationClass, styleSheet.cssRules.length);
          }
      }
  }, []);

  // --- Render ---
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative group"
          role="button"
          tabIndex={0}
          onClick={handleIconClick}
          onKeyPress={(e) => e.key === 'Enter' && handleIconClick()}
          aria-label="Descubrir promociones especiales"
        >
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-1.5 text-sm font-medium text-theme-text-inverted bg-theme-text-strong rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Descubrí promos especiales
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-theme-text-strong rotate-45" />
          </div>

          {/* Icon Container */}
          <div className="bg-theme-background p-4 rounded-full shadow-lg cursor-pointer border-2 border-theme-primary/50 hover:border-theme-primary transition-all duration-300">
            {selectedIcon}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SeasonalPromoIcon;
