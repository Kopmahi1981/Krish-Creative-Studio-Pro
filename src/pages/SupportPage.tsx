import { LifeBuoy } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { t, useLanguage } from '@/i18n'

/**
 * Placeholder page — reached from the profile menu. Support UI ships later.
 */
export function SupportPage() {
  useLanguage()
  return (
    <div className="space-y-6">
      <PageHeader title={t('page.support')} description={t('page.support.desc')} />
      <EmptyState
        icon={LifeBuoy}
        title={t('page.support.comingSoon')}
        description={t('page.support.comingSoon.desc')}
      />
    </div>
  )
}
