/**
 * Platform & Format Registry — public surface (Phase 5.1).
 *
 * Consumers should import from `@/features/platforms`, never from the
 * `data/` modules directly, so the registry stays the single source of truth
 * and its resolvers/guards are always applied.
 */

export type {
  PlatformId,
  DesignTypeId,
  FormatId,
  LegacySizeId,
  SafeAreaInsets,
  PlatformDef,
  DesignTypeDef,
  FormatDef,
} from './types/platform'

export {
  PLATFORM_DEFS,
  DESIGN_TYPES,
  FORMAT_DEFS,
  DEFAULT_FORMAT_ID,
  DEFAULT_SAFE_AREA_RATIO,
  isKnownPlatform,
  isKnownDesignType,
  isKnownFormat,
  isLegacySizeId,
  getPlatform,
  getDesignType,
  resolveFormat,
  findFormat,
  toFormatId,
  getSafeArea,
  listEnabledFormats,
  listAllFormats,
  listEnabledPlatforms,
  listFormatsByPlatform,
  listEnabledFormatsGrouped,
  formatLabel,
  formatDimensions,
} from './registry'
