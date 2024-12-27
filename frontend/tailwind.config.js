/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#E6FFFE',
          '100': '#B3FFFC',
          '200': '#80FFF9',
          '300': '#4DFFF7',
          '400': '#1AFFF4',
          '500': '#42E8E0',
          '600': '#00D6CC',
          '700': '#00A39B',
          '800': '#007069',
          '900': '#003D38',
          DEFAULT: '#42E8E0',
        },
        secondary: {
          '50': '#F3E6FF',
          '100': '#E6CCFF',
          '200': '#CC99FF',
          '300': '#B366FF',
          '400': '#9933FF',
          '500': '#7F00FF',
          '600': '#6600CC',
          '700': '#4C0099',
          '800': '#330066',
          '900': '#190033',
          DEFAULT: '#7F00FF',
        },
        background: {
          DEFAULT: "#1a1b1e",
          lighter: "#2c2e33",
        },
        text: {
          primary: "#ffffff",
          secondary: "#cbd5e1",
          muted: "#94a3b8",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
    },
  },
  plugins: [],
}

