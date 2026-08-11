/**
 * Format definitions (Phase 5.1) — DATA ONLY.
 *
 * A Format is a concrete platform × design-type artboard with real geometry.
 *
 * GEOMETRY POLICY (Phase 5.1):
 * Only the five historically VERIFIED canvas dimensions may appear here:
 *
 *   1080×1080   Square
 *   1080×1350   Portrait
 *   1080×1920   Story
 *   1200×628    Ad (Landscape)
 *   1920×1080   Wide
 *
 * No unverified geometry is invented. Additional platform/design-type
 * combinations are declared as data by REUSING one of the five verified
 * dimensions, and ship with `enabled: false` so they are not surfaced in the
 * Canvas Size Selector until a later approved milestone verifies them.
 *
 * Exactly five formats are `enabled: true` — the five canonical formats that
 * carry the original `legacySizeId` values.
 */

import type { FormatDef } from '../types/platform'

/** The five verified artboard geometries, referenced by name for clarity. */
const SQUARE = { width: 1080, height: 1080 } as const
const PORTRAIT = { width: 1080, height: 1350 } as const
const STORY = { width: 1080, height: 1920 } as const
const AD_LANDSCAPE = { width: 1200, height: 628 } as const
const WIDE = { width: 1920, height: 1080 } as const

export const FORMAT_DEFS: FormatDef[] = [
  /* ---------------------------------------------------------------------
   * CANONICAL FORMATS — the five verified, user-exposed artboards.
   * Each carries a `legacySizeId` so existing documents keep resolving.
   * ------------------------------------------------------------------- */
  {
    id: 'instagram.post',
    platformId: 'instagram',
    designTypeId: 'post',
    ...SQUARE,
    legacySizeId: 'square',
    enabled: true,
  },
  {
    id: 'instagram.portrait-post',
    platformId: 'instagram',
    designTypeId: 'portrait-post',
    ...PORTRAIT,
    legacySizeId: 'portrait',
    enabled: true,
  },
  {
    id: 'instagram.story',
    platformId: 'instagram',
    designTypeId: 'story',
    ...STORY,
    legacySizeId: 'story',
    enabled: true,
  },
  {
    id: 'facebook.ad',
    platformId: 'facebook',
    designTypeId: 'ad',
    ...AD_LANDSCAPE,
    legacySizeId: 'landscape-ad',
    enabled: true,
  },
  {
    id: 'youtube.banner',
    platformId: 'youtube',
    designTypeId: 'banner',
    ...WIDE,
    legacySizeId: 'landscape',
    enabled: true,
  },

  /* ---------------------------------------------------------------------
   * DATA-ONLY FORMATS — declared for registry completeness across platforms.
   * They reuse verified geometry and are NOT exposed (enabled: false) until a
   * later approved milestone verifies their real platform dimensions.
   * ------------------------------------------------------------------- */
  { id: 'facebook.post', platformId: 'facebook', designTypeId: 'post', ...SQUARE, enabled: false },
  { id: 'facebook.portrait-post', platformId: 'facebook', designTypeId: 'portrait-post', ...PORTRAIT, enabled: false },
  { id: 'facebook.story', platformId: 'facebook', designTypeId: 'story', ...STORY, enabled: false },
  { id: 'facebook.cover', platformId: 'facebook', designTypeId: 'cover', ...AD_LANDSCAPE, enabled: false },
  { id: 'facebook.carousel', platformId: 'facebook', designTypeId: 'carousel', ...SQUARE, enabled: false },
  { id: 'facebook.flyer', platformId: 'facebook', designTypeId: 'flyer', ...PORTRAIT, enabled: false },
  { id: 'facebook.poster', platformId: 'facebook', designTypeId: 'poster', ...PORTRAIT, enabled: false },

  { id: 'instagram.reel-cover', platformId: 'instagram', designTypeId: 'reel-cover', ...STORY, enabled: false },
  { id: 'instagram.carousel', platformId: 'instagram', designTypeId: 'carousel', ...SQUARE, enabled: false },
  { id: 'instagram.ad', platformId: 'instagram', designTypeId: 'ad', ...AD_LANDSCAPE, enabled: false },
  { id: 'instagram.flyer', platformId: 'instagram', designTypeId: 'flyer', ...PORTRAIT, enabled: false },
  { id: 'instagram.poster', platformId: 'instagram', designTypeId: 'poster', ...PORTRAIT, enabled: false },

  { id: 'youtube.thumbnail', platformId: 'youtube', designTypeId: 'thumbnail', ...WIDE, enabled: false },
  { id: 'youtube.story', platformId: 'youtube', designTypeId: 'story', ...STORY, enabled: false },
  { id: 'youtube.reel-cover', platformId: 'youtube', designTypeId: 'reel-cover', ...STORY, enabled: false },

  { id: 'tiktok.story', platformId: 'tiktok', designTypeId: 'story', ...STORY, enabled: false },
  { id: 'tiktok.reel-cover', platformId: 'tiktok', designTypeId: 'reel-cover', ...STORY, enabled: false },
  { id: 'tiktok.ad', platformId: 'tiktok', designTypeId: 'ad', ...STORY, enabled: false },

  { id: 'x.post', platformId: 'x', designTypeId: 'post', ...SQUARE, enabled: false },
  { id: 'x.banner', platformId: 'x', designTypeId: 'banner', ...WIDE, enabled: false },
  { id: 'x.ad', platformId: 'x', designTypeId: 'ad', ...AD_LANDSCAPE, enabled: false },
  { id: 'x.cover', platformId: 'x', designTypeId: 'cover', ...AD_LANDSCAPE, enabled: false },

  { id: 'linkedin.post', platformId: 'linkedin', designTypeId: 'post', ...SQUARE, enabled: false },
  { id: 'linkedin.ad', platformId: 'linkedin', designTypeId: 'ad', ...AD_LANDSCAPE, enabled: false },
  { id: 'linkedin.banner', platformId: 'linkedin', designTypeId: 'banner', ...WIDE, enabled: false },
  { id: 'linkedin.cover', platformId: 'linkedin', designTypeId: 'cover', ...AD_LANDSCAPE, enabled: false },
  { id: 'linkedin.carousel', platformId: 'linkedin', designTypeId: 'carousel', ...SQUARE, enabled: false },

  { id: 'pinterest.post', platformId: 'pinterest', designTypeId: 'post', ...SQUARE, enabled: false },
  { id: 'pinterest.portrait-post', platformId: 'pinterest', designTypeId: 'portrait-post', ...PORTRAIT, enabled: false },
  { id: 'pinterest.story', platformId: 'pinterest', designTypeId: 'story', ...STORY, enabled: false },
  { id: 'pinterest.poster', platformId: 'pinterest', designTypeId: 'poster', ...PORTRAIT, enabled: false },

  { id: 'whatsapp.status', platformId: 'whatsapp', designTypeId: 'status', ...STORY, enabled: false },
  { id: 'whatsapp.post', platformId: 'whatsapp', designTypeId: 'post', ...SQUARE, enabled: false },
  { id: 'whatsapp.flyer', platformId: 'whatsapp', designTypeId: 'flyer', ...PORTRAIT, enabled: false },

  { id: 'snapchat.story', platformId: 'snapchat', designTypeId: 'story', ...STORY, enabled: false },
  { id: 'snapchat.ad', platformId: 'snapchat', designTypeId: 'ad', ...STORY, enabled: false },

  { id: 'threads.post', platformId: 'threads', designTypeId: 'post', ...SQUARE, enabled: false },
  { id: 'threads.portrait-post', platformId: 'threads', designTypeId: 'portrait-post', ...PORTRAIT, enabled: false },
  { id: 'threads.carousel', platformId: 'threads', designTypeId: 'carousel', ...SQUARE, enabled: false },

  { id: 'google.ad', platformId: 'google', designTypeId: 'ad', ...AD_LANDSCAPE, enabled: false },
  { id: 'google.banner', platformId: 'google', designTypeId: 'banner', ...WIDE, enabled: false },
]
