import { memo } from 'react'
import { useCanvasObjects, selectActiveObjectIds } from '../../objects/store'
import { TextObjectView } from './TextObjectView'
import type { TextObject } from '../../objects/model'

interface CanvasObjectsLayerProps {
  /** Called by each object's pointer-down so the interaction hook can start a drag. */
  onObjectPointerDown: (id: string, e: React.PointerEvent) => void
  onObjectDoubleClick: (id: string, e: React.MouseEvent) => void
  /** Whether objects should capture pointer events (select/move mode). */
  interactive: boolean
}

/**
 * Renders all objects of the active layer in CANVAS space. Mounted inside the
 * artboard (which is inside the scaled Zoom Layer), so geometry stays in
 * intrinsic pixels and scales with zoom automatically.
 */
export const CanvasObjectsLayer = memo(function CanvasObjectsLayer({
  onObjectPointerDown,
  onObjectDoubleClick,
  interactive,
}: CanvasObjectsLayerProps) {
  const ids = useCanvasObjects(selectActiveObjectIds)
  const objectsById = useCanvasObjects((s) => s.objectsById)

  return (
    <div className="absolute inset-0">
      {ids.map((id) => {
        const obj = objectsById[id]
        if (!obj || !obj.visible) return null
        if (obj.kind === 'text') {
          return (
            <TextObjectView
              key={id}
              object={obj as TextObject}
              interactive={interactive}
              onPointerDown={(e) => onObjectPointerDown(id, e)}
              onDoubleClick={(e) => onObjectDoubleClick(id, e)}
            />
          )
        }
        // Future kinds render here without changing this file's structure.
        return null
      })}
    </div>
  )
})
