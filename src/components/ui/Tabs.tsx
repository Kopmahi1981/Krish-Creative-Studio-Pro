import { type ReactNode, useState } from 'react'
import { cn } from '@/utils/cn'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
  icon?: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  defaultTabId?: string
  className?: string
}

export function Tabs({ tabs, defaultTabId, className }: TabsProps) {
  const [active, setActive] = useState(defaultTabId ?? tabs[0]?.id)

  return (
    <div className={className}>
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {tabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-gradient-to-br from-brand-rose/20 to-brand-purple/20 text-white shadow-neon-purple'
                  : 'text-foreground-secondary hover:bg-white/5 hover:text-white',
              )}
              aria-selected={isActive}
              role="tab"
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="mt-4" role="tabpanel">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  )
}
