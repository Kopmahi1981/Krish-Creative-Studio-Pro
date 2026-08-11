/**
 * Platform & Format Registry (Phase 5.1).
 *
 * The SINGLE SOURCE OF TRUTH for platforms, design types and artboard formats.
 *
 * Because ids are open strings (data-driven, not closed unions), every lookup
 * goes through a resolver here. Resolvers NEVER throw: unknown ids fall back to
 * the canonical default format so a malformed or future id can never blank the
 * artboard or crash the editor.
 *
 * Legacy bridge: the five originally shipped canvas size ids
 * ('square' | 'portrait' | 'story' | 'landscape-ad' | 'landscape') remain valid
 * inputs everywhere and resolve to their corresponding registry format.
 */

import { PLATFORM_DEFS } from './data/platforms'
import { DESIGN_TYPES } from './data/designTypes'
import { FORMAT_DEFS } from './data/formats'
import type {
  DesignTypeDef,
  DesignTypeId,
  FormatDef,
  FormatId,
  LegacySizeId,
  PlatformDef,
  PlatformId,
  SafeAreaInsets,
} from './types/platform'

export { PLATFORM_DEFS, DESIGN_TYPES, FORMAT_DEFS }

/* ------------------------------- Indexes -------------------------------- */

const PLATFORM_MAP = new Map<PlatformId, PlatformDef>(PLATFORM_DEFS.map((p) => [p.id, p]))
const DESIGN_TYPE_MAP = new Map<DesignTypeId, DesignTypeDef>(DESIGN_TYPES.map((d) => [d.id, d]))
const FORMAT_MAP = new Map<string, FormatDef>(FORMAT_DEFS.map((f) => [f.id, f]))

/** legacy size id -> format, built from the `legacySizeId` bridge field. */
const LEGACY_MAP = new Map<string, FormatDef>(
  FORMAT_DEFS.filter((f) => f.legacySizeId).map((f) => [f.legacySizeId as string, f]),
)

/**
 * The canonical fallback. `instagram.post` is the 1080×1080 square that has
 * always been the editor's default document size.
 */
export const DEFAULT_FORMAT_ID: FormatId = 'instagram.post'

const DEFAULT_FORMAT: FormatDef =
  FORMAT_MAP.get(DEFAULT_FORMAT_ID) ?? FORMAT_DEFS.find((f) => f.enabled) ?? FORMAT_DEFS[0]

/** Default safe-area inset fraction, matching the historical canvas behaviour. */
export const DEFAULT_SAFE_AREA_RATIO = 0.1

/* ------------------------------- Guards --------------------------------- */

export function isKnownPlatform(id: string): boolean {
  return PLATFORM_MAP.has(id)
}

export function isKnownDesignType(id: string): boolean {
  return DESIGN_TYPE_MAP.has(id)
}

/** True when the id is a registry format id OR a legacy canvas size id. */
export function isKnownFormat(id: string): boolean {
  return FORMAT_MAP.has(id) || LEGACY_MAP.has(id)
}

export function isLegacySizeId(id: string): id is LegacySizeId {
  return LEGACY_MAP.has(id)
}

/* ------------------------------ Resolvers -------------------------------- */

export function getPlatform(id: PlatformId): PlatformDef | undefined {
  return PLATFORM_MAP.get(id)
}

export function getDesignType(id: DesignTypeId): DesignTypeDef | undefined {
  return DESIGN_TYPE_MAP.get(id)
}

/**
 * Resolve ANY id — registry format id or legacy canvas size id — to a format.
 * Never throws; unknown ids resolve to the canonical default format.
 */
export function resolveFormat(id: string | null | undefined): FormatDef {
  if (!id) return DEFAULT_FORMAT
  return FORMAT_MAP.get(id) ?? LEGACY_MAP.get(id) ?? DEFAULT_FORMAT
}

/** Strict lookup used where a miss should be distinguishable (returns undefined). */
export function findFormat(id: string): FormatDef | undefined {
  return FORMAT_MAP.get(id) ?? LEGACY_MAP.get(id)
}

/**
 * Normalize any incoming id to its canonical registry FormatId.
 * Legacy ids are mapped forward; unknown ids collapse to the default.
 */
export function toFormatId(id: string | null | undefined): FormatId {
  return resolveFormat(id).id
}

/** Resolve a format's safe-area insets, falling back to the global ratio. */
export function getSafeArea(id: string): SafeAreaInsets {
  const format = resolveFormat(id)
  return (
    format.safeArea ?? {
      top: DEFAULT_SAFE_AREA_RATIO,
      right: DEFAULT_SAFE_AREA_RATIO,
      bottom: DEFAULT_SAFE_AREA_RATIO,
      left: DEFAULT_SAFE_AREA_RATIO,
    }
  )
}

/* ------------------------------- Queries --------------------------------- */

/** Formats exposed to users. Phase 5.1: exactly the five verified geometries. */
export function listEnabledFormats(): FormatDef[] {
  return FORMAT_DEFS.filter((f) => f.enabled && isPlatformEnabled(f.platformId))
}

/** Every format in the registry, enabled or not. */
export function listAllFormats(): FormatDef[] {
  return FORMAT_DEFS
}

export function listEnabledPlatforms(): PlatformDef[] {
  return PLATFORM_DEFS.filter((p) => p.enabled)
}

function isPlatformEnabled(id: PlatformId): boolean {
  return PLATFORM_MAP.get(id)?.enabled ?? false
}

/** Formats belonging to a platform (optionally only the enabled ones). */
export function listFormatsByPlatform(platformId: PlatformId, enabledOnly = true): FormatDef[] {
  return FORMAT_DEFS.filter(
    (f) => f.platformId === platformId && (!enabledOnly || f.enabled),
  )
}

/**
 * Enabled formats grouped by platform, in registry order. Used by the Canvas
 * Size Selector to render `<optgroup>`-style grouping without any
 * platform-specific logic living in the component.
 */
export function listEnabledFormatsGrouped(): { platform: PlatformDef; formats: FormatDef[] }[] {
  return listEnabledPlatforms()
    .map((platform) => ({ platform, formats: listFormatsByPlatform(platform.id, true) }))
    .filter((group) => group.formats.length > 0)
}

/** Human-readable label for a format, e.g. "Instagram · Story". */
export function formatLabel(id: string): string {
  const format = resolveFormat(id)
  const platform = getPlatform(format.platformId)?.label ?? format.platformId
  const designType = getDesignType(format.designTypeId)?.label ?? format.designTypeId
  return `${platform} · ${designType}`
}

/** Dimension suffix, e.g. "1080×1080". */
export function formatDimensions(id: string): string {
  const format = resolveFormat(id)
  return `${format.width}×${format.height}`
}
