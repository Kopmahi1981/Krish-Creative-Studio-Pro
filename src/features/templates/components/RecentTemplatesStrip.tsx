import { History } from 'lucide-react'
import { SectionHeader } from '@/components/ui'
import type { Template } from '../types/template'
import { TemplateThumbnail } from './TemplateThumbnail'

interface RecentTemplatesStripProps {
  templates: Template[]
  onSelect: (template: Template) => void
}

/**
 * Horizontal strip of recently viewed templates. Rendered above the grid when
 * there are recents; purely presentational and click-to-select.
 */
export function RecentTemplatesStrip({ templates, onSelect }: RecentTemplatesStripProps) {
  if (templates.length === 0) return null

  return (
    <div>
      <SectionHeader
        title="Recently Viewed"
        description="Pick up where you left off"
        className="mb-3"
        action={<History className="h-4 w-4 text-foreground-muted" />}
      />
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            className="group w-36 shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-left transition hover:border-white/20 hover:bg-white/10"
          >
            <TemplateThumbnail template={template} className="w-full" />
            <p className="mt-2 line-clamp-1 text-xs font-medium text-foreground-secondary">{template.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
