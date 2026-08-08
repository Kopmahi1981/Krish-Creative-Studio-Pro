import { Languages } from 'lucide-react'
import { useLanguageStore } from '@/i18n/useLanguageStore'
import { LANGUAGES, useLanguage } from '@/i18n'

/**
 * Language switcher for the top bar. Subscribes to the language store so the
 * selected option and labels update immediately on an EN → TE → HI switch.
 * Changing language updates `useLanguageStore` (persisted to localStorage) and
 * re-renders every component that calls `useLanguage()`.
 */
export function LanguageSelector() {
  const lang = useLanguage()
  const setLanguage = useLanguageStore((s) => s.setLanguage)

  return (
    <div
      className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      <Languages className="ml-1 h-4 w-4 text-foreground-muted" aria-hidden="true" />
      {LANGUAGES.map((l) => {
        const active = l.code === lang
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            aria-pressed={active}
            title={l.englishName}
            className={
              'rounded-lg px-2 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60 ' +
              (active
                ? 'bg-brand-purple/20 text-brand-purple'
                : 'text-foreground-secondary hover:bg-white/10 hover:text-foreground')
            }
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
