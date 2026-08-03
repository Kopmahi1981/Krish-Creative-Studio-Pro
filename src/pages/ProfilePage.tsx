import { User } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'

/**
 * Placeholder page — reached from the profile menu. Account UI ships later.
 */
export function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your personal account details." />
      <EmptyState
        icon={User}
        title="Profile settings coming soon"
        description="Edit your name, avatar, and personal preferences in a later phase."
      />
    </div>
  )
}
