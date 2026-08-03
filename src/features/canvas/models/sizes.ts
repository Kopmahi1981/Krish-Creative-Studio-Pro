import type { CanvasSize } from './editor'
import type { CanvasGuide } from './editor'

/**
 * The five supported output sizes, expressed in intrinsic canvas pixels.
 * These drive the Size Selector and the artboard's rendered dimensions.
 */
export const CANVAS_SIZES: CanvasSize[] = [
  { id: 'square', label: 'Square', width: 1080, height: 1080, hint: 'Instagram / Facebook post' },
  { id: 'portrait', label: 'Portrait', width: 1080, height: 1350, hint: 'Instagram portrait' },
  { id: 'story', label: 'Story', width: 1080, height: 1920, hint: 'Stories / Reels / TikTok' },
  { id: 'landscape-ad', label: 'Ad (Landscape)', width: 1200, height: 628, hint: 'Facebook / LinkedIn ad' },
  { id: 'landscape', label: 'Wide', width: 1920, height: 1080, hint: 'YouTube / desktop banner' },
]

/** Lookup helper for size selectors and labels. */
export const getCanvasSize = (id: CanvasSize['id']): CanvasSize =>
  CANVAS_SIZES.find((s) => s.id === id) ?? CANVAS_SIZES[0]

/**
 * Default safe-area inset as a fraction of the artboard (10% on each side),
 * matching common social-platform "safe zone" guidance.
 */
export const SAFE_AREA_INSET_RATIO = 0.1

/** Build the safe-area guide lines (top, bottom, left, right) for a size. */
export function buildSafeAreaGuides(width: number, height: number): CanvasGuide[] {
  const ix = width * SAFE_AREA_INSET_RATIO
  const iy = height * SAFE_AREA_INSET_RATIO
  return [
    { id: 'safe-top', orientation: 'horizontal', position: iy, kind: 'safe-area' },
    { id: 'safe-bottom', orientation: 'horizontal', position: height - iy, kind: 'safe-area' },
    { id: 'safe-left', orientation: 'vertical', position: ix, kind: 'safe-area' },
    { id: 'safe-right', orientation: 'vertical', position: width - ix, kind: 'safe-area' },
  ]
}

/**
 * Center cross guides (vertical + horizontal through the artboard center).
 * Rendered distinctly from the safe-area guides.
 */
export function buildCenterGuides(width: number, height: number): CanvasGuide[] {
  return [
    { id: 'center-v', orientation: 'vertical', position: width / 2, kind: 'rule' },
    { id: 'center-h', orientation: 'horizontal', position: height / 2, kind: 'rule' },
  ]
}
