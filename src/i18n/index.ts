import { useLanguageStore } from './useLanguageStore'
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from './types'
import { en } from './locales/en'
import { te } from './locales/te'
import { hi } from './locales/hi'

const DICTS: Record<Language, Record<string, string>> = { en, te, hi }

export { LANGUAGES, DEFAULT_LANGUAGE }
export type { Language }

/**
 * Resolve a translation key for the given language, falling back to English,
 * then to the raw key (so the UI never renders blank).
 */
export function resolve(key: string, lang: Language, vars?: Record<string, string | number>): string {
  const dict = DICTS[lang] ?? en
  let value = dict[key] ?? en[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return value
}

/**
 * Subscribe to the active language. Components MUST call this hook so that an
 * EN → TE → HI switch triggers an immediate React re-render. (Do not use the
 * standalone `t()` below for rendered text without also subscribing here.)
 */
export function useLanguage(): Language {
  return useLanguageStore((s) => s.language)
}

/** Imperative translator bound to the *current* language (re-renders subscribers). */
export function t(key: string, vars?: Record<string, string | number>): string {
  const lang = useLanguageStore.getState().language
  return resolve(key, lang, vars)
}

/** Change the active language (updates store + persisted localStorage). */
export function setLanguage(lang: Language): void {
  useLanguageStore.getState().setLanguage(lang)
}
