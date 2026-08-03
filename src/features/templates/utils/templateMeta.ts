import type { Template, TemplateTone } from '../types/template'
import {
  ASPECT_RATIOS,
  CATEGORIES,
  FUNNEL_STAGES,
  PLATFORMS,
} from '../models/config'

/** Look up a single option label by value. */
function labelOf<T extends { value: string; label: string }>(
  list: T[],
  value: string,
): string {
  return list.find((item) => item.value === value)?.label ?? value
}

export function funnelLabel(funnel: Template['funnel']): string {
  return labelOf(FUNNEL_STAGES, funnel)
}

export function platformLabel(platform: Template['platform']): string {
  return labelOf(PLATFORMS, platform)
}

export function platformIcon(platform: Template['platform']) {
  return PLATFORMS.find((p) => p.value === platform)?.icon ?? 'Megaphone'
}

export function categoryLabel(category: Template['category']): string {
  return labelOf(CATEGORIES, category)
}

export function aspectRatioLabel(aspectRatio: Template['aspectRatio']): string {
  return labelOf(ASPECT_RATIOS, aspectRatio)
}

export function aspectRatioValue(aspectRatio: Template['aspectRatio']): number {
  return ASPECT_RATIOS.find((a) => a.value === aspectRatio)?.ratio ?? 1
}

/** Tailwind gradient classes per tone (used for generated thumbnails). */
export const TONE_GRADIENT: Record<TemplateTone, string> = {
  rose: 'from-brand-rose/80 via-brand-purple/40 to-slate-900',
  purple: 'from-brand-purple/80 via-brand-rose/30 to-slate-900',
  cyan: 'from-brand-cyan/70 via-brand-purple/40 to-slate-900',
  slate: 'from-slate-600/70 via-slate-700/40 to-slate-900',
}

/** Format an ISO date as a compact relative string ("3d ago", "2mo ago"). */
export function relativeDate(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffDays = Math.max(0, Math.round((now - then) / 86_400_000))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  const months = Math.round(diffDays / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(months / 12)}y ago`
}

/** Aggregate every unique tag across a template set (sorted, lowercased). */
export function collectTags(templates: Template[]): string[] {
  const set = new Set<string>()
  templates.forEach((t) => t.tags.forEach((tag) => set.add(tag.toLowerCase())))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
