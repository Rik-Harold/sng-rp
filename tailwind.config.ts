import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'naruto-orange': '#F77F00',
        'naruto-blue': '#1E88E5',
        'naruto-red': '#D32F2F',
        'naruto-dark': '#1A1A1A',
        'brand-primary': '#434BFF', // Votre bleu principal
        'brand-secondary': '#646cffaa', // Le bleu pour les ombres
        'brand-light-gray': '#F3F4F6', // Gris très clair pour les fonds (bg-gray-100)
        'brand-gray': '#E5E7EB',       // Gris pour les inputs (bg-gray-200)
        'brand-dark-gray': '#6B7280',  // Texte gris moyen (text-gray-500)
        'brand-text': '#374151',        // Texte principal (text-gray-700)
        'dark-bg': '#121212',
        'dark-card': '#1e1e1e',
        'orange-primary': '#ff6600',
        'orange-hover': '#e65c00',
        'text-light': '#f0f0f0',
        'text-secondary': '#a0a0a0',
        'border-dark': '#333333',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 102, 0, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(255, 102, 0, 0.8)' },
        }
      },
      animation: {
        glow: 'glow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
