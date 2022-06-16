/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff7506',
        secondary: '#A9A9B0',
        'yellow/0': '#FFB800',
        'yellow/0.5': '#F7F8FB',
        'yellow/1': '#FF993C',
        'yellow/2': '#C55E00',
        'yellow/3': '#FFBA7B',
        'primary-400': '#FF9138',
        'grey/2': '#F1F4F8',
        'grey/3': '#F7F8FB',
        'grey/5': '#919DBA',
        'grey-background': '#EAF1F8',
        'promomote': '#03AC00',
        'primary-red': '#FD5959',
        'read-background': '#F8EBE8',
        'dashboard-background': '#F9F6F4',
        'chart-linear': 'linear-gradient(180deg, rgba(250, 160, 95, 0.26) 0%, rgba(255, 255, 255, 0) 141.68%)',
        'chart-donut-1': '#FF8A48',
        'chart-donut-2': '#4F75FF',
      },
    },
    screens: {
      '4xl': { max: '1920px' },
      '3xl': { max: '1600px' },
      '2xl': { max: '1440px' },
      // => @media (max-width: 1440px) { ... }

      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }

      sm: { max: '639px' },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [],
};