import { memo, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import type { CanvasObject } from '../../objects/model'

interface SelectionOverlayProps {
  /** The selected object (canvas-space geometry). */
  object: CanvasObject
  /** Artboard top-left in screen px (relative to the workspace container). */
  artboardScreen: { x: number; y: number }
  /** Effective zoom scale. */
  scale: number
  /** Begin a move drag from the body. */
  onMoveStart: (e: ReactPointerEvent) => void
  /** Begin a resize drag from a corner/edge handle. */
  onResizeStart: (handle: HandleId, e: ReactPointerEvent) => void
  /** Double-click the selection to edit (overlay covers the object, so it must handle this). */
  onEditStart: () => void
}

export type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

const HANDLES: { id: HandleId; cx: number; cy: number; cursor: string }[] = [
  { id: 'nw', cx: 0, cy: 0, cursor: 'nwse-resize' },
  { id: 'n', cx: 0.5, cy: 0, cursor: 'ns-resize' },
  { id: 'ne', cx: 1, cy: 0, cursor: 'nesw-resize' },
  { id: 'e', cx: 1, cy: 0.5, cursor: 'ew-resize' },
  { id: 'se', cx: 1, cy: 1, cursor: 'nwse-resize' },
  { id: 's', cx: 0.5, cy: 1, cursor: 'ns-resize' },
  { id: 'sw', cx: 0, cy: 1, cursor: 'swse-resize' },
  { id: 'w', cx: 0, cy: 0.5, cursor: 'ew-resize' },
]

const HANDLE = 10 // screen px (constant regardless of zoom)

/**
 * Screen-space selection chrome (purple outline + 8 handles + bounding box).
 * Drawn OUTSIDE the scaled Zoom Layer so handles stay a constant pixel size at
 * any zoom. Geometry is converted from canvas space to screen space via
 * `artboardScreen` + `scale`.
 */
export const SelectionOverlay = memo(function SelectionOverlay({
  object,
  artboardScreen,
  scale,
  onMoveStart,
  onResizeStart,
  onEditStart,
}: SelectionOverlayProps) {
  const { rect, rotation } = object
  const left = artboardScreen.x + rect.x * scale
  const top = artboardScreen.y + rect.y * scale
  const w = rect.width * scale
  const h = rect.height * scale

  const boxStyle: CSSProperties = {
    position: 'absolute',
    left,
    top,
    width: w,
    height: h,
    border: '1.5px solid rgb(168 85 247)',
    boxShadow: '0 0 0 1px rgba(168,85,247,0.35)',
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
    transformOrigin: 'center center',
    pointerEvents: 'none',
  }

  return (
    <div style={boxStyle}>
      {/* Move handle: the whole box captures drags to move the object. */}
      <div
        data-selection-overlay="move"
        style={{ position: 'absolute', inset: 0, cursor: 'move', pointerEvents: 'auto' }}
        onPointerDown={onMoveStart}
        onDoubleClick={onEditStart}
      />
      {HANDLES.map((hd) => (
        <div
          key={hd.id}
          style={{
            position: 'absolute',
            left: `calc(${hd.cx * 100}% - ${HANDLE / 2}px)`,
            top: `calc(${hd.cy * 100}% - ${HANDLE / 2}px)`,
            width: HANDLE,
            height: HANDLE,
            borderRadius: 2,
            background: '#fff',
            border: '1.5px solid rgb(168 85 247)',
            boxShadow: '0 0 6px rgba(168,85,247,0.6)',
            cursor: hd.cursor,
            pointerEvents: 'auto',
          }}
          onPointerDown={(e) => onResizeStart(hd.id, e)}
        />
      ))}
    </div>
  )
})
