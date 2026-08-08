import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_LANGUAGE, type Language } from './types'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

/**
 * Single source of truth for the UI language.
 *
 * Persistence mirrors the existing `useThemeStore` pattern exactly: the
 * `persist` middleware writes to `localStorage` under `kcs-language` and
 * rehydrates on load, so the chosen language survives a page reload.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'kcs-language',
    },
  ),
)
