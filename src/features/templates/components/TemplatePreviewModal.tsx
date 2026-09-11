import { useMemo, useRef, useState, useEffect } from 'react'
import { Heart, Wand2 } from 'lucide-react'
import { Modal, Button, IconButton } from '@/components/ui'
import { cn } from '@/utils/cn'
import type { Template } from '../types/template'
import { TemplateThumbnail } from './TemplateThumbnail'
import { TemplateBadges } from './TemplateBadges'
import { TemplateTag } from './TemplateTag'
import { relativeDate, platformIcon } from '../utils/templateMeta'
import { getTemplateIcon } from '../models/config'
import { getTemplateLayout } from '../engine/instantiator'
import { t, useLanguage } from '@/i18n'

interface TemplatePreviewModalProps {
  template: Template | null
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClose: () => void
  onUse: (template: Template) => void
}

/**
 * Detailed template preview. Shows the generated thumbnail, metadata, tags, and
 * actions (favorite + use). Calculates the largest possible artboard that fits
 * within the preview stage for any native aspect ratio (square, wide, or portrait).
 */
export function TemplatePreviewModal({
  template,
  isFavorite,
  onToggleFavorite,
  onClose,
  onUse,
}: TemplatePreviewModalProps) {
  const Icon = template ? getTemplateIcon(platformIcon(template.platform)) : null
  useLanguage()

  const stageRef = useRef<HTMLDivElement>(null)
  const [stageBounds, setStageBounds] = useState<{ width: number; height: number }>(() => {
    if (typeof window === 'undefined') return { width: 600, height: 440 }
    const w = Math.min(616, Math.max(280, window.innerWidth - 64))
    const h = Math.min(440, Math.max(300, Math.floor(window.innerHeight * 0.52)))
    return { width: w, height: h }
  })

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setStageBounds({ width: Math.floor(rect.width), height: Math.floor(rect.height) })
      }
    }
    update()
    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    return () => ro.disconnect()
  }, [template])

  const layout = useMemo(() => (template ? getTemplateLayout(template) : null), [template])
  const templateRatio = layout ? layout.width / layout.height : 1
  const isSquare = Math.abs(templateRatio - 1) < 0.05

  // Calculate largest possible artboard geometry that fits inside the stage
  const artboardSize = useMemo(() => {
    if (!stageBounds || !layout) return null
    // Minimal stage padding for square templates to maximize area; standard for others
    const pad = isSquare ? 20 : (stageBounds.width >= 640 ? 32 : 24)
    const availW = Math.max(100, stageBounds.width - pad)
    const availH = Math.max(100, stageBounds.height - pad)
    const stageRatio = availW / availH

    if (stageRatio > templateRatio) {
      // Stage is wider than artboard aspect ratio: height is the limiting constraint
      const height = availH
      const width = Math.round(availH * templateRatio)
      return { width, height }
    } else {
      // Stage is narrower than artboard aspect ratio: width is the limiting constraint
      const width = availW
      const height = Math.round(availW / templateRatio)
      return { width, height }
    }
  }, [stageBounds, layout, templateRatio, isSquare])

  return (
    <Modal
      open={Boolean(template)}
      onClose={onClose}
      size="max-w-2xl"
      title={template?.name}
      footer={
        template ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              {t('tpl.close')}
            </Button>
            <Button
              leftIcon={Icon ? <Icon className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
              onClick={() => onUse(template)}
            >
              {t('tpl.used')}
            </Button>
          </>
        ) : null
      }
    >
      {template && (
        <div className="space-y-4">
          {/* Preview stage with intelligent aspect-ratio fitting */}
          <div
            ref={stageRef}
            className={cn(
              'relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black/20',
              isSquare
                ? 'h-[480px] sm:h-[510px] max-h-[58vh] min-h-[320px] p-2 sm:p-2.5'
                : 'h-[440px] max-h-[52vh] min-h-[300px] p-3 sm:p-4',
            )}
          >
            <div
              style={
                artboardSize
                  ? {
                      width: `${artboardSize.width}px`,
                      height: `${artboardSize.height}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }
                  : {
                      maxWidth: '100%',
                      maxHeight: '100%',
                      aspectRatio: String(templateRatio),
                    }
              }
              className="flex items-center justify-center shrink-0"
            >
              <TemplateThumbnail template={template} className="h-full w-full" />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-foreground-secondary">{template.description}</p>
              <p className="mt-1 text-xs text-foreground-muted">
                {relativeDate(template.createdAt)} · {t('tpl.popular', { pct: template.popularity })}
              </p>
            </div>
            <IconButton
              label={isFavorite ? t('tpl.removeFav') : t('tpl.addFav')}
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
        </div>
      )}
    </Modal>
  )
}
