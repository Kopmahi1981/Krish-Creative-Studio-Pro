import { Settings as SettingsIcon } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { t, useLanguage } from '@/i18n'

/**
 * Phase 1 placeholder — settings & preferences ship in Phase 8 (Deployment) / later.
 */
export function SettingsPage() {
  useLanguage()
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('page.settings')}
        description={t('page.settings.desc')}
      />
      <EmptyState
        icon={SettingsIcon}
        title={t('page.settings.comingSoon')}
        description={t('page.settings.comingSoon.desc')}
      />
    </div>
  )
}
