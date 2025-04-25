const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    // This is the critical path for HeroUI components
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#237804',
        secondary: '#A0E86F',
        warning: '#FFB800',
        destructive: '#FF0000',
        success: '#00B800',
        info: '#00A3FF',
        light: '#F0F0F0',
        dark: '#000000',
        white: '#FFFFFF',
        black: '#000000',
      },
    },
  },
  darkMode: 'class', // Add this from your second config
  plugins: [heroui()],
};
