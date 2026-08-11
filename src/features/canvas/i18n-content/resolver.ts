/**
 * Translation resolver (Phase 5.2) — PURE, read-only, identity-stable.
 *
 * Sits between the store and the render layer so `TextObjectView`,
 * `SelectionOverlay` and `TextEditorOverlay` need no structural change: they
 * receive an already-resolved object and stay language-agnostic.
 *
 * IDENTITY STABILITY IS MANDATORY.
 * Zustand selectors feed React's `useSyncExternalStore`, which requires a
 * cached snapshot. Returning a freshly-built object on every call causes the
 * "getSnapshot should be cached" infinite render loop (this exact bug bit us in
 * Phase 5.1 when `getCanvasSize` was made derived). Therefore:
 *
 *   1. When no override applies, we return the ORIGINAL object REFERENCE,
 *      unchanged — the common path allocates nothing.
 *   2. When an override applies, the resolved object is memoized on a cache key
 *      of (objectId, language, override.updatedAt, source identity), so repeat
 *      renders get the same reference until something genuinely changes.
 */

import type { Language } from '@/i18n/types'
import type { CanvasObject, TextObject } from '../objects/model'
import type { DocumentVariants, TranslationOverride } from './types'
import { getOverride } from './variants'

/** Memo cache: key → resolved object. Bounded to avoid unbounded growth. */
const RESOLVE_CACHE = new Map<string, CanvasObject>()
const CACHE_LIMIT = 2000

function cacheKey(objectId: string, language: Language, ov: TranslationOverride): string {
  return `${objectId}|${language}|${ov.updatedAt}|${ov.textContent}`
}

function remember(key: string, value: CanvasObject): CanvasObject {
  if (RESOLVE_CACHE.size > CACHE_LIMIT) RESOLVE_CACHE.clear()
  RESOLVE_CACHE.set(key, value)
  return value
}

/**
 * Resolve one object for display in `language`.
 *
 * Returns the ORIGINAL reference when:
 *  - the active language IS the source language, or
 *  - the object is not a text object, or
 *  - no override exists (untranslated → graceful fallback to source).
 *
 * NEVER mutates the input object.
 */
export function resolveObject(
  object: CanvasObject,
  language: Language,
  sourceLanguage: Language,
  variants: DocumentVariants | undefined,
): CanvasObject {
  if (language === sourceLanguage) return object
  if (object.kind !== 'text') return object

  const ov = getOverride(variants, language, object.id)
  // Untranslated → fall back to the source object, unchanged.
  if (!ov) return object

  const key = cacheKey(object.id, language, ov)
  const cached = RESOLVE_CACHE.get(key)
  // Guard against a stale cache entry built from a previous source object.
  if (cached && (cached as TextObject).rect === object.rect) return cached

  const text = object as TextObject
  const resolved: TextObject = {
    ...text,
    textContent: ov.textContent,
    // RESERVED merge points for a future auto-fit engine. Both are always
    // absent in Phase 5.2, so geometry/style come from the original object and
    // cannot drift between languages.
    rect: ov.rect ? { ...text.rect, ...ov.rect } : text.rect,
    style: ov.style ? { ...text.style, ...ov.style } : text.style,
  }
  return remember(key, resolved)
}

/**
 * Resolve just the display string for an object.
 * Falls back to the source text when untranslated or when the language is
 * unknown/unsupported — never throws.
 */
export function resolveText(
  object: CanvasObject,
  language: Language,
  sourceLanguage: Language,
  variants: DocumentVariants | undefined,
): string {
  if (object.kind !== 'text') return ''
  const text = object as TextObject
  if (language === sourceLanguage) return text.textContent
  return getOverride(variants, language, object.id)?.textContent ?? text.textContent
}

/** True when the object has an explicit translation in `language`. */
export function hasTranslation(
  objectId: string,
  language: Language,
  sourceLanguage: Language,
  variants: DocumentVariants | undefined,
): boolean {
  if (language === sourceLanguage) return true
  return getOverride(variants, language, objectId) !== undefined
}

/** Test seam: clear the memo cache. */
export function __clearResolveCache(): void {
  RESOLVE_CACHE.clear()
}
