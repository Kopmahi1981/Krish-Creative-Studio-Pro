/**
 * Global shared types for Krish Creative Studio Pro.
 * Phase 1 introduced the navigation model. Phase 2 extends it with grouped
 * (sectioned) navigation so the sidebar is fully configuration-driven.
 */

export type RoutePath = '/' | '/templates' | '/canvas' | '/assets' | '/settings'

export type NavIconName =
  | 'LayoutDashboard'
  | 'LayoutTemplate'
  | 'PenTool'
  | 'Image'
  | 'Settings'

export interface NavItem {
  /** Stable identifier used for keys and analytics. */
  id: string
  /** Human-readable label shown in the UI. */
  label: string
  /** Router path the item navigates to. */
  path: RoutePath
  /** Lucide icon name (resolved by the Sidebar component). */
  icon: NavIconName
  /** Optional short description for tooltips / a11y. */
  description?: string
}

export interface NavSection {
  /** Stable section identifier. */
  id: string
  /** Optional section heading shown above its items. */
  label?: string
  items: NavItem[]
}
