import { ImageIcon, MoreHorizontal } from 'lucide-react'
import { GlassCard, SectionHeader, Badge } from '@/components/ui'

export interface CreativeItem {
  id: string
  title: string
  platform: string
  tone?: 'rose' | 'purple' | 'cyan'
}

interface RecentCreativesProps {
  items: CreativeItem[]
}

/**
 * Mock recent-creatives grid. Placeholder thumbnails; no uploads in Phase 2.
 */
export function RecentCreatives({ items }: RecentCreativesProps) {
  return (
    <GlassCard>
      <SectionHeader title="Recent Creatives" description="Your latest Meta ad drafts" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="mb-3 grid aspect-[4/3] place-items-center rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60">
              <ImageIcon className="h-6 w-6 text-foreground-muted transition group-hover:text-brand-cyan" />
            </div>
            <p className="truncate text-xs font-medium text-foreground">{item.title}</p>
            <div className="mt-1 flex items-center justify-between">
              <Badge tone={item.tone ?? 'slate'}>{item.platform}</Badge>
              <button
                type="button"
                aria-label="More options"
                className="text-foreground-muted transition hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
