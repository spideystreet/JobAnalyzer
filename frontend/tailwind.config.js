/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fond sombre
        background: {
          DEFAULT: "#1a1b1e",    // Noir/gris foncé élégant
          lighter: "#2c2e33",    // Pour les éléments superposés
        },
        // Turquoise style #40E0D0
        primary: {
          DEFAULT: "#40E0D0",    // Turquoise demandé
          hover: "#5FEAE0",      // Version plus claire pour hover
          foreground: "#ffffff"  // Texte sur fond primary
        },
        // Textes
        text: {
          primary: "#ffffff",    // Texte principal
          secondary: "#cbd5e1",  // Texte secondaire (plus clair pour meilleure lisibilité)
          muted: "#94a3b8",     // Texte tertiaire
        }
      },
    },
  },
  plugins: [],
}

