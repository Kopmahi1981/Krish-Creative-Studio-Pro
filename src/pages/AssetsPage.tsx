import { Image as ImageIcon } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { t, useLanguage } from '@/i18n'

/**
 * Phase 1 placeholder — asset management ships in Phase 5.
 */
export function AssetsPage() {
  useLanguage()
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('page.assets.title')}
        description={t('page.assets.desc')}
      />
      <EmptyState
        icon={ImageIcon}
        title={t('page.assets.comingSoon')}
        description={t('page.assets.empty.desc')}
      />
    </div>
  )
}
