import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  LayoutTemplate,
  PenTool,
  Image,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react'
import { NAV_SECTIONS } from '@/features/navigation/navItems'
import { BrandLogo } from '@/components/BrandLogo'
import { Tooltip } from '@/components/ui'
import { cn } from '@/utils/cn'
import type { NavIconName } from '@/types'

const ICONS: Record<NavIconName, LucideIcon> = {
  LayoutDashboard,
  LayoutTemplate,
  PenTool,
  Image,
  Settings,
}

interface SidebarProps {
  /** On mobile the sidebar is an off-canvas drawer toggled by the top bar. */
  open: boolean
  onClose: () => void
}

/**
 * Responsive, configuration-driven glassmorphism + neon-glow sidebar.
 * - Renders entirely from NAV_SECTIONS (no hardcoded items).
 * - Desktop (>=lg): static full-width rail.
 * - Mobile (<lg): off-canvas drawer with backdrop.
 * - Active item: neon-purple left bar + glow + cyan icon.
 * Theme-aware via semantic tokens (background/foreground).
 */
export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'glass-strong fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <BrandLogo withWordmark />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-foreground-secondary transition hover:bg-white/10 hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2 scrollbar-thin">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id}>
              {section.label && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                  {section.label}
                </p>
              )}
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = ICONS[item.icon]
                  const isActive =
                    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
                  return (
                    <Tooltip key={item.id} content={item.description ?? item.label} side="right" className="lg:hidden">
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onClose}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                          isActive
                            ? 'bg-white/10 text-foreground shadow-neon-purple'
                            : 'text-foreground-secondary hover:bg-white/5 hover:text-foreground',
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-purple shadow-neon-purple" />
                        )}
                        <Icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition',
                            isActive ? 'text-brand-cyan' : 'text-foreground-muted group-hover:text-brand-rose',
                          )}
                        />
                        {item.label}
                      </NavLink>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs text-foreground-secondary">Krish Creative Studio Pro</p>
          <p className="text-[11px] text-foreground-muted">Phase 2 · Application Layout</p>
        </div>
      </aside>
    </>
  )
}
