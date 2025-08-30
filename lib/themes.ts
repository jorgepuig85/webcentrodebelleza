// lib/themes.ts

export interface Theme {
  name: string;
  colors: {
    '--color-primary': string;
    '--color-primary-hover': string;
    '--color-primary-soft': string;
    '--color-secondary': string;
    '--color-text': string;
    '--color-text-strong': string;
    '--color-text-light': string;
    '--color-text-inverted': string;
    '--color-background': string;
    '--color-background-soft': string;
    '--color-border': string;
    '--color-success': string;
    '--color-accent': string;
    '--color-glow': string;
  };
  images: {
    hero: string;
  };
  seasonalSlogan: string;
  ctaText: string;
}

const SUPABASE_URL = 'https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/';

// Paleta por defecto (Primavera)
export const DEFAULT_THEME: Theme = {
  name: 'Primavera',
  colors: {
    '--color-primary': '#f472b6', // pink-400
    '--color-primary-hover': '#ec4899', // pink-500
    '--color-primary-soft': '#fdf2f8', // pink-50
    '--color-secondary': '#a855f7', // purple-500
    '--color-text': '#4b5563', // gray-600
    '--color-text-strong': '#1f2937', // gray-800
    '--color-text-light': '#9ca3af', // gray-400
    '--color-text-inverted': '#ffffff', // white
    '--color-background': '#ffffff', // white
    '--color-background-soft': '#f9fafb', // gray-50
    '--color-border': '#d1d5db', // gray-300
    '--color-success': '#22c55e', // green-500
    '--color-accent': '#f59e0b', // amber-500
    '--color-glow': 'rgba(244, 114, 182, 0.4)', // pink-400 with alpha
  },
  images: {
    hero: `${SUPABASE_URL}fondo_inicio_primavera.png?format=webp&quality=80`,
  },
  seasonalSlogan: 'Renová tu piel y florecé con la frescura de la primavera.',
  ctaText: 'Renová tu piel',
};

export const THEMES: { [key: string]: Theme } = {
  summer: {
    name: 'Verano',
    colors: {
      ...DEFAULT_THEME.colors,
      '--color-primary': '#fb7185', // rose-400
      '--color-primary-hover': '#f43f5e', // rose-500
      '--color-primary-soft': '#fff1f2', // rose-50
      '--color-secondary': '#f97316', // orange-500
      '--color-text': '#57534e', // stone-600
      '--color-text-strong': '#292524', // stone-800
      '--color-background-soft': '#fef2f2', // red-50
      '--color-glow': 'rgba(251, 113, 133, 0.4)', // rose-400 with alpha
    },
    images: {
      hero: `${SUPABASE_URL}fondo_inicio_verano.png?format=webp&quality=80`,
    },
    seasonalSlogan: 'Mostrá tu piel libre y luminosa, lista para brillar este verano.',
    ctaText: 'Mostrá tu mejor piel',
  },
  autumn: {
    name: 'Otoño',
    colors: {
      ...DEFAULT_THEME.colors,
      '--color-primary': '#f97316', // orange-500
      '--color-primary-hover': '#ea580c', // orange-600
      '--color-primary-soft': '#fff7ed', // orange-50
      '--color-secondary': '#a16207', // yellow-600
      '--color-text': '#44403c', // stone-700
      '--color-text-strong': '#1c1917', // stone-900
      '--color-background': '#fffaf0', // floralwhite
      '--color-background-soft': '#fefce8', // yellow-50
      '--color-glow': 'rgba(249, 115, 22, 0.4)', // orange-500 with alpha
    },
    images: {
      hero: `${SUPABASE_URL}fondo_inicio_otono.png?format=webp&quality=80`,
    },
    seasonalSlogan: 'Prepará tu piel con la calidez y el cuidado que merece esta temporada.',
    ctaText: 'Prepará tu piel',
  },
  winter: {
    name: 'Invierno',
    colors: {
      ...DEFAULT_THEME.colors,
      '--color-primary': '#a78bfa', // violet-400
      '--color-primary-hover': '#8b5cf6', // violet-500
      '--color-primary-soft': '#f5f3ff', // violet-50
      '--color-secondary': '#38bdf8', // lightBlue-400
      '--color-text': '#374151', // gray-700
      '--color-text-strong': '#111827', // gray-900
      '--color-background': '#ffffff', // white
      '--color-background-soft': '#f3f4f6', // gray-100
      '--color-glow': 'rgba(167, 139, 250, 0.4)', // violet-400 with alpha
    },
    images: {
      hero: `${SUPABASE_URL}fondo_inicio_invierno.png?format=webp&quality=80`,
    },
    seasonalSlogan: 'Descubrí el placer de una piel suave y radiante incluso en los días más fríos.',
    ctaText: 'Cuidá tu piel hoy',
  },
  spring: DEFAULT_THEME,
};

// Hemisferio Sur
// Verano: 21 de diciembre - 20 de marzo
// Otoño: 21 de marzo - 20 de junio
// Invierno: 21 de junio - 20 de septiembre
// Primavera: 21 de septiembre - 20 de diciembre

export const getSeason = (date: Date): string => {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day < 21)) {
    return 'summer';
  }
  if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day < 21)) {
    return 'autumn';
  }
  if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 21)) {
    return 'winter';
  }
  return 'spring'; // Default
};