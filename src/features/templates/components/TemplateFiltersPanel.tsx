import { Search, Star, LayoutGrid, List, X } from 'lucide-react'
import { Input, Select, Chip, IconButton, Button } from '@/components/ui'
import {
  ASPECT_RATIOS,
  CATEGORIES,
  FUNNEL_STAGES,
  PLATFORMS,
  SORT_OPTIONS,
  toSelectOptions,
} from '../models/config'
import { cn } from '@/utils/cn'
import type { TemplateFilters } from '../types/template'
import { FunnelChip } from './FunnelChip'

interface TemplateFiltersProps {
  filters: TemplateFilters
  allTags: string[]
  onPatch: (patch: Partial<TemplateFilters>) => void
  onToggleTag: (tag: string) => void
  onReset: () => void
  resultCount: number
}

const ALL_OPTION = { label: 'All', value: 'all' }

/**
 * Configuration-driven filter bar for the template library.
 * Funnel stages use consistent FunnelChips; tag chips come from the aggregated
 * tag set. Emits patches upward — holds no filter state itself.
 */
export function TemplateFiltersPanel({
  filters,
  allTags,
  onPatch,
  onToggleTag,
  onReset,
  resultCount,
}: TemplateFiltersProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <Input
            value={filters.search}
            onChange={(e) => onPatch({ search: e.target.value })}
            placeholder="Search templates, tags, keywords…"
            className="pl-10"
            aria-label="Search templates"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-center">
          <Select
            aria-label="Platform"
            options={[ALL_OPTION, ...toSelectOptions(PLATFORMS)]}
            value={filters.platform}
            onChange={(e) => onPatch({ platform: e.target.value as TemplateFilters['platform'] })}
          />
          <Select
            aria-label="Category"
            options={[ALL_OPTION, ...toSelectOptions(CATEGORIES)]}
            value={filters.category}
            onChange={(e) => onPatch({ category: e.target.value as TemplateFilters['category'] })}
          />
          <Select
            aria-label="Aspect ratio"
            options={[ALL_OPTION, ...toSelectOptions(ASPECT_RATIOS)]}
            value={filters.aspectRatio}
            onChange={(e) => onPatch({ aspectRatio: e.target.value as TemplateFilters['aspectRatio'] })}
          />
          <Select
            aria-label="Sort"
            options={toSelectOptions(SORT_OPTIONS)}
            value={filters.sort}
            onChange={(e) => onPatch({ sort: e.target.value as TemplateFilters['sort'] })}
          />
        </div>
      </div>

      {/* Funnel stage chips + view toggle + favorites */}
      <div className="flex flex-wrap items-center gap-2">
        {FUNNEL_STAGES.map((stage) => {
          const active = filters.funnel === stage.value
          return (
            <FunnelChip
              key={stage.value}
              stage={stage.value}
              active={active}
              onClick={() => onPatch({ funnel: active ? 'all' : stage.value })}
            />
          )
        })}

        <span className="mx-1 h-5 w-px bg-white/10" />

        <Button
          variant={filters.onlyFavorites ? 'secondary' : 'ghost'}
          size="sm"
          leftIcon={<Star className={cn('h-4 w-4', filters.onlyFavorites && 'fill-brand-rose text-brand-rose')} />}
          onClick={() => onPatch({ onlyFavorites: !filters.onlyFavorites })}
        >
          Favorites
        </Button>

        <div className="ml-auto flex items-center gap-1 rounded-xl border border-white/10 p-1">
          <IconButton
            label="Grid view"
            size="sm"
            tone={filters.view === 'grid' ? 'purple' : 'default'}
            onClick={() => onPatch({ view: 'grid' })}
          >
            <LayoutGrid className="h-4 w-4" />
          </IconButton>
          <IconButton
            label="List view"
            size="sm"
            tone={filters.view === 'list' ? 'purple' : 'default'}
            onClick={() => onPatch({ view: 'list' })}
          >
            <List className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map((tag) => (
            <Chip key={tag} active={filters.tags.includes(tag)} onClick={() => onToggleTag(tag)}>
              #{tag}
            </Chip>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span>
          {resultCount} template{resultCount === 1 ? '' : 's'} found
        </span>
        {(filters.search || filters.tags.length > 0 || filters.onlyFavorites || filters.funnel !== 'all') && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-foreground-secondary transition hover:text-brand-rose"
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
