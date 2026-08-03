import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
}

/**
 * Renders children into a dedicated container at the end of <body>.
 * Used by overlays (Modal, Drawer, Tooltip, Popover, Dropdown, Toast) so they
 * escape parent stacking/overflow contexts.
 */
export function Portal({ children }: PortalProps) {
  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}
