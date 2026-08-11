/**
 * Variant helpers (Phase 5.2) — PURE functions over the variant overlay.
 *
 * Every one of these returns NEW data and never mutates its input. None of them
 * can reach an original object: they only ever produce `DocumentVariants`.
 * That structural separation is the primary guarantee that variant editing
 * cannot overwrite the source design.
 */

import type { Language } from '@/i18n/types'
import type {
  DocumentVariant,
  DocumentVariants,
  TranslationOrigin,
  TranslationOverride,
  TranslationStatus,
} from './types'

/** Create an empty variant for a language. */
export function createVariant(language: Language): DocumentVariant {
  const now = new Date().toISOString()
  return { language, createdAt: now, updatedAt: now, overrides: {} }
}

/** Read a single override, or undefined when the object is untranslated. */
export function getOverride(
  variants: DocumentVariants | undefined,
  language: Language,
  objectId: string,
): TranslationOverride | undefined {
  return variants?.[language]?.overrides[objectId]
}

/**
 * Write (or replace) the translation for one object in one language.
 *
 * `sourceText` is the ORIGINAL object's current text and becomes the staleness
 * anchor for this override.
 */
export function setOverride(
  variants: DocumentVariants | undefined,
  language: Language,
  objectId: string,
  textContent: string,
  sourceText: string,
  opts?: { status?: TranslationStatus; origin?: TranslationOrigin },
): DocumentVariants {
  const now = new Date().toISOString()
  const existing = variants?.[language] ?? createVariant(language)
  const override: TranslationOverride = {
    textContent,
    // A freshly written translation is never stale: it is anchored to the text
    // it was written against.
    status: opts?.status ?? 'confirmed',
    origin: opts?.origin ?? 'manual',
    sourceText,
    updatedAt: now,
  }
  return {
    ...variants,
    [language]: {
      ...existing,
      updatedAt: now,
      overrides: { ...existing.overrides, [objectId]: override },
    },
  }
}

/** Remove one object's translation in a single language. */
export function clearOverride(
  variants: DocumentVariants | undefined,
  language: Language,
  objectId: string,
): DocumentVariants {
  const variant = variants?.[language]
  if (!variant || !(objectId in variant.overrides)) return variants ?? {}
  const { [objectId]: _removed, ...rest } = variant.overrides
  return {
    ...variants,
    [language]: { ...variant, updatedAt: new Date().toISOString(), overrides: rest },
  }
}

/**
 * CASCADE DELETE — drop an object's overrides from EVERY language.
 *
 * Called when the original object is deleted: an override with no base object
 * is unreachable garbage, so it is removed rather than orphaned.
 */
export function removeObjectFromAllVariants(
  variants: DocumentVariants | undefined,
  objectId: string,
): DocumentVariants {
  if (!variants) return {}
  let changed = false
  const next: DocumentVariants = {}
  for (const [lang, variant] of Object.entries(variants) as [Language, DocumentVariant][]) {
    if (!variant) continue
    if (objectId in variant.overrides) {
      const { [objectId]: _removed, ...rest } = variant.overrides
      next[lang] = { ...variant, overrides: rest }
      changed = true
    } else {
      next[lang] = variant
    }
  }
  return changed ? next : variants
}

/** Drop overrides whose original object no longer exists (defensive cleanup). */
export function pruneOverrides(
  variants: DocumentVariants | undefined,
  liveObjectIds: Set<string>,
): DocumentVariants {
  if (!variants) return {}
  const next: DocumentVariants = {}
  for (const [lang, variant] of Object.entries(variants) as [Language, DocumentVariant][]) {
    if (!variant) continue
    const overrides: Record<string, TranslationOverride> = {}
    for (const [objectId, ov] of Object.entries(variant.overrides)) {
      if (liveObjectIds.has(objectId)) overrides[objectId] = ov
    }
    next[lang] = { ...variant, overrides }
  }
  return next
}

/**
 * STALENESS MARKING — the original text for `objectId` just changed.
 *
 * Every language override for that ONE object is flagged `status: 'stale'`.
 * Translations are PRESERVED, never deleted: a stale translation is far more
 * useful to the user than a lost one. `sourceText` is intentionally left at its
 * old value so the derived check (`sourceText !== current`) keeps agreeing, and
 * so a future UI can diff old-vs-new source text.
 *
 * Scope is per-object: unrelated translations in the same document are
 * untouched. This is why the document-level `revision` counter is NOT used.
 */
export function markOverridesStale(
  variants: DocumentVariants | undefined,
  objectId: string,
  newSourceText: string,
): DocumentVariants {
  if (!variants) return {}
  let changed = false
  const next: DocumentVariants = {}
  for (const [lang, variant] of Object.entries(variants) as [Language, DocumentVariant][]) {
    if (!variant) continue
    const ov = variant.overrides[objectId]
    // Only mark when the source text actually differs from this override's anchor.
    if (ov && ov.sourceText !== newSourceText && ov.status !== 'stale') {
      next[lang] = {
        ...variant,
        overrides: { ...variant.overrides, [objectId]: { ...ov, status: 'stale' } },
      }
      changed = true
    } else {
      next[lang] = variant
    }
  }
  return changed ? next : variants
}

/**
 * DERIVED staleness — the self-healing safety net.
 *
 * Even if a code path ever forgets to call `markOverridesStale`, a translation
 * whose anchor no longer matches the live source text is still reported stale.
 */
export function isOverrideStale(
  override: TranslationOverride | undefined,
  currentSourceText: string,
): boolean {
  if (!override) return false
  return override.status === 'stale' || override.sourceText !== currentSourceText
}

/** Count translated objects in a language (for badges / status display). */
export function countOverrides(
  variants: DocumentVariants | undefined,
  language: Language,
): number {
  return Object.keys(variants?.[language]?.overrides ?? {}).length
}
