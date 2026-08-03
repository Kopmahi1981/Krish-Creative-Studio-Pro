import { GlassCard, SectionHeader } from '@/components/ui'

export interface ActivityItem {
  id: string
  actor: string
  action: string
  target: string
  time: string
  tone?: 'rose' | 'purple' | 'cyan'
}

interface RecentActivityProps {
  items: ActivityItem[]
}

/**
 * Mock activity feed widget. No live data in Phase 2.
 */
export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <GlassCard>
      <SectionHeader title="Recent Activity" description="Latest updates across your workspace" />
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-${item.tone ?? 'purple'}`}
            />
            <div className="text-sm">
              <p className="text-foreground-secondary">
                <span className="font-semibold text-foreground">{item.actor}</span> {item.action}{' '}
                <span className="font-medium text-brand-cyan">{item.target}</span>
              </p>
              <p className="text-xs text-foreground-muted">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}
