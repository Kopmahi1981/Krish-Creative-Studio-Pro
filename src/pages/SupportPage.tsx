import { LifeBuoy } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'

/**
 * Placeholder page — reached from the profile menu. Support UI ships later.
 */
export function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Support" description="Help center and contact options." />
      <EmptyState
        icon={LifeBuoy}
        title="Support hub coming soon"
        description="Browse docs, open tickets, and contact the team in a later phase."
      />
    </div>
  )
}
