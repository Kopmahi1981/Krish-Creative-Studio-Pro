import type { CanvasSize } from './editor'
import type { CanvasGuide } from './editor'
import {
  DEFAULT_SAFE_AREA_RATIO,
  formatDimensions,
  formatLabel,
  getDesignType,
  listEnabledFormats,
  listEnabledFormatsGrouped,
  resolveFormat,
} from '@/features/platforms'
import type { FormatDef } from '@/features/platforms'

/**
 * Canvas sizes are DERIVED from the Platform & Format Registry (Phase 5.1).
 *
 * Before 5.1 this file held five hardcoded literals. It now projects the
 * registry's ENABLED formats into the `CanvasSize` shape the editor already
 * uses, so the artboard, object store, viewport and selector are unchanged.
 *
 * Backwards compatibility: a format carrying a `legacySizeId` keeps that legacy
 * id as its `CanvasSize.id`, so existing documents, persisted state and the
 * existing `size.*` i18n keys continue to resolve exactly as before.
 */

/**
 * Project one registry format into the editor's CanvasSize shape.
 *
 * IDENTITY STABILITY IS REQUIRED: zustand selectors (e.g. `selectActiveSize`)
 * return the result of `getCanvasSize`, and React's `useSyncExternalStore`
 * demands a cached snapshot — returning a freshly-built object on every call
 * causes an infinite render loop. Results are therefore memoized per id.
 */
const CANVAS_SIZE_CACHE = new Map<string, CanvasSize>()

function toCanvasSize(format: FormatDef): CanvasSize {
  const key = format.legacySizeId ?? format.id
  const cached = CANVAS_SIZE_CACHE.get(key)
  if (cached) return cached
  const size: CanvasSize = {
    // Legacy id wins so existing ids / i18n keys keep working untouched.
    id: key,
    label: formatLabel(format.id),
    width: format.width,
    height: format.height,
    hint: getDesignType(format.designTypeId)?.description ?? formatDimensions(format.id),
  }
  CANVAS_SIZE_CACHE.set(key, size)
  return size
}

/**
 * The user-selectable output sizes, derived from the registry. Phase 5.1
 * exposes exactly the five verified geometries (1080×1080, 1080×1350,
 * 1080×1920, 1200×628, 1920×1080).
 */
export const CANVAS_SIZES: CanvasSize[] = listEnabledFormats().map(toCanvasSize)

/**
 * Enabled sizes grouped by platform, for grouped pickers. No component needs
 * platform-specific logic — grouping is pure registry data.
 */
export const CANVAS_SIZE_GROUPS: { platformId: string; platformLabel: string; sizes: CanvasSize[] }[] =
  listEnabledFormatsGrouped().map(({ platform, formats }) => ({
    platformId: platform.id,
    platformLabel: platform.label,
    sizes: formats.map(toCanvasSize),
  }))

/**
 * Lookup helper for size selectors and labels. Accepts a legacy size id OR a
 * registry format id. Never throws — unknown ids resolve to the default format.
 */
export const getCanvasSize = (id: CanvasSize['id']): CanvasSize => toCanvasSize(resolveFormat(id))

/**
 * Default safe-area inset as a fraction of the artboard (10% on each side),
 * matching common social-platform "safe zone" guidance.
 */
export const SAFE_AREA_INSET_RATIO = DEFAULT_SAFE_AREA_RATIO

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
