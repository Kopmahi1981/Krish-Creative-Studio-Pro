import { Menu, Search, Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store'
import { useUiStore } from '@/store'
import { BrandLogo } from '@/components/BrandLogo'
import { Breadcrumbs } from './Breadcrumbs'
import { NotificationsPanel } from './NotificationsPanel'
import { UserProfileMenu } from './UserProfileMenu'
import { LanguageSelector } from './LanguageSelector'
import { t, useLanguage } from '@/i18n'

interface TopBarProps {
  onMenuClick: () => void
}

/**
 * Responsive glassmorphism + neon-glow top navigation.
 * - Left: mobile menu + brand (mobile) + breadcrumbs (desktop).
 * - Center: command-palette search trigger (visual; opens ⌘K palette).
 * - Right: theme toggle, language selector, notifications, user profile.
 */
export function TopBar({ onMenuClick }: TopBarProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const openPalette = useUiStore((s) => s.openCommandPalette)
  const location = useLocation()
  // Subscribe to language so the search trigger + language selector re-render on switch.
  useLanguage()

  return (
    <header className="glass-strong sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 px-4 backdrop-blur-2xl sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-foreground-secondary transition hover:bg-white/10 hover:text-foreground lg:hidden"
        aria-label={t('topbar.openNav')}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <Breadcrumbs pathname={location.pathname} />
      </div>

      <div className="lg:hidden">
        <BrandLogo />
      </div>

      {/* Command palette search trigger (visual only — opens ⌘K palette) */}
      <button
        type="button"
        onClick={openPalette}
        className="group ml-1 hidden flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground-muted transition hover:border-brand-purple/50 hover:shadow-neon-purple md:flex"
        aria-label={t('topbar.commandPalette')}
      >
        <Search className="h-4 w-4 text-foreground-muted" />
        <span className="flex-1 text-left">{t('topbar.search')}</span>
        <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-foreground-muted">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-foreground-secondary transition hover:bg-white/10 hover:text-brand-cyan hover:shadow-neon-cyan"
          aria-label={theme === 'dark' ? t('topbar.theme.toLight') : t('topbar.theme.toDark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <LanguageSelector />

        <NotificationsPanel />

        <UserProfileMenu />
      </div>
    </header>
  )
}
