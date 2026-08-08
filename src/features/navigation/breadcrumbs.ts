import { NAV_SECTIONS } from '@/features/navigation/navItems'

/**
 * Titles for routes that exist as placeholder pages but are not part of the primary
 * sidebar navigation (reached via notifications / profile menu). Keeps breadcrumbs
 * accurate without polluting the NAV_SECTIONS model. Values are i18n keys.
 */
const STATIC_KEYS: Record<string, string> = {
  '/notifications': 'page.notifications',
  '/profile': 'user.profile',
  '/billing': 'page.billing',
  '/support': 'page.support',
}

export interface Crumb {
  /** i18n key resolved by the caller via t(). */
  key: string
  path: string
}

/**
 * Resolve a pathname into a breadcrumb trail using the config-driven nav model.
 * Returns an ordered list of { key, path } ending at the active item, or a
 * static key / "breadcrumb.unknown" trail for routes not present in the model.
 */
export function resolveBreadcrumbs(pathname: string): Crumb[] {
  const allItems = NAV_SECTIONS.flatMap((section) => section.items)
  const active = allItems.find((item) =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
  )

  if (!active) {
    const key = STATIC_KEYS[pathname] ?? 'breadcrumb.unknown'
    return [{ key, path: pathname }]
  }

  const section = NAV_SECTIONS.find((s) => s.items.some((i) => i.id === active.id))
  const trail: Crumb[] = []

  if (section?.label) trail.push({ key: `nav.section.${section.id}`, path: '#' })
  trail.push({ key: `nav.${active.id}`, path: active.path })

  return trail
}
