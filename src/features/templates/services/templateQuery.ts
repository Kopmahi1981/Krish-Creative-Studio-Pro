import type { Template, TemplateFilters } from '../types/template'

/**
 * Pure template query engine. No UI, no React, no persistence — given a set of
 * templates and a filter state it returns the matching, sorted list.
 * Separating this from the view keeps the filter logic testable and reusable.
 */

export function filterTemplates(
  templates: Template[],
  filters: TemplateFilters,
  favorites: Set<string>,
): Template[] {
  const query = filters.search.trim().toLowerCase()

  const matched = templates.filter((t) => {
    if (filters.funnel !== 'all' && t.funnel !== filters.funnel) return false
    if (filters.platform !== 'all' && t.platform !== filters.platform) return false
    if (filters.aspectRatio !== 'all' && t.aspectRatio !== filters.aspectRatio) return false
    if (filters.category !== 'all' && t.category !== filters.category) return false
    if (filters.onlyFavorites && !favorites.has(t.id)) return false
    if (filters.tags.length > 0) {
      const tagSet = new Set(t.tags.map((tag) => tag.toLowerCase()))
      const allSelected = filters.tags.every((tag) => tagSet.has(tag.toLowerCase()))
      if (!allSelected) return false
    }
    if (query) {
      const haystack = `${t.name} ${t.description} ${t.tags.join(' ')}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  return sortTemplates(matched, filters.sort, favorites)
}

export function sortTemplates(
  templates: Template[],
  sort: TemplateFilters['sort'],
  favorites: Set<string>,
): Template[] {
  const list = [...templates]
  switch (sort) {
    case 'popular':
      return list.sort((a, b) => b.popularity - a.popularity)
    case 'newest':
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    case 'recent':
      // Favorites act as the "recently viewed" proxy in this mock engine.
      return list.sort((a, b) => Number(favorites.has(b.id)) - Number(favorites.has(a.id)))
    default:
      return list
  }
}

/** Count how many templates match a single filter facet (for empty-state hints). */
export function countBy<T extends keyof Template>(
  templates: Template[],
  key: T,
  value: Template[T],
): number {
  return templates.filter((t) => t[key] === value).length
}
