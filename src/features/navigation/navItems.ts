import type { NavSection } from '@/types'

/**
 * Primary, fully configuration-driven navigation model for the studio.
 *
 * This is the single source of truth consumed by the Sidebar, the mobile drawer,
 * breadcrumbs, and the Command Palette. To add a module (e.g. Layers, Brand Kit,
 * Export Center) you extend `NAV_SECTIONS` — no presentation component changes.
 *
 * Future phases append new sections/items here without touching layout code.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: 'LayoutDashboard',
        description: 'Overview and quick actions',
      },
      {
        id: 'templates',
        label: 'Templates',
        path: '/templates',
        icon: 'LayoutTemplate',
        description: 'Browse the template library',
      },
      {
        id: 'canvas',
        label: 'Canvas',
        path: '/canvas',
        icon: 'PenTool',
        description: 'Open the visual editor',
      },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    items: [
      {
        id: 'assets',
        label: 'Assets',
        path: '/assets',
        icon: 'Image',
        description: 'Manage your media library',
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: 'Settings',
        description: 'Configure the studio',
      },
    ],
  },
]

/** Flattened item list — convenient for lookups, breadcrumbs, and the palette. */
export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items)
