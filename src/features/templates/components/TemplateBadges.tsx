import { Badge } from '@/components/ui'
import type { Template } from '../types/template'
import {
  aspectRatioLabel,
  categoryLabel,
  funnelLabel,
  platformLabel,
} from '../utils/templateMeta'

/**
 * Compact badge row summarizing a template's funnel, platform, category, and
 * aspect ratio. Funnel uses its own tone (TOFU cyan / MOFU purple / BOFU rose).
 */
export function TemplateBadges({ template }: { template: Template }) {
  const funnelTone =
    template.funnel === 'tofu' ? 'cyan' : template.funnel === 'mofu' ? 'purple' : 'rose'

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge tone={funnelTone}>{funnelLabel(template.funnel)}</Badge>
      <Badge tone="slate">{platformLabel(template.platform)}</Badge>
      <Badge tone="slate">{categoryLabel(template.category)}</Badge>
      <Badge tone="slate">{aspectRatioLabel(template.aspectRatio)}</Badge>
    </div>
  )
}
