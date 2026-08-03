import { Undo2, Redo2, Download, Sparkles } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { CanvasSizeSelector } from './CanvasSizeSelector'
import { ZoomControls } from './ZoomControls'
import { GridToggle } from './GridToggle'
import type { CanvasSizeId } from '../models/editor'

interface TopToolbarProps {
  title: string
  sizeId: CanvasSizeId
  onSizeChange: (id: CanvasSizeId) => void
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onSelectPreset: (multiplier: number) => void
  showGrid: boolean
  onToggleGrid: (next: boolean) => void
}

/**
 * Top toolbar of the canvas editor. Composes the size selector, zoom cluster,
 * grid toggle, and (disabled / placeholder in Phase 4.1) undo-redo and export.
 */
export function TopToolbar({
  title,
  sizeId,
  onSizeChange,
  scale,
  onZoomIn,
  onZoomOut,
  onFit,
  onSelectPreset,
  showGrid,
  onToggleGrid,
}: TopToolbarProps) {
  return (
    <header className="glass-strong z-10 flex items-center gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
      <div className="hidden min-w-0 flex-1 sm:block">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        <CanvasSizeSelector value={sizeId} onChange={onSizeChange} />
        <GridToggle active={showGrid} onChange={onToggleGrid} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ZoomControls scale={scale} onZoomIn={onZoomIn} onZoomOut={onZoomOut} onFit={onFit} onSelectPreset={onSelectPreset} />
        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
        <IconButton label="Available in later phase" size="sm" disabled>
          <Undo2 className="h-4 w-4" />
        </IconButton>
        <IconButton label="Available in later phase" size="sm" disabled>
          <Redo2 className="h-4 w-4" />
        </IconButton>
        <IconButton label="Available in later phase" size="sm" disabled>
          <Download className="h-4 w-4" />
        </IconButton>
        <button
          type="button"
          disabled
          title="Available in later phase"
          aria-label="Available in later phase"
          className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-foreground-secondary opacity-50 transition hover:bg-white/10 md:inline-flex"
        >
          <Sparkles className="h-4 w-4" /> AI
        </button>
      </div>
    </header>
  )
}
