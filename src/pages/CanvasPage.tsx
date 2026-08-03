import { PenTool } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'

/**
 * Phase 1 placeholder — the canvas editor ships in Phase 4.
 */
export function CanvasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Canvas Editor"
        description="The visual editor with layers, text, and shapes will be built here."
      />
      <EmptyState
        icon={PenTool}
        title="Canvas ships in Phase 4"
        description="A full visual editor with drag-and-drop layers, text, and shapes is planned for a later phase."
      />
    </div>
  )
}
