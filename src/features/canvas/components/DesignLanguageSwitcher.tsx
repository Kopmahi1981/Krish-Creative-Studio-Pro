import { Languages, Plus } from 'lucide-react'
import { LANGUAGES } from '@/i18n/types'
import { cn } from '@/utils/cn'
import {
  useCanvasObjects,
  selectSourceLanguage,
  selectVariants,
  selectHasObjects,
} from '../objects/store'
import { countOverrides } from '../i18n-content/variants'

/**
 * DESIGN language switcher (Phase 5.2 UX).
 *
 * This is NOT the UI language selector. It is deliberately paired with the
 * top-bar "UI" control so the two are never confused:
 *   • Top bar  → UI language  (interface chrome)
 *   • Canvas   → Design language (the creative content on the canvas)
 *
 * The control communicates the multilingual workflow explicitly:
 *   English  → "Original" design
 *   Telugu   → "Telugu Variant"; when none exists: a "Create Telugu Variant" CTA
 *   Hindi    → "Hindi Variant";  when none exists: a "Create Hindi Variant" CTA
 *
 * Switching here never mutates any original object — it only changes which
 * variant overlay the canvas resolves through, or (via the CTA) creates an
 * initially EMPTY variant so "exists but untranslated" is distinct from
 * "does not exist".
 */
export function DesignLanguageSwitcher() {
  const active = useCanvasObjects((s) => s.activeDesignLanguage)
  const setActive = useCanvasObjects((s) => s.setActiveDesignLanguage)
  const createVariant = useCanvasObjects((s) => s.createDesignVariant)
  const sourceLanguage = useCanvasObjects(selectSourceLanguage)
  const variants = useCanvasObjects(selectVariants)
  const hasObjects = useCanvasObjects(selectHasObjects)

  return (
    <div
      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-1"
      role="group"
      aria-label="Design language"
    >
      <span
        className="hidden shrink-0 select-none text-[0.65rem] font-semibold uppercase tracking-wider text-foreground-muted sm:inline"
        title="Design content language (separate from the UI language)"
      >
        Design
      </span>
      <Languages className="h-3.5 w-3.5 shrink-0 text-foreground-muted sm:hidden" aria-hidden />

      {LANGUAGES.map((lang) => {
        const isSource = lang.code === sourceLanguage
        const isActive = lang.code === active
        const variant = variants?.[lang.code]
        const created = !!variant
        const translated = created ? countOverrides(variants, lang.code) : 0

        // --- Source language: the original design. ---
        if (isSource) {
          return (
            <button
              key={lang.code}
              type="button"
              aria-pressed={isActive}
              aria-label={`Original design (${lang.englishName})`}
              title="Original design"
              onClick={() => setActive(lang.code)}
              data-design-lang={lang.code}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-medium transition',
                isActive
                  ? 'bg-brand-purple/25 text-foreground shadow-neon-purple'
                  : 'text-foreground-secondary hover:bg-white/10 hover:text-foreground',
              )}
            >
              {lang.label}
              <span className="ml-1 text-[0.6rem] opacity-60">Original</span>
            </button>
          )
        }

        // --- Non-source language: variant may or may not exist yet. ---
        // Not created → explicit "Create … Variant" action.
        if (!created) {
          const disabled = !hasObjects
          return (
            <button
              key={lang.code}
              type="button"
              aria-pressed={isActive}
              disabled={disabled}
              data-design-lang={lang.code}
              aria-label={`Create ${lang.englishName} variant`}
              title={
                disabled
                  ? `Create ${lang.englishName} variant — add a text object first`
                  : `Create ${lang.englishName} variant`
              }
              onClick={() => createVariant(lang.code)}
              className={cn(
                'flex items-center gap-1 rounded-lg border border-dashed px-2 py-1 text-xs font-medium transition',
                isActive
                  ? 'border-brand-purple/60 bg-brand-purple/15 text-foreground shadow-neon-purple'
                  : 'border-white/20 text-foreground-secondary hover:border-brand-purple/50 hover:bg-white/10 hover:text-foreground',
                disabled && 'cursor-not-allowed opacity-40 hover:border-white/20 hover:bg-transparent',
              )}
            >
              <Plus className="h-3 w-3" aria-hidden />
              {lang.label}
            </button>
          )
        }

        // Created → show the variant with its translation count.
        return (
          <button
            key={lang.code}
            type="button"
            aria-pressed={isActive}
            data-design-lang={lang.code}
            aria-label={`${lang.englishName} variant — ${translated} translated${
              translated === 0 ? ', not yet translated' : ''
            }`}
            title={
              translated === 0
                ? `${lang.englishName} variant created — nothing translated yet. Select a text object and edit it.`
                : `${lang.englishName} variant — ${translated} translated`
            }
            onClick={() => setActive(lang.code)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition',
              isActive
                ? 'bg-brand-purple/25 text-foreground shadow-neon-purple'
                : 'text-foreground-secondary hover:bg-white/10 hover:text-foreground',
            )}
          >
            {lang.label}
            <span
              className={cn(
                'rounded-full px-1.5 text-[0.6rem] font-semibold',
                translated === 0
                  ? 'bg-amber-400/20 text-amber-300'
                  : 'bg-emerald-400/20 text-emerald-300',
              )}
              aria-hidden
            >
              {translated === 0 ? 'not created' : `${translated}`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
