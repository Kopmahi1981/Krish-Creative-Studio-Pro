/**
 * Platform & Format Registry — Domain Types (Phase 5.1).
 *
 * A single, serializable vocabulary describing WHERE a creative is published
 * (Platform), WHAT KIND of creative it is (Design Type), and the concrete
 * artboard geometry of that combination (Format).
 *
 *   Platform  (facebook, instagram, youtube, ...)
 *     └── DesignType  (post, story, thumbnail, banner, ...)
 *           └── Format  = `${platformId}.${designTypeId}` + width/height
 *
 * Design rules (do not break):
 *  - Ids are OPEN strings, not closed unions. Adding a platform / design type /
 *    format is a DATA edit only — never a type edit and never a component edit.
 *  - Data must stay SERIALIZABLE: no React elements, no Lucide components. Icons
 *    are referenced by the existing `TemplateIconName` string pattern.
 *  - Because ids are open, every consumer resolves through the registry's
 *    runtime guards/resolvers, which fall back safely instead of throwing.
 */

import type { AspectRatio, TemplateIconName, TemplateTone } from '@/features/templates/types/template'
import type { Language } from '@/i18n/types'

/** Open platform identifier, e.g. 'facebook', 'youtube', 'threads'. */
export type PlatformId = string

/** Open design-type identifier, e.g. 'post', 'story', 'thumbnail'. */
export type DesignTypeId = string

/**
 * Composite format identifier: `${platformId}.${designTypeId}`.
 * Template-literal typed so it is self-documenting while remaining open.
 */
export type FormatId = `${string}.${string}`

/**
 * The five historically shipped canvas sizes. These remain valid ids forever so
 * existing documents, persisted state and call sites keep working unchanged.
 */
export type LegacySizeId = 'square' | 'portrait' | 'story' | 'landscape-ad' | 'landscape'

/** Safe-area insets expressed as a FRACTION (0..0.5) of width/height. */
export interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

/** A publishing platform. Pure data. */
export interface PlatformDef {
  id: PlatformId
  label: string
  /** String key into the existing TEMPLATE_ICONS registry — never a component. */
  icon: TemplateIconName
  tone: TemplateTone
  /**
   * Whether the platform is surfaced in user-facing pickers. Definitions may
   * exist as data ahead of the UI/geometry work that exposes them.
   */
  enabled: boolean
  /** Design types this platform supports (ids into the design-type registry). */
  designTypes: DesignTypeId[]
}

/** A kind of creative, independent of platform. Pure data. */
export interface DesignTypeDef {
  id: DesignTypeId
  label: string
  description: string
  /** Nominal aspect, reusing the template library's existing ratio vocabulary. */
  aspectHint: AspectRatio
}

/** A concrete platform × design-type artboard definition. Pure data. */
export interface FormatDef {
  id: FormatId
  platformId: PlatformId
  designTypeId: DesignTypeId
  /** Intrinsic canvas pixels. */
  width: number
  height: number
  /** Optional per-format safe area; defaults to the global inset ratio. */
  safeArea?: SafeAreaInsets
  /**
   * Scripts this format is commonly authored in. Phase 5.1 does NOT read this;
   * it exists so later multilingual milestones need no schema change.
   */
  locales?: Language[]
  /** Bridge to one of the five originally shipped canvas size ids. */
  legacySizeId?: LegacySizeId
  /**
   * Whether the format is exposed in the Canvas Size Selector. Only formats
   * with verified geometry are enabled in Phase 5.1.
   */
  enabled: boolean
}
