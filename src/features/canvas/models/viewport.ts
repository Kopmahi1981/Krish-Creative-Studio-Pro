import type { CanvasSize } from './editor'

/**
 * Zoom bounds for the EFFECTIVE scale (fitScale × userZoom).
 * fitScale itself can be tiny for large canvases (e.g. 1920×1080 in a small
 * window), so the floor is generous; the ceiling caps practical zoom-in.
 */
export const ZOOM_MIN = 0.02
export const ZOOM_MAX = 4

/** Padding (screen px) kept around the artboard inside the workspace. */
export const FIT_PADDING = 48

/** Smooth multiplicative step for zoom in / out (not a fixed additive delta). */
export const ZOOM_FACTOR = 1.2

/** Preset user-zoom multipliers exposed in the UI. */
export const PRESET_ZOOMS = [0.25, 0.5, 0.75, 1, 1.5, 2, 4] as const

export function clampScale(value: number): number {
  const rounded = Math.round(value * 10000) / 10000
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, rounded))
}

/**
 * Computes the largest scale at which `size` fits entirely within the available
 * workspace area (minus padding), without exceeding ZOOM_MAX. This is the
 * automatic FIT scale — independent of any user zoom. Guarantees the artboard is
 * never clipped. Falls back to ZOOM_MIN when the container has no measurable size
 * yet (e.g. before first layout).
 */
export function computeFitScale(
  size: CanvasSize,
  containerWidth: number,
  containerHeight: number,
): number {
  if (containerWidth <= 0 || containerHeight <= 0) return ZOOM_MIN
  const availW = Math.max(1, containerWidth - FIT_PADDING * 2)
  const availH = Math.max(1, containerHeight - FIT_PADDING * 2)
  const byWidth = availW / size.width
  const byHeight = availH / size.height
  return clampScale(Math.min(byWidth, byHeight))
}

/**
 * Clamp a proposed USER-ZOOM multiplier so the effective scale
 * (fitScale × userZoom) stays within [ZOOM_MIN, ZOOM_MAX]. Keeps zoom-in smooth
 * and bounded without letting the user push past the configured limits.
 */
export function clampUserZoom(userZoom: number, fitScale: number): number {
  if (fitScale <= 0) return 1
  const minZoom = ZOOM_MIN / fitScale
  const maxZoom = ZOOM_MAX / fitScale
  return Math.min(maxZoom, Math.max(minZoom, userZoom))
}

/** Snap an effective scale to the nearest preset for display/labeling. */
export function nearestPresetIndex(effective: number): number {
  let best = 0
  let bestDiff = Infinity
  PRESET_ZOOMS.forEach((p, i) => {
    const diff = Math.abs(p - effective)
    if (diff < bestDiff) {
      bestDiff = diff
      best = i
    }
  })
  return best
}
