import { type ReactNode, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useClickOutside } from '@/hooks'
import { cn } from '@/utils/cn'

export interface ContextMenuItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}

interface ContextMenuProps {
  /** The element that should receive the right-click / long-press. */
  children: ReactNode
  items: ContextMenuItem[]
}

export function ContextMenu({ children, items }: ContextMenuProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setPos(null), pos !== null)

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <div onContextMenu={onContextMenu}>{children}</div>
      <AnimatePresence>
        {pos && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            style={{ position: 'fixed', top: pos.y, left: pos.x, zIndex: 70 }}
            role="menu"
            className="min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-surface/90 p-1 shadow-glass backdrop-blur-2xl"
          >
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.()
                  setPos(null)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition',
                  item.danger
                    ? 'text-brand-rose hover:bg-brand-rose/10'
                    : 'text-foreground-secondary hover:bg-white/10',
                  item.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
