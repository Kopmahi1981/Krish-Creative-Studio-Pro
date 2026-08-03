import { getTemplateIcon } from '../models/config'
import { aspectRatioValue, TONE_GRADIENT } from '../utils/templateMeta'
import type { Template } from '../types/template'

interface TemplateThumbnailProps {
  template: Template
  /** Override the aspect ratio (width/height) for a standardized card thumbnail. */
  fixedRatio?: number
  className?: string
}

/**
 * Generated, asset-free thumbnail: a tone-based gradient with the template icon
 * and its aspect-ratio box. No image upload — Phase 5 owns real assets.
 */
export function TemplateThumbnail({ template, fixedRatio, className }: TemplateThumbnailProps) {
  const Icon = getTemplateIcon(template.icon)
  const ratio = fixedRatio ?? aspectRatioValue(template.aspectRatio)
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-br ${TONE_GRADIENT[template.tone]} ${className ?? ''}`}
      style={{ aspectRatio: String(ratio) }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="relative flex h-full flex-col items-center justify-center gap-2 p-3">
        <Icon className="h-8 w-8 text-foreground/90" />
        <span className="line-clamp-2 text-center text-xs font-semibold text-foreground/90">
          {template.name}
        </span>
      </div>
    </div>
  )
}
