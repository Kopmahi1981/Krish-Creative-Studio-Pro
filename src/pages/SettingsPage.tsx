import { Settings as SettingsIcon } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'

/**
 * Phase 1 placeholder — settings & preferences ship in Phase 8 (Deployment) / later.
 */
export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Workspace, branding, and account preferences will be configured here."
      />
      <EmptyState
        icon={SettingsIcon}
        title="Settings ship later"
        description="Workspace configuration, branding, and account preferences are deferred to a later phase."
      />
    </div>
  )
}
