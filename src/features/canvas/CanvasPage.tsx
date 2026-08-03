import { useState, useMemo } from 'react'
import { TopToolbar } from './components/TopToolbar'
import { LeftToolbar } from './components/LeftToolbar'
import { CanvasWorkspace } from './components/CanvasWorkspace'
import { RightPropertiesPanel } from './components/RightPropertiesPanel'
import { StatusBar } from './components/StatusBar'
import { createDefaultDocument } from './models/defaultDocument'
import { getCanvasSize } from './models/sizes'
import { useViewport } from './hooks/useViewport'
import type { CanvasSizeId, CanvasTool } from './models/editor'

/**
 * Phase 4.1 — Canvas Foundation (workspace refinement).
 * Renders the full editor shell with a real viewport manager: auto-fit scaling,
 * fit-to-screen, and symmetric centering. Size, tool, zoom, and grid remain local
 * UI state (no persistence / no element editing yet — editing ships in Phase 4.2).
 */
export function CanvasPage() {
  const [sizeId, setSizeId] = useState<CanvasSizeId>('square')
  const [tool, setTool] = useState<CanvasTool>('select')
  const [showGrid, setShowGrid] = useState(false)

  const document = useMemo(() => createDefaultDocument(sizeId), [sizeId])
  const size = getCanvasSize(sizeId)

  // Professional viewport manager: measures the workspace, auto-fits, and centers.
  const { scale, containerRef, fitToScreen, zoomIn, zoomOut, setUserZoom } = useViewport(size)

  const elementCount = document.pages[document.activePageIndex]?.elements.length ?? 0
  // Artboard center coordinate (the origin cross). No selection yet → "—".
  const centerX = Math.round(size.width / 2)
  const centerY = Math.round(size.height / 2)

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <TopToolbar
        title={document.title}
        sizeId={sizeId}
        onSizeChange={setSizeId}
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitToScreen}
        onSelectPreset={setUserZoom}
        showGrid={showGrid}
        onToggleGrid={setShowGrid}
      />

      <div className="flex min-h-0 flex-1">
        <LeftToolbar active={tool} onChange={setTool} />

        <div className="flex min-w-0 flex-1 flex-col">
          <CanvasWorkspace
            document={document}
            scale={scale}
            showGrid={showGrid}
            containerRef={containerRef}
          />
          <StatusBar
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFit={fitToScreen}
            onSelectPreset={setUserZoom}
            sizeLabel={`${size.width} × ${size.height}`}
            selectionCount={elementCount}
            grid={showGrid}
            snap={false}
            coordinates={{ x: centerX, y: centerY }}
          />
        </div>

        <RightPropertiesPanel />
      </div>
    </div>
  )
}
