// hooks/useSeasonalTheme.ts

import { useState, useEffect } from 'react';
import { Theme, THEMES, DEFAULT_THEME, getSeason } from '../lib/themes';

export const useSeasonalTheme = (): { activeTheme: Theme, season: string } => {
  const [themeState, setThemeState] = useState<{ activeTheme: Theme, season: string }>({
    activeTheme: DEFAULT_THEME,
    season: 'spring',
  });

  useEffect(() => {
    try {
      // Check for a URL parameter to force a season
      const urlParams = new URLSearchParams(window.location.search);
      const forcedSeason = urlParams.get('season');
      
      // Use the forced season if it's valid, otherwise determine from date
      const seasonKey = (forcedSeason && THEMES[forcedSeason]) 
        ? forcedSeason 
        : getSeason(new Date());

      const selectedTheme = THEMES[seasonKey] || DEFAULT_THEME;
      
      setThemeState({ activeTheme: selectedTheme, season: seasonKey });

    } catch (error) {
        console.error("Error determining season, falling back to default theme.", error);
        setThemeState({ activeTheme: DEFAULT_THEME, season: 'spring' });
    }
  }, []); // This effect now runs once and respects the URL param on load.

  return themeState;
};
