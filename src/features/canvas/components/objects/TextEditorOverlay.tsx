import { useEffect, useRef, type CSSProperties } from 'react'
import type { TextObject } from '../../objects/model'
import { getFontFamily } from '../../fonts/config'

interface TextEditorOverlayProps {
  object: TextObject
  /** Commit edited text back to the store. */
  onCommit: (textContent: string) => void
  /** Cancel editing (blur without change is still a commit of current value). */
  onCancel: () => void
}

/**
 * Inline text editor rendered in CANVAS space at the object's rect, so it scales
 * and aligns with the artboard. Uses a contentEditable element — IME input
 * (Telugu, Hindi, Chinese, Japanese, Korean, Arabic, etc.) works natively.
 * Commits on blur or Escape; Enter inserts a newline (Shift+Enter not needed).
 */
export function TextEditorOverlay({ object, onCommit, onCancel }: TextEditorOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.focus()
    // Place caret at end.
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [object.id])

  const style: CSSProperties = {
    position: 'absolute',
    left: object.rect.x,
    top: object.rect.y,
    width: object.rect.width,
    height: object.rect.height,
    transform: object.rotation ? `rotate(${object.rotation}deg)` : undefined,
    transformOrigin: 'center center',
    fontFamily: getFontFamily(object.style.fontFamilyId),
    fontSize: object.style.fontSize,
    color: object.style.color,
    textAlign: object.style.align,
    lineHeight: object.style.lineHeight ?? 1.3,
    letterSpacing: object.style.letterSpacing,
    fontWeight: object.style.fontWeight ?? 'normal',
    fontStyle: object.style.italic ? 'italic' : 'normal',
    display: 'flex',
    alignItems:
      object.style.align === 'center' ? 'center' : object.style.align === 'right' ? 'flex-end' : 'flex-start',
    justifyContent:
      object.style.align === 'center' ? 'center' : object.style.align === 'right' ? 'flex-end' : 'flex-start',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflow: 'hidden',
    outline: '2px solid rgb(168 85 247)',
    outlineOffset: 2,
    borderRadius: 4,
    background: 'rgba(15,23,42,0.6)',
    cursor: 'text',
    zIndex: 50,
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label="Edit text"
      style={style}
      onBlur={(e) => onCommit(e.currentTarget.textContent ?? '')}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        }
        // Enter = newline (default). Let the browser handle IME composition.
        e.stopPropagation()
      }}
    >
      {object.textContent}
    </div>
  )
}
