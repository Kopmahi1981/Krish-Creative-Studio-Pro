/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette (Primary: Rose, Secondary: Purple, Accent: Cyan) — theme-neutral.
        brand: {
          rose: '#f43f5e',
          purple: '#a855f7',
          cyan: '#22d3ee',
        },
        // Semantic theme tokens (driven by CSS variables in index.css).
        // Switching .dark swaps the variable values → entire app re-themes.
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        elevated: 'rgb(var(--color-surface-2) / <alpha-value>)',
        foreground: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-rose': '0 0 5px rgba(244, 63, 94, 0.55), 0 0 20px rgba(244, 63, 94, 0.35)',
        'neon-purple': '0 0 5px rgba(168, 85, 247, 0.55), 0 0 20px rgba(168, 85, 247, 0.35)',
        'neon-cyan': '0 0 5px rgba(34, 211, 238, 0.55), 0 0 20px rgba(34, 211, 238, 0.35)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
