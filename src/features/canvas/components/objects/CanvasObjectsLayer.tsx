import { memo } from 'react'
import {
  useCanvasObjects,
  selectActiveObjectIds,
  selectSourceLanguage,
  selectVariants,
} from '../../objects/store'
import { TextObjectView } from './TextObjectView'
import { ImageObjectView } from './ImageObjectView'
import type { TextObject, ImageObject } from '../../objects/model'
import { resolveObject } from '../../i18n-content/resolver'

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
 *
 * Phase 5.2: objects are passed through `resolveObject` so the active DESIGN
 * language's translation is displayed. The resolver is pure and returns the
 * ORIGINAL reference when no override applies, so `TextObjectView` needs no
 * change and the common path allocates nothing.
 */
export const CanvasObjectsLayer = memo(function CanvasObjectsLayer({
  onObjectPointerDown,
  onObjectDoubleClick,
  interactive,
}: CanvasObjectsLayerProps) {
  const ids = useCanvasObjects(selectActiveObjectIds)
  const objectsById = useCanvasObjects((s) => s.objectsById)
  const language = useCanvasObjects((s) => s.activeDesignLanguage)
  const sourceLanguage = useCanvasObjects(selectSourceLanguage)
  const variants = useCanvasObjects(selectVariants)

  return (
    <div className="absolute inset-0">
      {ids.map((id) => {
        const raw = objectsById[id]
        if (!raw || !raw.visible) return null
        // Read-only translation resolution — never mutates the original.
        const obj = resolveObject(raw, language, sourceLanguage, variants)
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
        if (obj.kind === 'image') {
          return (
            <ImageObjectView
              key={id}
              object={obj as ImageObject}
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
