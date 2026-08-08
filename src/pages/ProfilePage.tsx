import { User } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { t, useLanguage } from '@/i18n'

/**
 * Placeholder page — reached from the profile menu. Account UI ships later.
 */
export function ProfilePage() {
  useLanguage()
  return (
    <div className="space-y-6">
      <PageHeader title={t('page.profile')} description={t('page.profile.desc')} />
      <EmptyState
        icon={User}
        title={t('page.profile.comingSoon')}
        description={t('page.profile.comingSoon.desc')}
      />
    </div>
  )
}
