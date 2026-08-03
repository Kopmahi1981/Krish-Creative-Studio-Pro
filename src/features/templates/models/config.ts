import type {
  AspectRatio,
  FunnelStage,
  Platform,
  SortKey,
  TemplateCategory,
  TemplateIconName,
  TemplateTone,
} from '../types/template'
import type { LucideIcon } from 'lucide-react'
import {
  Megaphone,
  Tag,
  Sparkles,
  Gift,
  Calendar,
  Star,
  Users,
  Heart,
  Zap,
  TrendingUp,
  ShoppingBag,
  Camera,
  BadgeCheck,
  Flame,
  Bell,
  Trophy,
  Percent,
  Ticket,
  MessageCircle,
  Briefcase,
  AtSign,
  Image as ImageIcon,
  Search,
  PlayCircle,
} from 'lucide-react'

/**
 * Central registry mapping the string-only `TemplateIconName` to its Lucide
 * component. Keeping data free of component references makes the model serializable.
 */
export const TEMPLATE_ICONS: Record<TemplateIconName, LucideIcon> = {
  Megaphone,
  Tag,
  Sparkles,
  Gift,
  Calendar,
  Star,
  Users,
  Heart,
  Zap,
  TrendingUp,
  ShoppingBag,
  Camera,
  BadgeCheck,
  Flame,
  Bell,
  Trophy,
  Percent,
  Ticket,
  MessageCircle,
  Briefcase,
  AtSign,
  Image: ImageIcon,
  Search,
  PlayCircle,
}

export function getTemplateIcon(name: TemplateIconName): LucideIcon {
  return TEMPLATE_ICONS[name]
}

/* ----------------------------- Funnel stages ----------------------------- */

export interface FunnelOption {
  value: FunnelStage
  label: string
  title: string
  description: string
  tone: TemplateTone
}

export const FUNNEL_STAGES: FunnelOption[] = [
  { value: 'tofu', label: 'TOFU', title: 'Top of Funnel', description: 'Awareness & reach', tone: 'cyan' },
  { value: 'mofu', label: 'MOFU', title: 'Middle of Funnel', description: 'Consideration', tone: 'purple' },
  { value: 'bofu', label: 'BOFU', title: 'Bottom of Funnel', description: 'Conversion', tone: 'rose' },
]

/* ------------------------------- Platforms ------------------------------- */

export interface PlatformOption {
  value: Platform
  label: string
  icon: TemplateIconName
  tone: TemplateTone
}

export const PLATFORMS: PlatformOption[] = [
  { value: 'facebook', label: 'Facebook', icon: 'Megaphone', tone: 'cyan' },
  { value: 'instagram', label: 'Instagram', icon: 'Sparkles', tone: 'rose' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', tone: 'cyan' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'Briefcase', tone: 'cyan' },
  { value: 'x', label: 'X', icon: 'AtSign', tone: 'slate' },
  { value: 'pinterest', label: 'Pinterest', icon: 'Image', tone: 'rose' },
  { value: 'google', label: 'Google', icon: 'Search', tone: 'purple' },
  { value: 'youtube', label: 'YouTube', icon: 'PlayCircle', tone: 'rose' },
]

/* ----------------------------- Aspect ratios ---------------------------- */

export interface AspectRatioOption {
  value: AspectRatio
  label: string
  /** width / height, used for the thumbnail aspect box. */
  ratio: number
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { value: '1:1', label: 'Square · 1:1', ratio: 1 },
  { value: '4:5', label: 'Portrait · 4:5', ratio: 0.8 },
  { value: '9:16', label: 'Story · 9:16', ratio: 0.5625 },
  { value: '16:9', label: 'Landscape · 16:9', ratio: 1.7778 },
  { value: '1.91:1', label: 'Link · 1.91:1', ratio: 1.91 },
  { value: '2:3', label: 'Tall · 2:3', ratio: 0.6667 },
]

/* ------------------------------ Categories ------------------------------ */

export interface CategoryOption {
  value: TemplateCategory
  label: string
}

export const CATEGORIES: CategoryOption[] = [
  { value: 'sales', label: 'Sales' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'brand', label: 'Brand' },
  { value: 'event', label: 'Event' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'lead-gen', label: 'Lead Gen' },
]

/* -------------------------------- Sorting ------------------------------- */

export interface SortOption {
  value: SortKey
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'recent', label: 'Recently viewed' },
]

/** Convert a config list into `{ label, value }` pairs for the Select primitive. */
export function toSelectOptions<T extends { value: string; label: string }>(
  items: T[],
): { label: string; value: string }[] {
  return items.map((item) => ({ label: item.label, value: item.value }))
}
