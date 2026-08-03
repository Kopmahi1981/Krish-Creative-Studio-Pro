import { Heart, Wand2 } from 'lucide-react'
import { Modal, Button, IconButton } from '@/components/ui'
import { cn } from '@/utils/cn'
import type { Template } from '../types/template'
import { TemplateThumbnail } from './TemplateThumbnail'
import { TemplateBadges } from './TemplateBadges'
import { TemplateTag } from './TemplateTag'
import { relativeDate, platformIcon } from '../utils/templateMeta'
import { getTemplateIcon } from '../models/config'

interface TemplatePreviewModalProps {
  template: Template | null
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClose: () => void
  onUse: (template: Template) => void
}

/**
 * Detailed template preview. Shows the generated thumbnail, metadata, tags, and
 * actions (favorite + use). No canvas/export — "Use template" selects it only.
 */
export function TemplatePreviewModal({
  template,
  isFavorite,
  onToggleFavorite,
  onClose,
  onUse,
}: TemplatePreviewModalProps) {
  const Icon = template ? getTemplateIcon(platformIcon(template.platform)) : null

  return (
    <Modal open={Boolean(template)} onClose={onClose} size="max-w-2xl" title={template?.name}>
      {template && (
        <div className="space-y-4">
          <TemplateThumbnail template={template} />

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-foreground-secondary">{template.description}</p>
              <p className="mt-1 text-xs text-foreground-muted">
                Created {relativeDate(template.createdAt)} · {template.popularity}% popular
              </p>
            </div>
            <IconButton
              label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              tone={isFavorite ? 'rose' : 'default'}
              onClick={() => onToggleFavorite(template.id)}
            >
              <Heart className={cn('h-5 w-5', isFavorite && 'fill-brand-rose text-brand-rose')} />
            </IconButton>
          </div>

          <TemplateBadges template={template} />

          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <TemplateTag key={tag} label={`#${tag}`} />
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button
              leftIcon={Icon ? <Icon className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
              onClick={() => onUse(template)}
            >
              Use this template
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
