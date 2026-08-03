import { Bell } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'

/**
 * Placeholder page — reached from the notifications panel. Real list ships later.
 */
export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Your studio activity and alerts." />
      <EmptyState
        icon={Bell}
        title="No new notifications"
        description="When there's activity in your workspace, it will appear here."
      />
    </div>
  )
}
