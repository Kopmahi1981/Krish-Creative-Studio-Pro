import { useMemo, useState } from 'react'
import { TEMPLATES } from '../data/templates'
import { filterTemplates } from '../services/templateQuery'
import { useTemplateLibraryStore } from '../store/templateStore'
import { collectTags } from '../utils/templateMeta'
import type { Template, TemplateFilters, TemplateIconName } from '../types/template'

export const DEFAULT_FILTERS: TemplateFilters = {
  search: '',
  funnel: 'all',
  platform: 'all',
  aspectRatio: 'all',
  category: 'all',
  tags: [],
  onlyFavorites: false,
  sort: 'popular',
  view: 'grid',
}

export interface UseTemplateLibraryResult {
  /** Full library, unfiltered. */
  all: Template[]
  /** Filtered + sorted result for the active view. */
  results: Template[]
  /** Distinct tags across the whole library. */
  allTags: string[]
  /** Recently viewed templates (resolved from ids). */
  recentTemplates: Template[]
  filters: TemplateFilters
  setFilters: (patch: Partial<TemplateFilters>) => void
  resetFilters: () => void
  toggleTag: (tag: string) => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  pushRecent: (id: string) => void
  /** Currently previewed template (or null). */
  previewed: Template | null
  setPreviewed: (template: Template | null) => void
  /** Currently selected template (or null). */
  selected: Template | null
  selectTemplate: (template: Template | null) => void
}

/**
 * Central hook orchestrating the template library: filter state, the query
 * engine, favorites/recents (local store), and selection/preview.
 */
export function useTemplateLibrary(): UseTemplateLibraryResult {
  const [filters, setFiltersState] = useState<TemplateFilters>(DEFAULT_FILTERS)
  const [previewed, setPreviewed] = useState<Template | null>(null)
  const [selected, setSelected] = useState<Template | null>(null)

  const favorites = useTemplateLibraryStore((s) => s.favorites)
  const isFavorite = useTemplateLibraryStore((s) => s.isFavorite)
  const toggleFavorite = useTemplateLibraryStore((s) => s.toggleFavorite)
  const recents = useTemplateLibraryStore((s) => s.recents)
  const pushRecent = useTemplateLibraryStore((s) => s.pushRecent)

  const favoriteSet = useMemo(() => new Set(favorites), [favorites])
  const allTags = useMemo(() => collectTags(TEMPLATES), [])

  const results = useMemo(
    () => filterTemplates(TEMPLATES, filters, favoriteSet),
    [filters, favoriteSet],
  )

  const recentTemplates = useMemo(
    () => recents.map((id) => TEMPLATES.find((t) => t.id === id)).filter(Boolean) as Template[],
    [recents],
  )

  const setFilters = (patch: Partial<TemplateFilters>) =>
    setFiltersState((prev) => ({ ...prev, ...patch }))

  const resetFilters = () => setFiltersState(DEFAULT_FILTERS)

  const toggleTag = (tag: string) =>
    setFiltersState((prev) => {
      const has = prev.tags.includes(tag)
      return {
        ...prev,
        tags: has ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      }
    })

  const selectTemplate = (template: Template | null) => {
    if (template) pushRecent(template.id)
    setSelected(template)
  }

  return {
    all: TEMPLATES,
    results,
    allTags,
    recentTemplates,
    filters,
    setFilters,
    resetFilters,
    toggleTag,
    isFavorite,
    toggleFavorite,
    pushRecent,
    previewed,
    setPreviewed,
    selected,
    selectTemplate,
  }
}

/** Resolve a funnel/icon reference for callers that need the icon component. */
export type { TemplateIconName }
