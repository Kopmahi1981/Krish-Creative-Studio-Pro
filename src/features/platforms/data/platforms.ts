/**
 * Platform definitions (Phase 5.1) — DATA ONLY.
 *
 * Adding, removing or re-tagging a platform is a data edit here. No React
 * component contains platform-specific branching.
 *
 * `enabled` controls whether a platform is surfaced in user-facing pickers.
 * Definitions may exist ahead of the verified geometry that exposes them.
 */

import type { PlatformDef } from '../types/platform'

export const PLATFORM_DEFS: PlatformDef[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: 'Megaphone',
    tone: 'cyan',
    enabled: true,
    designTypes: ['post', 'portrait-post', 'story', 'ad', 'cover', 'carousel', 'flyer', 'poster'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'Sparkles',
    tone: 'rose',
    enabled: true,
    designTypes: ['post', 'portrait-post', 'story', 'reel-cover', 'carousel', 'ad', 'flyer', 'poster'],
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: 'PlayCircle',
    tone: 'rose',
    enabled: true,
    designTypes: ['thumbnail', 'banner', 'story', 'reel-cover'],
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: 'Zap',
    tone: 'purple',
    enabled: true,
    designTypes: ['story', 'reel-cover', 'ad'],
  },
  {
    id: 'x',
    label: 'X',
    icon: 'AtSign',
    tone: 'slate',
    enabled: true,
    designTypes: ['post', 'banner', 'ad', 'cover'],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'Briefcase',
    tone: 'cyan',
    enabled: true,
    designTypes: ['post', 'ad', 'banner', 'cover', 'carousel'],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    icon: 'Image',
    tone: 'rose',
    enabled: true,
    designTypes: ['post', 'portrait-post', 'story', 'poster'],
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageCircle',
    tone: 'cyan',
    enabled: true,
    designTypes: ['status', 'post', 'flyer'],
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    icon: 'Camera',
    tone: 'purple',
    enabled: true,
    designTypes: ['story', 'ad'],
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: 'AtSign',
    tone: 'slate',
    enabled: true,
    designTypes: ['post', 'portrait-post', 'carousel'],
  },
  {
    id: 'google',
    label: 'Google',
    icon: 'Search',
    tone: 'purple',
    enabled: true,
    designTypes: ['ad', 'banner'],
  },
]
