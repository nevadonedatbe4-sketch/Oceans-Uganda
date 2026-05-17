/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#001731',
          'secondary': '#002349',
          'accent': '#0D5959',
          'golden': '#C9A84C',
          'golden-dark': '#A8832A',
          'golden-light': '#E8C97A',
          'topbar': '#020101',
          'text-gray': '#7A7A7A',
          'off-white': '#F5F5F5',
        },
        fontFamily: {
          prata: ['Prata', 'serif'],
          roboto: ['Roboto', 'sans-serif'],
          tahoma: ['Tahoma', 'sans-serif'],
          jost: ['Jost', 'sans-serif'],
        },
        keyframes: {
          'slide-in-right': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0)' },
          },
        },
        animation: {
          'slide-in-right': 'slide-in-right 0.28s cubic-bezier(0.22,1,0.36,1)',
        },
      },
    },
    plugins: [],
  }