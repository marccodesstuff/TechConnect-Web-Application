/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          300: '#7dd3fc',
          500: '#0ea5e9',
          700: '#0369a1'
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#fb923c'
        }
      },
      borderRadius: {
        md: '0.5rem'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
