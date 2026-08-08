/** Supported UI languages. English is the default and the fallback. */
export type Language = 'en' | 'te' | 'hi'

/** Display metadata for the language selector. */
export interface LanguageMeta {
  code: Language
  /** Native endonym, shown in the selector. */
  label: string
  /** Short English name for aria-labels. */
  englishName: string
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', englishName: 'English' },
  { code: 'te', label: 'తెలుగు', englishName: 'Telugu' },
  { code: 'hi', label: 'हिन्दी', englishName: 'Hindi' },
]

export const DEFAULT_LANGUAGE: Language = 'en'

/**
 * Translation dictionary shape. Keys are dotted strings (e.g. "nav.dashboard").
 * Every locale file must satisfy this shape; `en` is the master/fallback.
 */
export type TranslationDict = Record<string, string>
