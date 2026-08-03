import { useEffect } from 'react'

interface UseKeyboardShortcutOptions {
  /** Single character or key name, e.g. 'k', 'Escape'. Case-insensitive. */
  key: string
  /** Invoked when the key (and optional modifier) is pressed. */
  onTrigger: () => void
  /** Require ⌘ (mac) or Ctrl (win/linux) to be held. */
  meta?: boolean
  /** Disable the listener entirely. */
  enabled?: boolean
}

/**
 * Global keyboard shortcut listener.
 * Used for ⌘K / Ctrl+K (command palette) and Escape-style bindings.
 */
export function useKeyboardShortcut({
  key,
  onTrigger,
  meta = false,
  enabled = true,
}: UseKeyboardShortcutOptions): void {
  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase()
      const metaOk = meta ? event.metaKey || event.ctrlKey : true
      if (matchesKey && metaOk) {
        event.preventDefault()
        onTrigger()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, onTrigger, meta, enabled])
}
