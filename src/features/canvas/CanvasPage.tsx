import { TopToolbar } from './components/TopToolbar'
import { LeftToolbar } from './components/LeftToolbar'
import { CanvasWorkspace } from './components/CanvasWorkspace'
import { RightPropertiesPanel } from './components/RightPropertiesPanel'
import { StatusBar } from './components/StatusBar'
import { useViewport } from './hooks/useViewport'
import { useCanvasObjects, selectActiveSize, selectGridVisible } from './objects/store'
import type { CanvasTool } from './models/editor'

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
  const tool = useCanvasObjects((s) => s.toolMode)
  const setToolMode = useCanvasObjects((s) => s.setToolMode)
  const setDocumentSize = useCanvasObjects((s) => s.setDocumentSize)
  const setGridVisible = useCanvasObjects((s) => s.setGridVisible)
  const activeSize = useCanvasObjects(selectActiveSize)
  const showGrid = useCanvasObjects(selectGridVisible)
  const selectedId = useCanvasObjects((s) => s.selectedObjectId)
  const objectsById = useCanvasObjects((s) => s.objectsById)

  const size = activeSize
  const { scale, containerRef, fitToScreen, zoomIn, zoomOut, setUserZoom } = useViewport(size)

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
        sizeId={size.id}
        onSizeChange={setDocumentSize}
        scale={scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitToScreen}
        onSelectPreset={setUserZoom}
        showGrid={showGrid}
        onToggleGrid={setGridVisible}
      />

      <div className="flex min-h-0 flex-1">
        <LeftToolbar active={tool} onChange={(t: CanvasTool) => setToolMode(t)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <CanvasWorkspace
            scale={scale}
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
