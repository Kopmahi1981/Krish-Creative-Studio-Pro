/**
 * Design Type definitions (Phase 5.1) — DATA ONLY.
 *
 * A design type describes WHAT the creative is, independent of platform.
 * Adding a new type here requires no component or type changes.
 */

import type { DesignTypeDef } from '../types/platform'

export const DESIGN_TYPES: DesignTypeDef[] = [
  { id: 'post', label: 'Post', description: 'Standard square feed post', aspectHint: '1:1' },
  { id: 'portrait-post', label: 'Portrait Post', description: 'Tall feed post for maximum feed real estate', aspectHint: '4:5' },
  { id: 'story', label: 'Story', description: 'Full-screen vertical story', aspectHint: '9:16' },
  { id: 'reel-cover', label: 'Reel Cover', description: 'Vertical cover frame for a reel or short', aspectHint: '9:16' },
  { id: 'thumbnail', label: 'Thumbnail', description: 'Video thumbnail artwork', aspectHint: '16:9' },
  { id: 'banner', label: 'Banner', description: 'Wide banner / channel or profile header', aspectHint: '16:9' },
  { id: 'ad', label: 'Ad', description: 'Paid placement creative', aspectHint: '1.91:1' },
  { id: 'cover', label: 'Cover', description: 'Page or profile cover image', aspectHint: '1.91:1' },
  { id: 'status', label: 'Status', description: 'Vertical status / ephemeral update', aspectHint: '9:16' },
  { id: 'flyer', label: 'Flyer', description: 'Promotional flyer for print or share', aspectHint: '4:5' },
  { id: 'poster', label: 'Poster', description: 'Large-format promotional poster', aspectHint: '4:5' },
  { id: 'carousel', label: 'Carousel', description: 'Multi-slide swipeable creative', aspectHint: '1:1' },
]
