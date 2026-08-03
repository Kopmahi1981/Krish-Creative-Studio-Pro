/**
 * Canvas editor domain models — Phase 4.1 (Canvas Foundation).
 *
 * These are pure, framework-agnostic TypeScript types that describe the editor's
 * state. Phase 4.1 only renders the shell (toolbars, workspace, status bar);
 * the interactive behaviors (drag, resize, rotate, text editing, etc.) are
 * deferred to later phases and will operate on these same shapes.
 *
 * Coordinate space: all element/page geometry is expressed in CANVAS pixels
 * (the document's intrinsic resolution, e.g. 1080×1080). The viewport applies a
 * scale factor to render those pixels onto the screen. Keeping geometry in
 * canvas space means zoom and export are pure transforms, not geometry rewrites.
 */

/** Intrinsic canvas document sizes supported by the studio. */
export type CanvasSizeId = 'square' | 'portrait' | 'story' | 'landscape-ad' | 'landscape'

/** A resolved canvas size: intrinsic pixel dimensions + human label. */
export interface CanvasSize {
  id: CanvasSizeId
  label: string
  /** Width in intrinsic canvas pixels. */
  width: number
  /** Height in intrinsic canvas pixels. */
  height: number
  /** Recommended use (shown in the size selector tooltip). */
  hint: string
}

/** A rectangle in canvas space (pixels). Origin is top-left of the page. */
export interface CanvasRect {
  x: number
  y: number
  width: number
  height: number
}

/** Supported element kinds. New kinds (image, shape) extend this union later. */
export type CanvasElementType = 'text' | 'image' | 'shape' | 'placeholder'

/**
 * A single element on a page. Phase 4.1 does not mutate these (no drag/resize/
 * rotate yet), but the shape is final so later phases edit in place.
 */
export interface CanvasElement {
  id: string
  type: CanvasElementType
  /** Bounding box in canvas pixels. */
  rect: CanvasRect
  /** z-order index; higher renders on top. */
  zIndex: number
  /** Opacity 0..1. */
  opacity: number
  /** Rotation in degrees (reserved; not yet interactive). */
  rotation: number
  /** Free-form label for the layers panel (Phase 4.2+). */
  name?: string
  /** Element-specific data (text content, fill, etc.) — reserved for later phases. */
  props: Record<string, unknown>
}

/** A single page within a multi-page document (Phase 4.1 uses exactly one). */
export interface CanvasPage {
  id: string
  name: string
  elements: CanvasElement[]
  /** Background color as a CSS color string (e.g. "#0f172a"). */
  background: string
}

/** The full editable document. */
export interface CanvasDocument {
  id: string
  title: string
  size: CanvasSize
  pages: CanvasPage[]
  /** Index of the active page in `pages`. */
  activePageIndex: number
}

/** What is currently selected in the editor. */
export interface CanvasSelection {
  /** Selected element ids (empty when nothing is selected). */
  elementIds: string[]
  /** Whether the page/artboard itself is the selection (e.g. for page bg edits). */
  pageSelected: boolean
}

/**
 * A smart guide line. Phase 4.1 renders the static "safe area" guide; draggable
 * snapping guides arrive in a later phase.
 */
export interface CanvasGuide {
  id: string
  orientation: 'horizontal' | 'vertical'
  /** Position in canvas pixels along the relevant axis. */
  position: number
  /** Whether the guide is a safe-area boundary (rendered distinctly). */
  kind: 'safe-area' | 'rule' | 'snap'
}

/**
 * Viewport: how the canvas document is mapped to the screen. `scale` is the zoom
 * factor (1 = 100%). `panX/panY` are device-pixel offsets of the artboard's
 * top-left from the workspace's top-left.
 */
export interface CanvasViewport {
  /** Zoom factor (e.g. 0.5 = 50%, 2 = 200%). */
  scale: number
  /** Horizontal pan offset in screen pixels. */
  panX: number
  /** Vertical pan offset in screen pixels. */
  panY: number
}

/**
 * Undo/redo history. Generic over the document snapshot so it is decoupled from
 * any specific editor implementation. Phase 4.1 renders the controls; actual
 * snapshotting of edits begins when editing ships.
 */
export interface CanvasHistory {
  /** Past document snapshots (oldest first). */
  past: CanvasDocument[]
  /** Future document snapshots for redo (newest first). */
  future: CanvasDocument[]
  /** Arbitrary limit; when exceeded the oldest entry is dropped. */
  limit: number
}

/** Editor tool modes for the left toolbar (visual-only in Phase 4.1). */
export type CanvasTool = 'select' | 'text' | 'image' | 'shape' | 'hand'
