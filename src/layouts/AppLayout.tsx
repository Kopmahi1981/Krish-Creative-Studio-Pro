import { useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * Premium application shell for Phase 1.
 * Composes the responsive Sidebar + TopBar with a scrollable content region.
 * The left padding (lg:pl-64) reserves space for the static desktop sidebar.
 *
 * The canvas editor (/canvas) renders full-bleed: it supplies its own toolbars,
 * status bar, and padding, so the default centered max-width / page padding is
 * skipped there to let the workspace fill the space between the chrome.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const isCanvas = pathname === '/canvas'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main
          className={
            isCanvas
              ? 'h-[calc(100vh-4rem)]'
              : 'mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'
          }
        >
          {children}
        </main>
      </div>
    </div>
  )
}
