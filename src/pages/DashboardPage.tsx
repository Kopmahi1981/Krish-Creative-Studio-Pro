import {
  Sparkles,
  FileText,
  Upload,
  TrendingUp,
  Layers,
  Users,
  Zap,
} from 'lucide-react'
import { PageHeader, SectionHeader } from '@/components/ui'
import { StatCard } from '@/features/dashboard/StatCard'
import { QuickActions, type QuickAction } from '@/features/dashboard/QuickActions'
import { RecentActivity, type ActivityItem } from '@/features/dashboard/RecentActivity'
import { RecentCreatives, type CreativeItem } from '@/features/dashboard/RecentCreatives'

const STATS = [
  { label: 'Creatives Generated', value: '128', delta: '+12% this week', trend: 'up' as const, icon: Sparkles, accent: 'purple' as const },
  { label: 'Active Templates', value: '24', delta: '+3 new', trend: 'up' as const, icon: Layers, accent: 'rose' as const },
  { label: 'Avg. Engagement', value: '4.8%', delta: '+0.6% vs last', trend: 'up' as const, icon: TrendingUp, accent: 'cyan' as const },
  { label: 'Team Members', value: '7', delta: 'No change', trend: 'flat' as const, icon: Users, accent: 'purple' as const },
]

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa-new', label: 'New Creative', description: 'Start from a blank canvas', icon: Sparkles, to: '/canvas', accent: 'rose' },
  { id: 'qa-template', label: 'Use Template', description: 'Browse Meta ad templates', icon: FileText, to: '/templates', accent: 'purple' },
  { id: 'qa-upload', label: 'Upload Asset', description: 'Add images to library', icon: Upload, to: '/assets', accent: 'cyan' },
]

const ACTIVITY: ActivityItem[] = [
  { id: 'a1', actor: 'Mahender', action: 'exported', target: 'Summer Sale — FB Post', time: '2m ago', tone: 'cyan' },
  { id: 'a2', actor: 'Priya', action: 'edited', target: 'Carousel Pack v3', time: '1h ago', tone: 'purple' },
  { id: 'a3', actor: 'System', action: 'synced', target: 'Brand Kit', time: 'Yesterday', tone: 'rose' },
]

const CREATIVES: CreativeItem[] = [
  { id: 'c1', title: 'Summer Sale Post', platform: 'Facebook', tone: 'rose' },
  { id: 'c2', title: 'Story Promo', platform: 'Instagram', tone: 'purple' },
  { id: 'c3', title: 'Launch Banner', platform: 'Facebook', tone: 'cyan' },
  { id: 'c4', title: 'Reel Cover', platform: 'Instagram', tone: 'rose' },
  { id: 'c5', title: 'Discount Card', platform: 'Facebook', tone: 'purple' },
  { id: 'c6', title: 'Hero Image', platform: 'Instagram', tone: 'cyan' },
]

/**
 * Phase 2 Dashboard — composed from independent reusable widgets (no business logic).
 */
export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, Mahender. Here's what's happening in your creative studio."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-brand-purple/10 px-3 py-1.5 text-xs font-medium text-brand-purple shadow-neon-purple">
            <Zap className="h-3.5 w-3.5" /> Pro Workspace
          </span>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      <section>
        <SectionHeader title="Quick Actions" description="Jump straight into your next task" />
        <QuickActions actions={QUICK_ACTIONS} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivity items={ACTIVITY} />
        <RecentCreatives items={CREATIVES} />
      </section>
    </div>
  )
}
