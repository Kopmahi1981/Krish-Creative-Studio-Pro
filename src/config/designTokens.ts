/**
 * Centralized Design Token system for Krish Creative Studio Pro.
 *
 * Single source of truth for visual constants. `tailwind.config.js` mirrors these
 * values for utility classes; components import tokens when they need values at
 * runtime (e.g. Framer Motion transitions, inline z-index, dynamic glows).
 *
 * NOTE: easing tuples are documented here but intentionally NOT passed directly to
 * Framer Motion (its `ease` prop requires a fixed 4-tuple, not `number[]`). Page
 * transitions hardcode the matching bezier for type-safety.
 */
export const designTokens = {
  color: {
    brand: {
      rose: '#f43f5e',
      purple: '#a855f7',
      cyan: '#22d3ee',
    },
    surface: {
      base: '#020617', // slate-950
      elevated: 'rgba(15, 23, 42, 0.6)', // slate-900/60 (glass-strong)
      glass: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.10)',
    },
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadow: {
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    'neon-rose': '0 0 5px rgba(244, 63, 94, 0.55), 0 0 20px rgba(244, 63, 94, 0.35)',
    'neon-purple': '0 0 5px rgba(168, 85, 247, 0.55), 0 0 20px rgba(168, 85, 247, 0.35)',
    'neon-cyan': '0 0 5px rgba(34, 211, 238, 0.55), 0 0 20px rgba(34, 211, 238, 0.35)',
  },
  blur: {
    sm: '4px',
    md: '12px',
    lg: '20px',
    xl: '24px',
  },
  zIndex: {
    base: 0,
    topbar: 20,
    sidebar: 40,
    dropdown: 40,
    overlay: 50,
    modal: 60,
    toast: 70,
    palette: 80,
  },
  transition: {
    duration: {
      fast: 0.15,
      base: 0.2,
      slow: 0.3,
      page: 0.35,
    },
    easing: {
      standard: [0.4, 0, 0.2, 1],
      emphasized: [0.2, 0.8, 0.2, 1],
      decelerate: [0, 0, 0.2, 1],
    },
  },
  typography: {
    fontSans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  spacing: {
    section: '1.5rem',
  },
} as const

export type DesignTokens = typeof designTokens
