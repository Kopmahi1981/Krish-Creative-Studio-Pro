import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  applyTheme: (theme: Theme) => void
}

const DEFAULT_THEME: Theme = 'dark'

/** Toggle the `dark` class on <html>, which swaps all CSS-variable tokens. */
function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,

      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        applyThemeClass(next)
      },

      setTheme: (theme) => {
        set({ theme })
        applyThemeClass(theme)
      },

      applyTheme: (theme) => {
        applyThemeClass(theme)
      },
    }),
    {
      name: 'kcs-theme',
      onRehydrateStorage: () => (state) => {
        // Re-apply the persisted theme to <html> once the store rehydrates.
        if (state) applyThemeClass(state.theme)
      },
    },
  ),
)
