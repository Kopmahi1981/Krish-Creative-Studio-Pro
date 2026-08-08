import { Heart, LayoutGrid, List } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { cn } from '@/utils/cn'
import type { Template, ViewMode } from '../types/template'
import { TemplateBadges } from './TemplateBadges'
import { TemplateThumbnail } from './TemplateThumbnail'
import { TemplateTag } from './TemplateTag'
import { relativeDate } from '../utils/templateMeta'
import { t, useLanguage } from '@/i18n'

/** Standardized thumbnail ratio (4:5) so every card aligns and heights match. */
const THUMB_RATIO = 0.8

interface TemplateCardProps {
  template: Template
  isFavorite: boolean
  view: ViewMode
  onToggleFavorite: (id: string) => void
  onPreview: (template: Template) => void
  onSelect: (template: Template) => void
}

/**
 * Single reusable template card for both Grid and List views.
 * Visual system is identical across views: shared hover (border + neon glow +
 * lift), typography hierarchy, spacing scale, tag pills, and the "Use" button.
 * Functionality is unchanged — only the presentation is consolidated.
 */
export function TemplateCard({
  template,
  isFavorite,
  view,
  onToggleFavorite,
  onPreview,
  onSelect,
}: TemplateCardProps) {
  // Subscribe so action/favorite labels localize on language switch.
  useLanguage()
  const favoriteBtn = (
    <IconButton
      label={isFavorite ? t('tpl.removeFav') : t('tpl.addFav')}
      size="sm"
      tone={isFavorite ? 'rose' : 'default'}
      onClick={(e) => {
        e.stopPropagation()
        onToggleFavorite(template.id)
      }}
      className="backdrop-blur"
    >
      <Heart className={cn('h-4 w-4', isFavorite && 'fill-brand-rose text-brand-rose')} />
    </IconButton>
  )

  const useButton = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onSelect(template)
      }}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold',
        'border border-brand-purple/40 bg-gradient-to-br from-brand-rose to-brand-purple text-white',
        'shadow-neon-purple transition-all duration-200',
        'hover:-translate-y-0.5 hover:brightness-110 hover:shadow-neon-rose',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/70',
      )}
    >
      <LayoutGrid className="h-4 w-4 sm:hidden" />
      <List className="h-4 w-4 sm:hidden" />
      {t('tpl.use')}
    </button>
  )

  const baseClass = cn(
    'group flex rounded-2xl border border-white/10 bg-white/5',
    'transition-all duration-200 hover:-translate-y-1 hover:border-brand-purple/40 hover:bg-white/10 hover:shadow-neon-purple',
    view === 'grid' ? 'flex-col' : 'flex-row items-center gap-4 p-3 sm:gap-5',
  )

  if (view === 'list') {
    return (
      <article className={baseClass}>
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="relative block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/70"
          aria-label={`Preview ${template.name}`}
        >
          <TemplateThumbnail template={template} fixedRatio={THUMB_RATIO} className="w-28 sm:w-36" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">{template.name}</h3>
              <TemplateBadges template={template} />
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">{template.description}</p>
            <div className="mt-2 flex items-center gap-2">
              {template.tags.slice(0, 3).map((tag) => (
                <TemplateTag key={tag} label={`#${tag}`} />
              ))}
              <span className="text-[11px] text-foreground-muted">{relativeDate(template.createdAt)}</span>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <span className="text-xs text-foreground-muted">{template.popularity}%</span>
            {favoriteBtn}
            {useButton}
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            {favoriteBtn}
            <button
              type="button"
              onClick={() => onSelect(template)}
              className="rounded-lg border border-brand-purple/40 bg-brand-purple/10 px-3 py-1.5 text-xs font-semibold text-brand-purple"
            >
              {t('tpl.useShort')}
            </button>
          </div>
        </div>
      </article>
    )
  }

  // Grid view
  return (
    <article className={baseClass}>
      <button
        type="button"
        onClick={() => onPreview(template)}
        className="relative block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/70"
        aria-label={`Preview ${template.name}`}
      >
        <TemplateThumbnail template={template} fixedRatio={THUMB_RATIO} />
        <span className="absolute right-2 top-2">{favoriteBtn}</span>
        {template.popularity >= 90 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-rose/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-neon-rose">
            HOT
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="truncate text-sm font-semibold text-white">{template.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">{template.description}</p>
        </div>
        <TemplateBadges template={template} />
        <div className="flex flex-wrap items-center gap-1.5">
          {template.tags.slice(0, 3).map((tag) => (
            <TemplateTag key={tag} label={`#${tag}`} />
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-[11px] text-foreground-muted">{relativeDate(template.createdAt)}</span>
          {useButton}
        </div>
      </div>
    </article>
  )
}
