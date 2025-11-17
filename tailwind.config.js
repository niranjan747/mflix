/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hero: {
          base: '#050505',
          overlay: '#0b1120',
          accent: '#f59f0b',
        },
      },
      transitionDuration: {
        hero: '150ms',
        'hero-long': '200ms',
      },
      transitionTimingFunction: {
        hero: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  variants: {
    extend: {
      translate: ['motion-safe', 'motion-reduce'],
      opacity: ['motion-safe', 'motion-reduce'],
      scale: ['motion-safe', 'motion-reduce'],
    },
  },
  plugins: [],
}
