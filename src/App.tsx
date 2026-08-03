import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/layouts/AppLayout'
import { PageTransition } from '@/components/layout/PageTransition'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { DashboardPage } from '@/pages/DashboardPage'
import { TemplatesPage } from '@/features/templates/TemplatesPage'
import { CanvasPage } from '@/pages/CanvasPage'
import { AssetsPage } from '@/pages/AssetsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { BillingPage } from '@/pages/BillingPage'
import { SupportPage } from '@/pages/SupportPage'
import { UiKitPage } from '@/pages/UiKitPage'
import { ToastProvider } from '@/components/ui'
import { useThemeStore } from '@/store/useThemeStore'
import { useUiStore } from '@/store/useUiStore'
import { useKeyboardShortcut } from '@/hooks'

/**
 * Root application component.
 * Phase 2: config-driven routing, animated page transitions, and the ⌘K command palette.
 * Business logic, canvas, and AI features are intentionally deferred to later phases.
 */
export default function App() {
  const theme = useThemeStore((state) => state.theme)
  const applyTheme = useThemeStore((state) => state.applyTheme)
  const togglePalette = useUiStore((s) => s.toggleCommandPalette)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  // Global ⌘K / Ctrl+K opens the command palette.
  useKeyboardShortcut({ key: 'k', meta: true, onTrigger: togglePalette })

  return (
    <ToastProvider>
      <AppLayout>
        <AnimatePresence mode="wait">
          <PageTransition routeKey={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/canvas" element={<CanvasPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/ui-kit" element={<UiKitPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </AppLayout>
      <CommandPalette onNavigate={navigate} />
    </ToastProvider>
  )
}
