// hooks/useSeasonalTheme.ts

import { useState, useEffect } from 'react';
import { Theme, THEMES, DEFAULT_THEME, getSeason } from '../lib/themes';

export const useSeasonalTheme = (): Theme => {
  const [activeTheme, setActiveTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    try {
      const currentDate = new Date();
      const seasonKey = getSeason(currentDate);
      const selectedTheme = THEMES[seasonKey] || DEFAULT_THEME;
      setActiveTheme(selectedTheme);
    } catch (error) {
        console.error("Error determining season, falling back to default theme.", error);
        setActiveTheme(DEFAULT_THEME);
    }
  }, []);

  return activeTheme;
};
