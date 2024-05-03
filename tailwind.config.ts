import type { Config } from 'tailwindcss';

const colors = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  'secondary-1': 'var(--color-secondary-1)',
  'reverse-primary': 'var(--color-reverse-primary)',
};

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: { ...colors },
      colors: { ...colors },
      borderColor: { ...colors },
    },
    screens: {
      phone: '280px',
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
  },
  plugins: [],
};

export default config;
