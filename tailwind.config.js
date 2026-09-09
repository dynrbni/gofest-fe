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
          50: '#eef4ff',
          100: '#d9e5ff',
          200: '#bcd3ff',
          300: '#8eb8ff',
          400: '#5891ff',
          500: '#2f69ff',
          600: '#1b4cf5',
          700: '#1438dc',
          800: '#152fb2',
          900: '#0f2370', // Artatix deep royal blue signature
          950: '#0a1548',
        },
        accent: {
          orange: '#FF5722',
          coral: '#FF4757',
          teal: '#00C2CB',
          amber: '#FFB800',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 35, 112, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(15, 35, 112, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px -5px rgba(47, 105, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
