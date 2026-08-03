import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, CornerDownLeft, ArrowRight } from 'lucide-react'
import { Portal } from '@/components/ui'
import { useUiStore } from '@/store'
import { NAV_ITEMS } from '@/features/navigation/navItems'
import { useLockBodyScroll } from '@/hooks'
import { cn } from '@/utils/cn'

interface Command {
  id: string
  label: string
  hint?: string
  icon: typeof Search
  action: () => void
}

interface CommandPaletteProps {
  onNavigate: (path: string) => void
}

/**
 * Visual-only Command Palette (⌘K / Ctrl+K).
 * Filters a mock command set (navigation + actions) by query. No business logic —
 * navigation simply routes; actions are no-ops in Phase 2.
 */
export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const open = useUiStore((s) => s.commandPaletteOpen)
  const close = useUiStore((s) => s.closeCommandPalette)
  const [query, setQuery] = useState('')
  useLockBodyScroll(open)

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      label: `Go to ${item.label}`,
      hint: item.description,
      icon: ArrowRight,
      action: () => onNavigate(item.path),
    }))
    const actionCommands: Command[] = [
      { id: 'act-new', label: 'Create new creative', hint: 'Start from a blank canvas', icon: ArrowRight, action: () => onNavigate('/canvas') },
      { id: 'act-template', label: 'Browse templates', hint: 'Meta Ads templates', icon: ArrowRight, action: () => onNavigate('/templates') },
      { id: 'act-asset', label: 'Upload asset', hint: 'Opens asset library', icon: ArrowRight, action: () => onNavigate('/assets') },
    ]
    return [...navCommands, ...actionCommands]
  }, [onNavigate])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q),
    )
  }, [commands, query])

  const handleSelect = (command: Command) => {
    command.action()
    setQuery('')
    close()
  }

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={close} />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-surface/85 shadow-glass backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Search className="h-5 w-5 text-brand-cyan" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, pages, actions…"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-muted"
                  aria-label="Command query"
                />
                <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-foreground-muted">ESC</kbd>
              </div>
              <ul className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-foreground-muted">No results found</li>
                )}
                {filtered.map((command) => {
                  const Icon = command.icon
                  return (
                    <li key={command.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(command)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground-secondary transition hover:bg-white/10',
                        )}
                      >
                        <Icon className="h-4 w-4 text-brand-purple" />
                        <span className="flex-1">{command.label}</span>
                        {command.hint && <span className="text-xs text-foreground-muted">{command.hint}</span>}
                        <CornerDownLeft className="h-3.5 w-3.5 text-foreground-muted" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
