import { ZoomControls } from './ZoomControls'

interface StatusBarProps {
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onSelectPreset: (multiplier: number) => void
  /** "1080 × 1080" */
  sizeLabel: string
  /** Number of selected elements. */
  selectionCount: number
  /** Whether the alignment grid is on. */
  grid: boolean
  /** Whether snapping is enabled (Phase 4.2 feature — shown as Off). */
  snap: boolean
  /** Cursor / artboard coordinate readout (canvas pixels). */
  coordinates: { x: number; y: number }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-foreground-muted">{label}</span>
      <span className="font-medium text-foreground-secondary">{value}</span>
    </span>
  )
}

/** Bottom status bar — live canvas metadata and zoom cluster. */
export function StatusBar({
  scale,
  onZoomIn,
  onZoomOut,
  onFit,
  onSelectPreset,
  sizeLabel,
  selectionCount,
  grid,
  snap,
  coordinates,
}: StatusBarProps) {
  return (
    <footer className="glass-strong z-10 flex items-center justify-between gap-3 border-t border-white/10 px-4 py-1.5 text-xs text-foreground-muted">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
        <Stat label="Size" value={sizeLabel} />
        <Stat label="Sel" value={String(selectionCount)} />
        <Stat label="Grid" value={grid ? 'On' : 'Off'} />
        <Stat label="Snap" value={snap ? 'On' : 'Off'} />
        <Stat label="XY" value={`${coordinates.x}, ${coordinates.y}`} />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-foreground-muted sm:inline">Zoom</span>
        <ZoomControls scale={scale} onZoomIn={onZoomIn} onZoomOut={onZoomOut} onFit={onFit} onSelectPreset={onSelectPreset} />
      </div>
    </footer>
  )
}
