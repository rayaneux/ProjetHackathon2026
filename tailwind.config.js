/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"helvetica-neue-world"', 'sans-serif'],
        serif: ['"pollen-web"', 'serif'],
      },
      colors: {
        background: '#FFFbf4', // Fond beige très chaud
        foreground: '#1c1b18', // Texte presque noir, chaud
        brand: {
          dark: '#1c1b18',
          purple: '#E0B0FF', // Violet dégradé
          orange: '#FFD580', // Orange dégradé
        },
        card: '#FFFFFF', // Fond des cartes blanc pour contraster
        'card-foreground': '#1c1b18',
        primary: {
          DEFAULT: '#1c1b18', // Boutons noirs
          foreground: '#FFFbf4', // Texte sur boutons noirs
        },
        muted: {
          DEFAULT: '#f3ece1',
          foreground: '#716c64',
        },
        border: '#e8e1d5',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
