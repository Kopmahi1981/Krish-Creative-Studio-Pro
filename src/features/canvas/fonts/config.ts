/**
 * Configurable Font Manager (Phase 4.3).
 *
 * Fonts are DATA, not hardcoded in components. Components reference a font by
 * `fontFamilyId` and resolve it through `getFontFamily(id)` to a CSS
 * `font-family` stack. The default stack is Unicode-first: it falls back through
 * Noto Sans script-specific families so English, Telugu, Hindi, Tamil, Kannada,
 * Malayalam, Bengali, Gujarati, Marathi, Punjabi, Urdu, Arabic, Chinese,
 * Japanese, Korean, Russian, Spanish, French, German, Portuguese, Turkish, Thai
 * (and any future Unicode script) all render with a sensible system font.
 *
 * Add new fonts (Google, variable, custom) by appending to FONT_CONFIG — no
 * component changes required.
 */

export interface FontEntry {
  id: string
  label: string
  /** CSS font-family stack. */
  stack: string
  /** Where the font is sourced from. */
  source: 'system' | 'google' | 'variable' | 'custom'
  /** If true, a <link> to Google Fonts CSS is injected on first use. */
  googleFamily?: string
}

/**
 * Default Unicode-first fallback stack. Order matters: the browser uses the
 * first family available that can render each glyph, so Latin uses system-ui and
 * other scripts fall through to the appropriate Noto family. We never assume Latin.
 */
const UNICODE_FALLBACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", ' +
  '"Noto Sans Devanagari", "Noto Sans Tamil", "Noto Sans Kannada", ' +
  '"Noto Sans Malayalam", "Noto Sans Bengali", "Noto Sans Gujarati", ' +
  '"Noto Sans Gurmukhi", "Noto Nastaliq Urdu", "Noto Sans Arabic", ' +
  '"Noto Sans SC", "Noto Sans TC", "Noto Sans JP", "Noto Sans KR", ' +
  '"Noto Sans Thai", "Noto Sans Cyrillic", sans-serif'

export const FONT_CONFIG: FontEntry[] = [
  { id: 'default', label: 'Default (Unicode)', stack: UNICODE_FALLBACK, source: 'system' },
  { id: 'system-ui', label: 'System UI', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', source: 'system' },
  {
    id: 'noto-sans',
    label: 'Noto Sans',
    stack: '"Noto Sans", "Noto Sans Devanagari", "Noto Sans Tamil", "Noto Sans Arabic", "Noto Sans CJK SC", sans-serif',
    source: 'system',
  },
  {
    id: 'inter',
    label: 'Inter',
    stack: 'Inter, system-ui, "Noto Sans", sans-serif',
    source: 'google',
    googleFamily: 'Inter:wght@400;600;700',
  },
  {
    id: 'roboto',
    label: 'Roboto',
    stack: 'Roboto, system-ui, "Noto Sans", sans-serif',
    source: 'google',
    googleFamily: 'Roboto:wght@400;500;700',
  },
  {
    id: 'poppins',
    label: 'Poppins',
    stack: 'Poppins, system-ui, "Noto Sans", sans-serif',
    source: 'google',
    googleFamily: 'Poppins:wght@400;600;700',
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    stack: '"Playfair Display", Georgia, "Noto Serif", serif',
    source: 'google',
    googleFamily: 'Playfair+Display:wght@400;700',
  },
]

const FONT_MAP = new Map(FONT_CONFIG.map((f) => [f.id, f]))

/** Resolve a font id to its CSS `font-family` stack. Falls back to the default. */
export function getFontFamily(id: string): string {
  return FONT_MAP.get(id)?.stack ?? FONT_MAP.get('default')!.stack
}

/** Whether a font needs a Google Fonts <link> injected. */
export function getGoogleFamily(id: string): string | undefined {
  return FONT_MAP.get(id)?.googleFamily
}

export const DEFAULT_FONT_ID = 'default'
