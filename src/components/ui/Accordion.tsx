import { type ReactNode, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  /** Allow multiple panels open simultaneously. */
  multiple?: boolean
  className?: string
}

export function Accordion({ items, multiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id)
      if (multiple) return isOpen ? prev.filter((x) => x !== id) : [...prev, id]
      return isOpen ? [] : [id]
    })
  }

  return (
    <div className={cn('divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/5', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-white/5"
              aria-expanded={isOpen}
            >
              {item.title}
              <ChevronDown
                className={cn('h-4 w-4 text-foreground-muted transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-sm text-foreground-secondary">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
