import {
  type CSSProperties,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { CanvasSize } from '../models/editor'
import { buildSafeAreaGuides, buildCenterGuides, SAFE_AREA_INSET_RATIO } from '../models/sizes'
import {
  useCanvasObjects,
  selectActivePage,
  selectActiveSize,
  selectGridVisible,
  selectSourceLanguage,
  selectVariants,
} from '../objects/store'
import { resolveObject } from '../i18n-content/resolver'
import { CanvasObjectsLayer } from './objects/CanvasObjectsLayer'
import { SelectionOverlay } from './objects/SelectionOverlay'
import { TextEditorOverlay } from './objects/TextEditorOverlay'
import { useCanvasInteractions } from '../hooks/useCanvasInteractions'
import type { TextObject } from '../objects/model'
import { t, useLanguage } from '@/i18n'

interface CanvasWorkspaceProps {
  scale: number
  /** Ref to the scrollable workspace element (owned by the viewport hook). */
  containerRef: RefObject<HTMLDivElement | null>
}

/**
 * Canvas workspace layout hierarchy (per Milestone 4.2.1 + Phase 4.3):
 *
 *   CanvasViewport  (scroll container; 12px breathing room; only element that scrolls)
 *     └─ Pan Layer   (fills viewport, flex-centered)
 *        └─ Sizer    (scaled px dims → drives scroll area)
 *           └─ Zoom Layer (transform: scale ONLY)
 *              └─ Artboard (intrinsic)  ← CanvasObjectsLayer (objects, canvas space)
 *                                        ← TextEditorOverlay (editing, canvas space)
 *     └─ SelectionOverlay (screen space, on top)
 *
 * Object geometry is in canvas pixels; the Zoom Layer scales it. Selection chrome
 * is screen-space so handles stay constant size at any zoom.
 */
export function CanvasWorkspace({ scale, containerRef }: CanvasWorkspaceProps) {
  const page = useCanvasObjects(selectActivePage)
  const size: CanvasSize = useCanvasObjects(selectActiveSize)
  const showGrid = useCanvasObjects(selectGridVisible)
  const artboardRef = useRef<HTMLDivElement>(null)

  const selectedId = useCanvasObjects((s) => s.selectedObjectId)
  const editingId = useCanvasObjects((s) => s.editingObjectId)
  const objectsById = useCanvasObjects((s) => s.objectsById)
  const toolMode = useCanvasObjects((s) => s.toolMode)

  // Phase 5.2: resolve through the active DESIGN language so selection chrome
  // and the inline editor show the translated text, while the ORIGINAL object
  // in the store stays untouched.
  const designLanguage = useCanvasObjects((s) => s.activeDesignLanguage)
  const sourceLanguage = useCanvasObjects(selectSourceLanguage)
  const variants = useCanvasObjects(selectVariants)

  const rawSelected = selectedId ? objectsById[selectedId] : null
  const rawEditing = editingId ? objectsById[editingId] : null
  const selectedObject = rawSelected
    ? resolveObject(rawSelected, designLanguage, sourceLanguage, variants)
    : null
  const editingObject = rawEditing
    ? (resolveObject(rawEditing, designLanguage, sourceLanguage, variants) as TextObject)
    : null
  // Subscribe to language so the empty-state messages localize on switch.
  useLanguage()

  const { handleArtboardPointerDown, handleArtboardClick, handleObjectPointerDown, handleOverlayMoveStart, handleOverlayResizeStart, handleObjectDoubleClick } =
    useCanvasInteractions({ artboardRef, containerRef, scale })

  // Screen-space position of the artboard (relative to the scroll content).
  const [artboardScreen, setArtboardScreen] = useState({ x: 0, y: 0 })
  const recompute = () => {
    const a = artboardRef.current
    const c = containerRef.current
    if (!a || !c) return
    const ar = a.getBoundingClientRect()
    const cr = c.getBoundingClientRect()
    setArtboardScreen({ x: ar.left - cr.left + c.scrollLeft, y: ar.top - cr.top + c.scrollTop })
  }
  useLayoutEffect(recompute, [scale, selectedId, editingId, containerRef])
  // Recompute on scroll so the screen-space overlay tracks the artboard.
  const onScroll = () => requestAnimationFrame(recompute)

  const sizerW = size.width * scale
  const sizerH = size.height * scale

  const boardStyle: CSSProperties = {
    width: size.width,
    height: size.height,
    background: page.background,
    // Grid: rendered in CANVAS units (fixed 40px tile). The artboard lives inside
    // the Zoom Layer's `transform: scale(scale)`, so the browser scales this grid
    // for us. Using `40 * scale` here would double-scale it (40*scale² screen px and
    // sub-pixel lines at low zoom), which is why the grid looked missing at 25%/50%.
    backgroundImage: showGrid
      ? `linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)`
      : undefined,
    backgroundSize: showGrid ? '40px 40px' : undefined,
    backgroundPosition: showGrid ? '0 0' : undefined,
    cursor: toolMode === 'text' ? 'text' : toolMode === 'hand' ? 'grab' : 'default',
  }

  const safeGuides = buildSafeAreaGuides(size.width, size.height)
  const centerGuides = buildCenterGuides(size.width, size.height)

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      onPointerDown={(e) => {
        // Pan from empty workspace area (clicks that don't hit the artboard/objects).
        if (useCanvasObjects.getState().toolMode === 'hand' && e.target === e.currentTarget) {
          handleArtboardPointerDown(e)
        }
      }}
      className="relative flex flex-1 overflow-auto bg-background p-3"
    >
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(40rem 40rem at 30% 0%, rgba(168,85,247,0.10), transparent 60%), radial-gradient(36rem 36rem at 90% 100%, rgba(34,211,238,0.08), transparent 55%)',
        }}
      />

      {/* Pan Layer */}
      <div className="m-auto">
        {/* Sizer (scaled px) */}
        <div style={{ width: sizerW, height: sizerH }}>
          {/* Zoom Layer (scale only) */}
          <div
            style={{
              width: size.width,
              height: size.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* Artboard (intrinsic) */}
            <div
              ref={artboardRef}
              data-canvas-artboard="true"
              className="relative shadow-glass ring-1 ring-white/10"
              style={boardStyle}
              role="img"
              aria-label={`${size.width} by ${size.height} artboard at ${Math.round(scale * 100)}%`}
              onPointerDown={handleArtboardPointerDown}
              onClick={handleArtboardClick}
            >
              {/* Guides */}
              {centerGuides.map((g) => (
                <div
                  key={g.id}
                  data-export-ignore="true"
                  className="pointer-events-none absolute bg-white/25"
                  style={
                    g.orientation === 'vertical'
                      ? { left: g.position, top: 0, width: 1, height: size.height }
                      : { top: g.position, left: 0, height: 1, width: size.width }
                  }
                />
              ))}
              <div
                data-export-ignore="true"
                className="pointer-events-none absolute border border-dashed border-white/40"
                style={{
                  left: size.width * SAFE_AREA_INSET_RATIO,
                  top: size.height * SAFE_AREA_INSET_RATIO,
                  width: size.width * (1 - SAFE_AREA_INSET_RATIO * 2),
                  height: size.height * (1 - SAFE_AREA_INSET_RATIO * 2),
                }}
              />
              {safeGuides.map((g) => (
                <div
                  key={g.id}
                  data-export-ignore="true"
                  className="pointer-events-none absolute bg-white/30"
                  style={
                    g.orientation === 'vertical'
                      ? { left: g.position, top: 0, width: 1, height: size.height }
                      : { top: g.position, left: 0, height: 1, width: size.width }
                  }
                />
              ))}

              {/* Empty-state placeholder — only when there are no objects (overlay, never clips). */}
              {Object.keys(objectsById).length === 0 && !editingObject && (() => {
                const fontPx = Math.min(120, Math.max(18, 28 / scale))
                const lowZoom = scale < 0.5
                return (
                  <div
                    data-export-ignore="true"
                    className="pointer-events-none absolute inset-0 grid place-items-center overflow-visible p-6 text-center"
                    style={{ fontSize: `${fontPx}px` }}
                  >
                    {lowZoom ? (
                      <div className="font-semibold leading-snug text-white/80">
                        <p>{t('canvas.empty.start')}</p>
                        <p className="mt-2 text-[0.7em] font-medium text-white/70">
                          {t('canvas.empty.dblclick')}
                        </p>
                      </div>
                    ) : (
                      <p className="max-w-[28rem] font-medium leading-relaxed text-white/70">
                        {t('canvas.empty.message')}
                      </p>
                    )}
                  </div>
                )
              })()}

              {/* Objects (canvas space) */}
              <CanvasObjectsLayer
                interactive
                onObjectPointerDown={handleObjectPointerDown}
                onObjectDoubleClick={(id, e) => handleObjectDoubleClick(id, e)}
              />

              {/* Inline text editor (canvas space, aligns + scales with artboard) */}
              {editingObject && editingObject.kind === 'text' && (
                <TextEditorOverlay
                  object={editingObject}
                  onCommit={(text) => {
                    // Persist only — edit mode is exited explicitly (Escape) or by
                    // clicking elsewhere (select/deselect clears editingObjectId).
                    //
                    // Phase 5.2: routed through `setObjectText`, the SINGLE
                    // chokepoint that decides source-vs-variant. On a variant
                    // language this writes the overlay ONLY; the original text
                    // object is never touched.
                    useCanvasObjects.getState().setObjectText(editingObject.id, text)
                  }}
                  onCancel={() => useCanvasObjects.getState().setEditing(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selection chrome (screen space) */}
      {selectedObject && !editingObject && (
        <SelectionOverlay
          object={selectedObject}
          artboardScreen={artboardScreen}
          scale={scale}
          onMoveStart={handleOverlayMoveStart}
          onResizeStart={handleOverlayResizeStart}
          onEditStart={() => useCanvasObjects.getState().setEditing(selectedObject.id)}
        />
      )}
    </div>
  )
}
