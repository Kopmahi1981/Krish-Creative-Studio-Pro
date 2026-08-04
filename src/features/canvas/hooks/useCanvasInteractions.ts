import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { useCanvasObjects } from '../objects/store'
import type { HandleId } from '../components/objects/SelectionOverlay'

interface UseCanvasInteractionsArgs {
  /** The artboard element (intrinsic-size, inside the Zoom Layer). */
  artboardRef: RefObject<HTMLDivElement | null>
  /** Scrollable workspace element (used for panning). */
  containerRef: RefObject<HTMLDivElement | null>
  /** Effective zoom scale. */
  scale: number
}

interface DragState {
  mode: 'move' | 'resize' | 'pan'
  handle?: HandleId
  startScreenX: number
  startScreenY: number
  startRect: { x: number; y: number; width: number; height: number }
  id: string
  startScrollLeft?: number
  startScrollTop?: number
}

/**
 * All pointer + keyboard interactions for the Object Engine.
 *
 * - Empty-artboard click in Select mode: deselect.
 * - Empty-artboard click in Text mode: create a text object at the click point.
 * - Object / overlay-body drag: move.
 * - Overlay handle drag: resize (corner/edge).
 * - Keyboard: Delete/Backspace removes the selected object; arrows nudge it.
 *   (Copy/Cut/Paste/Select-All are handled natively by the contentEditable
 *   editor, so we don't intercept them while editing.)
 *
 * Drag deltas are converted screen→canvas via `scale` and the artboard rect.
 */
export function useCanvasInteractions({ artboardRef, containerRef, scale }: UseCanvasInteractionsArgs) {
  const drag = useRef<DragState | null>(null)

  const toCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const art = artboardRef.current
      const rect = art?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      // art.getBoundingClientRect() already reflects the scaled size + pan.
      const x = (clientX - rect.left) / scale
      const y = (clientY - rect.top) / scale
      return { x, y }
    },
    [artboardRef, scale],
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const d = drag.current
      if (!d) return

      // Pan: translate the scroll container by the drag delta.
      if (d.mode === 'pan') {
        const c = containerRef.current
        if (c) {
          c.scrollLeft = (d.startScrollLeft ?? 0) - (e.clientX - d.startScreenX)
          c.scrollTop = (d.startScrollTop ?? 0) - (e.clientY - d.startScreenY)
        }
        return
      }

      const dx = (e.clientX - d.startScreenX) / scale
      const dy = (e.clientY - d.startScreenY) / scale
      const r = d.startRect

      if (d.mode === 'move') {
        useCanvasObjects.getState().updateObject(d.id, {
          rect: { ...r, x: Math.round(r.x + dx), y: Math.round(r.y + dy) },
        })
      } else if (d.mode === 'resize' && d.handle) {
        let { x, y, width, height } = r
        if (d.handle.includes('e')) width = Math.max(24, r.width + dx)
        if (d.handle.includes('s')) height = Math.max(24, r.height + dy)
        if (d.handle.includes('w')) {
          width = Math.max(24, r.width - dx)
          x = r.x + (r.width - width)
        }
        if (d.handle.includes('n')) {
          height = Math.max(24, r.height - dy)
          y = r.y + (r.height - height)
        }
        useCanvasObjects.getState().updateObject(d.id, {
          rect: { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) },
        })
      }
    },
    [scale],
  )

  const endDrag = useCallback(() => {
    drag.current = null
    if (containerRef.current) containerRef.current.style.cursor = ''
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', endDrag)
  }, [onPointerMove, containerRef])

  const beginDrag = useCallback(
    (state: DragState) => {
      drag.current = state
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', endDrag)
    },
    [onPointerMove, endDrag],
  )

  // --- Public handlers ---

  const handleArtboardPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      const store = useCanvasObjects.getState()
      if (store.toolMode === 'hand') {
        // Pan: drag the workspace to scroll. Works on the artboard and empty space.
        const c = containerRef.current
        if (c) {
          c.style.cursor = 'grabbing'
          beginDrag({
            mode: 'pan',
            id: '',
            startScreenX: e.clientX,
            startScreenY: e.clientY,
            startRect: { x: 0, y: 0, width: 0, height: 0 },
            startScrollLeft: c.scrollLeft,
            startScrollTop: c.scrollTop,
          })
        }
        return
      }
      if (store.toolMode === 'text') {
        const { x, y } = toCanvas(e.clientX, e.clientY)
        // Place the text box so the click is near its top-left, offset slightly.
        store.addText(Math.round(x - 4), Math.round(y - 16))
      } else {
        store.deselect()
      }
    },
    [toCanvas, beginDrag, containerRef],
  )

  const handleObjectPointerDown = useCallback(
    (id: string, e: ReactPointerEvent) => {
      e.stopPropagation()
      const store = useCanvasObjects.getState()
      store.select(id)
      const obj = store.objectsById[id]
      if (!obj) return
      beginDrag({
        mode: 'move',
        id,
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        startRect: { ...obj.rect },
      })
    },
    [beginDrag],
  )

  const handleOverlayMoveStart = useCallback(
    (e: ReactPointerEvent) => {
      e.stopPropagation()
      const store = useCanvasObjects.getState()
      const id = store.selectedObjectId
      if (!id) return
      const obj = store.objectsById[id]
      if (!obj) return
      beginDrag({
        mode: 'move',
        id,
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        startRect: { ...obj.rect },
      })
    },
    [beginDrag],
  )

  const handleOverlayResizeStart = useCallback(
    (handle: HandleId, e: ReactPointerEvent) => {
      e.stopPropagation()
      const store = useCanvasObjects.getState()
      const id = store.selectedObjectId
      if (!id) return
      const obj = store.objectsById[id]
      if (!obj) return
      beginDrag({
        mode: 'resize',
        handle,
        id,
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        startRect: { ...obj.rect },
      })
    },
    [beginDrag],
  )

  const handleObjectDoubleClick = useCallback((id: string, _e: ReactPointerEvent | React.MouseEvent) => {
    useCanvasObjects.getState().setEditing(id)
  }, [])

  // Keyboard: delete + nudge. Disabled while editing text.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const store = useCanvasObjects.getState()
      if (store.editingObjectId) return // editor handles its own keys
      const id = store.selectedObjectId
      if (!id) return
      const obj = store.objectsById[id]
      if (!obj) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        store.removeObject(id)
        return
      }
      const step = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        store.updateObject(id, { rect: { ...obj.rect, x: obj.rect.x - step } })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        store.updateObject(id, { rect: { ...obj.rect, x: obj.rect.x + step } })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        store.updateObject(id, { rect: { ...obj.rect, y: obj.rect.y - step } })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        store.updateObject(id, { rect: { ...obj.rect, y: obj.rect.y + step } })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return {
    handleArtboardPointerDown,
    handleObjectPointerDown,
    handleOverlayMoveStart,
    handleOverlayResizeStart,
    handleObjectDoubleClick,
  }
}
