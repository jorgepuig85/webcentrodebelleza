/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-primary': 'var(--color-primary)',
        'theme-primary-hover': 'var(--color-primary-hover)',
        'theme-primary-soft': 'var(--color-primary-soft)',
        'theme-secondary': 'var(--color-secondary)',
        'theme-text': 'var(--color-text)',
        'theme-text-strong': 'var(--color-text-strong)',
        'theme-text-light': 'var(--color-text-light)',
        'theme-text-inverted': 'var(--color-text-inverted)',
        'theme-background': 'var(--color-background)',
        'theme-background-soft': 'var(--color-background-soft)',
        'theme-border': 'var(--color-border)',
        'theme-success': 'var(--color-success)',
        'theme-accent': 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
