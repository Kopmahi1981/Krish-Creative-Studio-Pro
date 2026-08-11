/**
 * Canvas Object Engine — Domain Model (Phase 4.3).
 *
 * The data model is intentionally hierarchical and future-proof:
 *
 *   Project
 *     └── Document
 *           ├── metadata
 *           ├── settings
 *           └── pages[]
 *                 └── layers[]
 *                       └── objects[]   (generic CanvasObject union)
 *
 * Only one page / one layer exists today, but the model is designed for
 * multi-page documents (presentations, storyboards, comics, books, carousels),
 * multiple layers, groups, lock/unlock, templates, version history, and
 * collaboration — none of which require a later redesign.
 *
 * A single generic `CanvasObject` union carries every object kind. There is NO
 * language-specific object: text stores a Unicode string and renders it with a
 * configurable, Unicode-first font stack. Future kinds (image/shape/sticker/svg/
 * video/audio/ai) extend the union without touching existing code.
 */

import type { CanvasSizeId } from '../models/editor'
import type { Language } from '@/i18n/types'
import type { DocumentVariants } from '../i18n-content/types'

/** Geometry is expressed in intrinsic CANVAS pixels (pre-zoom). */
export interface CanvasRect {
  x: number
  y: number
  width: number
  height: number
}

/** Object kinds supported now and reserved for the future. */
export type CanvasObjectType =
  | 'text'
  | 'image'
  | 'shape'
  | 'sticker'
  | 'svg'
  | 'video'
  | 'audio'
  | 'ai'

/**
 * Common fields every object shares. `kind` discriminates the union; `props`
 * holds kind-specific data so new kinds need no schema change to the base.
 */
export interface CanvasObjectBase {
  id: string
  kind: CanvasObjectType
  /** Position + size in canvas pixels (relative to the page/artboard origin). */
  rect: CanvasRect
  /** Rotation in degrees (clockwise, around the object center). */
  rotation: number
  /** 0..1 */
  opacity: number
  visible: boolean
  /** Reserved for Phase 4.x lock/unlock. */
  locked: boolean
  /** Paint order within the layer: higher = on top. */
  zIndex: number
  /** Optional human label (layers panel, future). */
  name?: string
}

/** Typography options — only the subset used in 4.3 is active; the rest are
 *  typed now so future typography (spacing, weight, italic, stroke, gradient,
 *  curve, warp, vertical, RTL) needs NO model change. */
export interface TextStyle {
  fontSize: number
  /** Reference id into the configurable Font Manager (never a hardcoded family). */
  fontFamilyId: string
  color: string
  /** 'left' | 'center' | 'right' — also covers RTL via direction handling later. */
  align: 'left' | 'center' | 'right'
  // ---- Reserved (typed, unused) ----
  letterSpacing?: number
  lineHeight?: number
  fontWeight?: number | 'normal' | 'bold'
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  textStroke?: { color: string; width: number } | null
  shadow?: Record<string, unknown> | null
  /** Planned: 'horizontal' | 'vertical' for vertical text. */
  direction?: 'horizontal' | 'vertical'
  /** Planned: RTL handling flag. */
  rtl?: boolean
}

/** A text object — one generic type renders ANY Unicode content. */
export interface TextObject extends CanvasObjectBase {
  kind: 'text'
  /** The Unicode string (any script). Never assumed Latin. */
  textContent: string
  style: TextStyle
}

/** Placeholder for future kinds; today only `text` is constructed. */
export interface GenericObject extends CanvasObjectBase {
  kind: Exclude<CanvasObjectType, 'text'>
  props: Record<string, unknown>
}

export type CanvasObject = TextObject | GenericObject

/** A layer groups objects on a page (future: groups, lock, blend modes). */
export interface CanvasLayer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  /** Object ids in paint order (bottom → top). zIndex derived from index. */
  objectIds: string[]
}

/** A page is one artboard within the document. */
export interface CanvasPageModel {
  id: string
  name: string
  /** Page-specific background (CSS color). */
  background: string
  layers: CanvasLayer[]
}

/** Document-level settings (export defaults, snap, units, etc.). */
export interface CanvasDocumentSettings {
  /** Snap to guides/grid. Reserved for 4.x snapping UI. */
  snapEnabled: boolean
  /** Grid visible. Mirrors the workspace grid toggle (kept in sync). */
  gridVisible: boolean
  /** Working unit. Reserved. */
  unit: 'px'
}

export interface CanvasDocumentMetadata {
  title: string
  createdAt: string
  updatedAt: string
  /** Reserved for version history / collaboration. */
  revision: number
  /**
   * The language the ORIGINAL design content is authored in (Phase 5.2).
   * Defaults to 'en'. Objects in `pages/layers/objects` are always in this
   * language; every other language is a sparse overlay in `variants`.
   *
   * Optional so documents persisted before Phase 5.2 remain valid — readers
   * fall back to 'en'.
   */
  sourceLanguage?: Language
}

/**
 * The Document — the unit edited by the Object Engine. Multiple pages/layers are
 * supported by the shape even though the UI uses exactly one page + one layer.
 */
export interface CanvasDocumentModel {
  id: string
  size: { id: CanvasSizeId; width: number; height: number }
  metadata: CanvasDocumentMetadata
  settings: CanvasDocumentSettings
  pages: CanvasPageModel[]
  activePageId: string
  /**
   * MULTILINGUAL DESIGN CONTENT (Phase 5.2) — sparse translation overlay.
   *
   * Keyed by language; each entry holds `overrides` keyed by ORIGINAL object
   * id. Variant text lives ONLY here, never in the objects above, so a
   * language variant can never overwrite the source design. Geometry is stored
   * once (on the original object) and therefore cannot drift between languages.
   *
   * Optional: a document without variants is a valid, unmigrated document.
   */
  variants?: DocumentVariants
}

/** The top-level Project (future: multiple documents, assets, sharing). */
export interface CanvasProject {
  id: string
  name: string
  documents: CanvasDocumentModel[]
  activeDocumentId: string
}
