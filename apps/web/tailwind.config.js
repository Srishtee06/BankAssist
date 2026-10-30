/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bank: {
          navy: '#17324D',
          blue: '#1B5E8A',
          blueHover: '#154b6e',
          mutedBlue: '#47677F',
          warmWhite: '#FAFAF8',
          lightGrey: '#F1F3F5',
          white: '#FFFFFF',
          textPrimary: '#202A34',
          textSecondary: '#687581',
          teal: '#327C78',
          tealHover: '#286360',
          border: '#E0E5E9',
          alertRed: '#B91C1C',
          alertRedBg: '#FEF2F2',
          successGreen: '#15803D',
          successGreenBg: '#F0FDF4',
          warningAmber: '#B45309',
          warningAmberBg: '#FFFBEB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
