import { memo, type CSSProperties } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import type { ImageObject } from '../../objects/model'

interface ImageObjectViewProps {
  object: ImageObject
  /** When true, the element is interactive (pointer events on). */
  interactive: boolean
  onPointerDown?: (e: React.PointerEvent) => void
  onDoubleClick?: (e: React.MouseEvent) => void
}

/**
 * Renders a single image object in CANVAS space (inside the scaled Zoom Layer).
 * Geometry is intrinsic pixels; the Zoom Layer's transform scales it.
 */
export const ImageObjectView = memo(function ImageObjectView({
  object,
  interactive,
  onPointerDown,
  onDoubleClick,
}: ImageObjectViewProps) {
  const { rect, rotation, opacity, src, alt, name } = object

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
    transformOrigin: 'center center',
    opacity,
    overflow: 'hidden',
    userSelect: 'none',
    cursor: interactive ? 'move' : 'default',
    pointerEvents: interactive ? 'auto' : 'none',
  }

  return (
    <div
      data-object-id={object.id}
      style={wrapStyle}
      onPointerDown={interactive ? onPointerDown : undefined}
      onDoubleClick={interactive ? onDoubleClick : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Canvas image'}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-dashed border-white/20 bg-white/5 text-foreground-muted">
          <ImageIcon className="h-6 w-6 opacity-40 animate-pulse" />
        </div>
      )}
    </div>
  )
})
