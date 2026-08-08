import { useEffect, useRef, type CSSProperties } from 'react'
import type { TextObject } from '../../objects/model'
import { getFontFamily } from '../../fonts/config'

interface TextEditorOverlayProps {
  object: TextObject
  /** Commit edited text back to the store. */
  onCommit: (textContent: string) => void
  /** Cancel editing (exit mode, keep object selected). */
  onCancel: () => void
}

/**
 * Inline text editor rendered in CANVAS space at the object's rect, so it scales
 * and aligns with the artboard. Uses a contentEditable element — IME input
 * (Telugu, Hindi, Chinese, Japanese, Korean, Arabic, etc.) works natively.
 *
 * Commit strategy (the important part): text is committed on blur AND on unmount.
 * Unmount-commit is required because exiting via Escape (or clicking away / other
 * deselect) removes the element WITHOUT firing onBlur — without it, typed text
 * would be silently discarded. Both paths are idempotent (same store write).
 */
export function TextEditorOverlay({ object, onCommit, onCancel }: TextEditorOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const textRef = useRef(object.textContent)
  const onCommitRef = useRef(onCommit)
  const onCancelRef = useRef(onCancel)
  onCommitRef.current = onCommit
  onCancelRef.current = onCancel

  // Focus + place caret on mount. Commit latest text on unmount (Escape / click-away / deselect).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    return () => {
      onCommitRef.current(textRef.current)
    }
    // Re-run only when the edited object changes, never on every keystroke.
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
      onInput={(e) => {
        textRef.current = e.currentTarget.textContent ?? ''
      }}
      onBlur={(e) => onCommitRef.current(e.currentTarget.textContent ?? '')}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancelRef.current()
          return
        }
        // Enter = newline (default). Let the browser handle IME composition.
        e.stopPropagation()
      }}
    >
      {object.textContent}
    </div>
  )
}
