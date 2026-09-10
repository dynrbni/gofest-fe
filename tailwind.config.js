/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dfe8ff',
          200: '#c7d4fe',
          300: '#a0b5fc',
          400: '#7690f8',
          500: '#5570f1',
          600: '#3b50e0',
          700: '#2f3fc6',
          800: '#2935a0',
          900: '#27327e',
          950: '#1a1f4b',
        },
        accent: {
          orange: '#f97316',
          coral: '#f43f5e',
          teal: '#14b8a6',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -3px rgba(0, 0, 0, 0.04)',
        'nav': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
