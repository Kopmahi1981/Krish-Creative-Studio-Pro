import { CreditCard } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'

/**
 * Placeholder page — reached from the profile menu. Billing UI ships later.
 */
export function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Plans, invoices, and payment methods." />
      <EmptyState
        icon={CreditCard}
        title="Billing center coming soon"
        description="Manage your subscription, view invoices, and update payment methods in a later phase."
      />
    </div>
  )
}
