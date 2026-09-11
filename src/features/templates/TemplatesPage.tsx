import { Sparkles, LayoutTemplate } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, EmptyState } from '@/components/ui'
import { useTemplateLibrary } from './hooks/useTemplateLibrary'
import { TemplateFiltersPanel } from './components/TemplateFiltersPanel'
import { TemplateCard } from './components/TemplateCard'
import { TemplatePreviewModal } from './components/TemplatePreviewModal'
import { RecentTemplatesStrip } from './components/RecentTemplatesStrip'
import { FunnelChip } from './components/FunnelChip'
import { t, useLanguage } from '@/i18n'
import { useCanvasObjects } from '@/features/canvas/objects/store'
import type { Template } from './types/template'

/**
 * Phase 3 — Template Library.
 * Phase 5.7 — Template Engine integration (instant instantiation into Canvas).
 * Configuration-driven, strongly typed, and modular. Composes the template engine
 * (filter/sort service), local favorites/recents store, and presentational
 * components.
 */
export function TemplatesPage() {
  const navigate = useNavigate()
  const lib = useTemplateLibrary()
  useLanguage()

  const handleUseTemplate = (template: Template) => {
    lib.selectTemplate(template)
    useCanvasObjects.getState().instantiateTemplate(template)
    navigate('/canvas')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('page.templates')}
        description={t('page.templates.desc')}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-brand-purple/10 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-neon-purple">
            <Sparkles className="h-3.5 w-3.5" /> {lib.all.length} templates
          </span>
        }
      />

      {/* Funnel stage legend */}
      <div className="flex flex-wrap gap-3">
        {(['tofu', 'mofu', 'bofu'] as const).map((stage) => (
          <FunnelChip key={stage} stage={stage} />
        ))}
      </div>

      <RecentTemplatesStrip templates={lib.recentTemplates} onSelect={handleUseTemplate} />

      <TemplateFiltersPanel
        filters={lib.filters}
        allTags={lib.allTags}
        onPatch={lib.setFilters}
        onToggleTag={lib.toggleTag}
        onReset={lib.resetFilters}
        resultCount={lib.results.length}
      />

      {lib.results.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title={t('tpl.none.title')}
          description={t('tpl.none.desc')}
          action={
            <button
              type="button"
              onClick={lib.resetFilters}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/10"
            >
              {t('tpl.none.reset')}
            </button>
          }
        />
      ) : lib.filters.view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lib.results.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite={lib.isFavorite(template.id)}
              view="grid"
              onToggleFavorite={lib.toggleFavorite}
              onPreview={lib.setPreviewed}
              onSelect={handleUseTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {lib.results.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite={lib.isFavorite(template.id)}
              view="list"
              onToggleFavorite={lib.toggleFavorite}
              onPreview={lib.setPreviewed}
              onSelect={handleUseTemplate}
            />
          ))}
        </div>
      )}

      <TemplatePreviewModal
        template={lib.previewed}
        isFavorite={lib.previewed ? lib.isFavorite(lib.previewed.id) : false}
        onToggleFavorite={lib.toggleFavorite}
        onClose={() => lib.setPreviewed(null)}
        onUse={(template) => {
          lib.setPreviewed(null)
          handleUseTemplate(template)
        }}
      />
    </div>
  )
}
