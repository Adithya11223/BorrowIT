/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D0D0E',         // Deep charcoal/black
          card: '#1A1A1C',       // Dark card background
          border: '#2A2A2D',     // Subtle dark border
          input: '#1A1A1C',      // Input background
          lighter: '#2E2E33',    // Border/divider line accent
        },
        brand: {
          primary: '#FF5E00',   // Neon orange brand color
          glow: '#FF7A00',      // Orange glow
          cyan: '#FFA800',      // Alternate amber/orange accent
          purple: '#D84F00',    // Deep red-orange
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(234, 88, 12, 0.05), 0 0 10px rgba(234, 88, 12, 0.05)' },
          '100%': { boxShadow: '0 0 15px rgba(234, 88, 12, 0.2), 0 0 25px rgba(234, 88, 12, 0.15)' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
