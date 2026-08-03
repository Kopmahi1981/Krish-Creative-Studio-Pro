import { NAV_SECTIONS } from '@/features/navigation/navItems'
import type { NavItem } from '@/types'

/**
 * Titles for routes that exist as placeholder pages but are not part of the primary
 * sidebar navigation (reached via notifications / profile menu). Keeps breadcrumbs
 * accurate without polluting the NAV_SECTIONS model.
 */
const STATIC_TITLES: Record<string, string> = {
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/billing': 'Billing',
  '/support': 'Support',
}

/**
 * Resolve a pathname into a breadcrumb trail using the config-driven nav model.
 * Returns an ordered list of { label, path } ending at the active item, or a
 * static title / "Unknown" trail for routes not present in the navigation model.
 */
export function resolveBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const allItems: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items)
  const active = allItems.find((item) =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
  )

  if (!active) {
    const title = STATIC_TITLES[pathname]
    return [{ label: title ?? 'Unknown', path: pathname }]
  }

  const section = NAV_SECTIONS.find((s) => s.items.some((i) => i.id === active.id))
  const trail: { label: string; path: string }[] = []

  if (section?.label) trail.push({ label: section.label, path: '#' })
  trail.push({ label: active.label, path: active.path })

  return trail
}
