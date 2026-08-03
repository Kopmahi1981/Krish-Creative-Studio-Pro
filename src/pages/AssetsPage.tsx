import { Image as ImageIcon } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'

/**
 * Phase 1 placeholder — asset management ships in Phase 5.
 */
export function AssetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Library"
        description="Upload and organize images, brand assets, and media."
      />
      <EmptyState
        icon={ImageIcon}
        title="Asset management ships in Phase 5"
        description="Upload, tag, and reuse media across all your creatives in a later phase."
      />
    </div>
  )
}
