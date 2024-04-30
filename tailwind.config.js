/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      spacing: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '	1rem',
        xl: '1.5rem',
      }
    },
  },
  plugins: [],
}

