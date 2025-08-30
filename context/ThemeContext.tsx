// context/ThemeContext.tsx

import React, { createContext, useEffect, ReactNode } from 'react';
import { useSeasonalTheme } from '../hooks/useSeasonalTheme';
import { Theme, DEFAULT_THEME } from '../lib/themes';

interface ThemeContextType {
  activeTheme: Theme;
  season: string;
}

export const ThemeContext = createContext<ThemeContextType>({
  activeTheme: DEFAULT_THEME,
  season: 'spring',
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { activeTheme, season } = useSeasonalTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme) {
      // Apply colors as CSS variables to the root element
      Object.entries(activeTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // --- DYNAMIC PRELOAD FOR LCP HERO IMAGE ---
      // This ensures the correct seasonal hero image is preloaded for optimal performance.
      const preloadLinkId = 'hero-preload-link';
      let link = document.getElementById(preloadLinkId) as HTMLLinkElement | null;

      // If the link doesn't exist, create it
      if (!link) {
        link = document.createElement('link');
        link.id = preloadLinkId;
        link.rel = 'preload';
        link.as = 'image';
        // fetchPriority is a strong hint to the browser for LCP elements
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      }
      
      // Update the href to the current theme's hero image
      if (link.href !== activeTheme.images.hero) {
        link.href = activeTheme.images.hero;
      }
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, season }}>
      {children}
    </ThemeContext.Provider>
  );
};
