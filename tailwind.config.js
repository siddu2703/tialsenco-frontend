const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        tilsenco: {
          gray: '#242930',
          'gray-darker': '#2F2E2E',
          'gray-lighter': '#363D47',
          orange: '#F97316',
          'orange-dark': '#EA580C',
          'orange-light': '#FB923C',
          'orange-lighter': '#FDBA74',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography'),
  ],
};
