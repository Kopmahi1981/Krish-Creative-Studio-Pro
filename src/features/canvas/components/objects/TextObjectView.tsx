import { memo, type CSSProperties } from 'react'
import type { TextObject } from '../../objects/model'
import { getFontFamily } from '../../fonts/config'

interface TextObjectViewProps {
  object: TextObject
  /** When true, the element is interactive (pointer events on). */
  interactive: boolean
  onPointerDown?: (e: React.PointerEvent) => void
  onDoubleClick?: (e: React.MouseEvent) => void
}

/**
 * Renders a single text object in CANVAS space (inside the scaled Zoom Layer).
 * Geometry is intrinsic pixels; the Zoom Layer's transform scales it.
 *
 * Unicode-first: the text is rendered verbatim with a configurable, Unicode
 * fallback font stack — never Latin-assumed. IME input works naturally because
 * editing uses a real editable element (see TextEditorOverlay).
 */
export const TextObjectView = memo(function TextObjectView({
  object,
  interactive,
  onPointerDown,
  onDoubleClick,
}: TextObjectViewProps) {
  const { rect, rotation, opacity, style, textContent } = object

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
    transformOrigin: 'center center',
    opacity,
    fontFamily: getFontFamily(style.fontFamilyId),
    fontSize: style.fontSize,
    color: style.color,
    textAlign: style.align,
    lineHeight: style.lineHeight ?? 1.3,
    letterSpacing: style.letterSpacing,
    fontWeight: style.fontWeight ?? 'normal',
    fontStyle: style.italic ? 'italic' : 'normal',
    textDecoration: style.underline ? 'underline' : style.strikethrough ? 'line-through' : undefined,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent:
      style.align === 'center' ? 'center' : style.align === 'right' ? 'flex-end' : 'flex-start',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflow: 'hidden',
    userSelect: interactive ? 'none' : 'text',
    cursor: interactive ? 'move' : 'text',
    pointerEvents: interactive ? 'auto' : 'none',
    // Direction: RTL when flagged (future); default LTR.
    direction: style.rtl ? 'rtl' : 'ltr',
  }

  return (
    <div
      data-object-id={object.id}
      style={wrapStyle}
      onPointerDown={interactive ? onPointerDown : undefined}
      onDoubleClick={interactive ? onDoubleClick : undefined}
    >
      {textContent}
    </div>
  )
})
