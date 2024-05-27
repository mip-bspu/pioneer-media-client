/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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

