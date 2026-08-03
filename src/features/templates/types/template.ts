/**
 * Template Engine domain types for Krish Creative Studio Pro.
 * Phase 3: strongly typed model for the Meta Ads template library.
 */

/** Marketing funnel stage (TOFU / MOFU / BOFU). */
export type FunnelStage = 'tofu' | 'mofu' | 'bofu'

/** Supported publishing platforms. */
export type Platform =
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'linkedin'
  | 'x'
  | 'pinterest'
  | 'google'
  | 'youtube'

/** Creative aspect ratios offered by the library. */
export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9' | '1.91:1' | '2:3'

/** Template marketing category. */
export type TemplateCategory =
  | 'sales'
  | 'promotion'
  | 'announcement'
  | 'seasonal'
  | 'brand'
  | 'event'
  | 'testimonial'
  | 'lead-gen'

/** Sort strategies for the library grid. */
export type SortKey = 'popular' | 'newest' | 'name' | 'recent'

/** Grid vs list presentation. */
export type ViewMode = 'grid' | 'list'

/** Visual tone shared with the design system badges. */
export type TemplateTone = 'rose' | 'purple' | 'cyan' | 'slate'

/** Lucide icon names allowed on a template (resolved by the icon registry). */
export type TemplateIconName =
  | 'Megaphone'
  | 'Tag'
  | 'Sparkles'
  | 'Gift'
  | 'Calendar'
  | 'Star'
  | 'Users'
  | 'Heart'
  | 'Zap'
  | 'TrendingUp'
  | 'ShoppingBag'
  | 'Camera'
  | 'BadgeCheck'
  | 'Flame'
  | 'Bell'
  | 'Trophy'
  | 'Percent'
  | 'Ticket'
  | 'MessageCircle'
  | 'Briefcase'
  | 'AtSign'
  | 'Image'
  | 'Search'
  | 'PlayCircle'

/** A single creative template definition (mock data — no assets uploaded). */
export interface Template {
  id: string
  name: string
  description: string
  funnel: FunnelStage
  platform: Platform
  category: TemplateCategory
  aspectRatio: AspectRatio
  /** Free-form tags used by the tag filter. */
  tags: string[]
  tone: TemplateTone
  icon: TemplateIconName
  /** 0–100 popularity score (drives "popular" sort). */
  popularity: number
  /** ISO creation date (drives "newest" sort + relative display). */
  createdAt: string
}

/** Active filter + view state for the library. */
export interface TemplateFilters {
  search: string
  funnel: FunnelStage | 'all'
  platform: Platform | 'all'
  aspectRatio: AspectRatio | 'all'
  category: TemplateCategory | 'all'
  tags: string[]
  onlyFavorites: boolean
  sort: SortKey
  view: ViewMode
}
