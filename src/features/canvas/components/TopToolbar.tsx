import { FilePlus2, Undo2, Redo2, Download, Sparkles } from 'lucide-react'
import { IconButton, Input } from '@/components/ui'
import { CanvasSizeSelector } from './CanvasSizeSelector'
import { ZoomControls } from './ZoomControls'
import { GridToggle } from './GridToggle'
import { DesignLanguageSwitcher } from './DesignLanguageSwitcher'
import type { CanvasSizeId } from '../models/editor'
import { useLanguage } from '@/i18n'
import { useCanvasObjects } from '../objects/store'

interface TopToolbarProps {
  sizeId: CanvasSizeId
  onSizeChange: (id: CanvasSizeId) => void
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onSelectPreset: (multiplier: number) => void
  showGrid: boolean
  onToggleGrid: (next: boolean) => void
  onExportClick?: () => void
}

/**
 * Top toolbar of the canvas editor. Composes the size selector, zoom cluster,
 * grid toggle, undo-redo, and export.
 */
export function TopToolbar({
  sizeId,
  onSizeChange,
  scale,
  onZoomIn,
  onZoomOut,
  onFit,
  onSelectPreset,
  showGrid,
  onToggleGrid,
  onExportClick,
}: TopToolbarProps) {
  // Subscribe to language so the document title localizes on switch.
  useLanguage()
  const projectName = useCanvasObjects((s) => s.project.name)
  const setProjectName = useCanvasObjects((s) => s.setProjectName)
  const newBlankProject = useCanvasObjects((s) => s.newBlankProject)
  const undo = useCanvasObjects((s) => s.undo)
  const redo = useCanvasObjects((s) => s.redo)
  const canUndo = useCanvasObjects((s) => s.historyPast.length > 0)
  const canRedo = useCanvasObjects((s) => s.historyFuture.length > 0)

  return (
    <header className="glass-strong z-10 flex items-center gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
      <div className="hidden min-w-0 flex-1 sm:block">
        <Input
          aria-label="Project name"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          onBlur={(event) => setProjectName(event.target.value)}
          className="h-9 max-w-56 py-1.5 text-sm font-semibold"
        />
      </div>

      <div className="flex items-center gap-2">
        <CanvasSizeSelector value={sizeId} onChange={onSizeChange} />
        <GridToggle active={showGrid} onChange={onToggleGrid} />
        {/* Phase 5.2: DESIGN content language (distinct from the UI language). */}
        <DesignLanguageSwitcher />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ZoomControls scale={scale} onZoomIn={onZoomIn} onZoomOut={onZoomOut} onFit={onFit} onSelectPreset={onSelectPreset} />
        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
        <IconButton
          label="New blank project"
          size="sm"
          onClick={() => {
            if (window.confirm('Create a new blank project? The current local project is already saved and will be replaced.')) {
              newBlankProject()
            }
          }}
        >
          <FilePlus2 className="h-4 w-4" />
        </IconButton>
        <IconButton label="Undo (Ctrl+Z)" size="sm" disabled={!canUndo} onClick={undo}>
          <Undo2 className="h-4 w-4" />
        </IconButton>
        <IconButton label="Redo (Ctrl+Y)" size="sm" disabled={!canRedo} onClick={redo}>
          <Redo2 className="h-4 w-4" />
        </IconButton>
        <IconButton label="Export creative image" size="sm" onClick={onExportClick}>
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
