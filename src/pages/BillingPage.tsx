import { CreditCard } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { t, useLanguage } from '@/i18n'

/**
 * Placeholder page — reached from the profile menu. Billing UI ships later.
 */
export function BillingPage() {
  useLanguage()
  return (
    <div className="space-y-6">
      <PageHeader title={t('page.billing')} description={t('page.billing.desc')} />
      <EmptyState
        icon={CreditCard}
        title={t('page.billing.comingSoon')}
        description={t('page.billing.comingSoon.desc')}
      />
    </div>
  )
}
