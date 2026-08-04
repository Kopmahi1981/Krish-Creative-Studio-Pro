import { useState, useEffect } from 'react'
import { TopToolbar } from './components/TopToolbar'
import { LeftToolbar } from './components/LeftToolbar'
import { CanvasWorkspace } from './components/CanvasWorkspace'
import { RightPropertiesPanel } from './components/RightPropertiesPanel'
import { StatusBar } from './components/StatusBar'
import { useViewport } from './hooks/useViewport'
import { useCanvasObjects, selectActiveSize } from './objects/store'
import { createDefaultDocument } from './models/defaultDocument'
import type { CanvasSizeId, CanvasTool } from './models/editor'

/**
 * Phase 4.3 — Canvas Foundation + Object Engine.
 *
 * The editor shell (top/left/right/status bars, workspace) is unchanged in layout.
 * Two centralized stores drive it:
 *  - `useViewport` — fit scale (auto) + user zoom (independent).
 *  - `useCanvasObjects` — the Document Model (project → document → pages →
 *    layers → objects), selection, tool mode, and editing state.
 */
export function CanvasPage() {
  const [sizeId, setSizeId] = useState<CanvasSizeId>('square')
  const [showGrid, setShowGrid] = useState(false)

  const tool = useCanvasObjects((s) => s.toolMode)
  const setToolMode = useCanvasObjects((s) => s.setToolMode)
  const setDocumentSize = useCanvasObjects((s) => s.setDocumentSize)
  const activeSize = useCanvasObjects(selectActiveSize)
  const selectedId = useCanvasObjects((s) => s.selectedObjectId)
  const objectsById = useCanvasObjects((s) => s.objectsById)

  // Keep the studio's document size + the object engine's document size in sync.
  useEffect(() => {
    setDocumentSize(sizeId)
  }, [sizeId, setDocumentSize])

  const size = activeSize
  const { scale, containerRef, fitToScreen, zoomIn, zoomOut, setUserZoom } = useViewport(size)
  // The artboard background comes from the studio's default document factory.
  const document = createDefaultDocument(sizeId)

  const selectedObject = selectedId ? objectsById[selectedId] : null
  const objectCount = Object.keys(objectsById).length
  const centerX = selectedObject
    ? Math.round(selectedObject.rect.x + selectedObject.rect.width / 2)
    : Math.round(size.width / 2)
  const centerY = selectedObject
    ? Math.round(selectedObject.rect.y + selectedObject.rect.height / 2)
    : Math.round(size.height / 2)

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <TopToolbar
        title="Untitled Design"
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
        <LeftToolbar active={tool} onChange={(t: CanvasTool) => setToolMode(t)} />

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
            selectionCount={objectCount}
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
