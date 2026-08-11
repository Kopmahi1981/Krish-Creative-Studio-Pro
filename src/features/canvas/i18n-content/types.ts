/**
 * Multilingual DESIGN CONTENT — domain types (Phase 5.2).
 *
 * This is NOT UI localization (that is Phase 4.2.3, `src/i18n/**`, untouched).
 * These types describe translations of the *creative content* drawn on the
 * canvas.
 *
 * ARCHITECTURE — sparse override overlay, never a copy:
 *
 *   CanvasDocumentModel                ← the ONE design (geometry, layers, z-order)
 *     ├── metadata.sourceLanguage      ← 'en' by default
 *     ├── pages / layers / objects     ← the ORIGINAL, single source of truth
 *     └── variants
 *           ├── te → overrides { <originalObjectId>: TranslationOverride }
 *           └── hi → overrides { <originalObjectId>: TranslationOverride }
 *
 * Variant text lives ONLY in `document.variants[language].overrides[objectId]`.
 * The original objects are structurally unreachable from a variant write, so a
 * language variant can never overwrite the source design.
 *
 * Geometry is stored exactly ONCE (on the original object), so a Telugu variant
 * and the English source can never drift apart layout-wise.
 */

import type { Language } from '@/i18n/types'
import type { CanvasRect, TextStyle } from '../objects/model'

/**
 * Lifecycle of a single translation.
 * - 'draft'     — entered but not yet confirmed by the user.
 * - 'confirmed' — user-approved translation.
 * - 'stale'     — the ORIGINAL text changed after this translation was made.
 *                 The translation is preserved, never deleted; it is only flagged.
 */
export type TranslationStatus = 'draft' | 'confirmed' | 'stale'

/**
 * Where the translation came from. Phase 5.2 only ever writes 'manual'.
 * 'machine' / 'ai' exist so a future translation provider plugs in with NO
 * model change.
 */
export type TranslationOrigin = 'manual' | 'machine' | 'ai'

/** One translated text value for one original object in one language. */
export interface TranslationOverride {
  /** The translated Unicode string (any script). Never assumed Latin. */
  textContent: string
  status: TranslationStatus
  origin: TranslationOrigin
  /**
   * STALENESS ANCHOR (Phase 5.2).
   *
   * A verbatim snapshot of the ORIGINAL object's `textContent` at the moment
   * this translation was written. Staleness is therefore per-OBJECT and
   * content-derived:
   *
   *     isStale = override.sourceText !== original.textContent
   *
   * Deliberately NOT the document-level `metadata.revision`: a global counter
   * would mark every translation in the document stale whenever any unrelated
   * object changed. This anchor only reacts to the specific text it translated.
   */
  sourceText: string
  updatedAt: string
  /**
   * RESERVED for a future auto-fit / reflow engine: per-language geometry
   * adaptation. Phase 5.2 never writes this. When absent (always, today) the
   * resolver uses the original object's rect, so geometry cannot drift.
   */
  rect?: Partial<CanvasRect>
  /**
   * RESERVED for future per-language typography (e.g. a smaller size for a
   * longer Devanagari string). Phase 5.2 never writes this.
   */
  style?: Partial<TextStyle>
}

/** All translations for one language within one document. */
export interface DocumentVariant {
  language: Language
  createdAt: string
  updatedAt: string
  /**
   * SPARSE map keyed by the ORIGINAL object id. An absent key means "not
   * translated" and resolves to the source text — a graceful, free fallback.
   */
  overrides: Record<string, TranslationOverride>
}

/** Variants attached to a document, keyed by language. Always optional. */
export type DocumentVariants = Partial<Record<Language, DocumentVariant>>
