import { useMemo, useRef, useState, useEffect } from 'react'
import { getTemplateIcon } from '../models/config'
import { TONE_GRADIENT } from '../utils/templateMeta'
import { getTemplateLayout } from '../engine/instantiator'
import { getFontFamily } from '@/features/canvas/fonts/config'
import type { Template } from '../types/template'
import type { TemplateElement, TemplateImageElement } from '../engine/types'

interface TemplateThumbnailProps {
  template: Template
  /** Override the aspect ratio (width/height) for a standardized card thumbnail. */
  fixedRatio?: number
  className?: string
}

/**
 * Visual template preview component (Phase 5.7).
 *
 * Renders the actual canvas layout elements with intelligent thumbnail scaling:
 * 1. Preserves the exact template aspect ratio and artboard geometry.
 * 2. Frames wide (1.91:1), square (1:1), and tall (9:16/2:3/4:5) layouts cleanly
 *    on a sleek stage when a fixed card ratio is requested.
 * 3. Enforces legible thumbnail typography so text hierarchy, kickers, headlines,
 *    subheadlines, and CTA buttons remain razor-sharp and readable at card size.
 * 4. Respects all design colors, tone gradients, alignments, and font families.
 */
export function TemplateThumbnail({ template, fixedRatio, className }: TemplateThumbnailProps) {
  const artboardRef = useRef<HTMLDivElement>(null)
  const [artboardSize, setArtboardSize] = useState({ width: 0, height: 0 })

  const layout = useMemo(() => getTemplateLayout(template), [template])
  const templateRatio = layout.width / layout.height

  useEffect(() => {
    const el = artboardRef.current
    if (!el) return
    const update = () => {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        setArtboardSize({
          width: Math.round(el.clientWidth),
          height: Math.round(el.clientHeight),
        })
      }
    }
    update()
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setArtboardSize({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          })
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Classify elements into semantic hierarchy: Tag (kicker) -> Headline -> Subheadline -> CTA
  const { tagEl, headlineEl, subheadlineEl, ctaEl, imageEls } = useMemo(() => {
    let tag: TemplateElement | undefined
    let headline: TemplateElement | undefined
    let subheadline: TemplateElement | undefined
    let cta: TemplateElement | undefined
    const images: TemplateImageElement[] = []

    for (const el of layout.elements) {
      if (el.kind === 'image') {
        images.push(el)
        continue
      }
      const name = (el.name || '').toLowerCase()
      if (!tag && (name.includes('tag') || name.includes('category') || name.includes('kicker'))) {
        tag = el
      } else if (!headline && (name.includes('headline') || name.includes('title'))) {
        headline = el
      } else if (!cta && (name.includes('action') || name.includes('cta') || name.includes('button'))) {
        cta = el
      } else if (!subheadline && (name.includes('sub') || name.includes('desc'))) {
        subheadline = el
      }
    }

    // Fallback: If names didn't match, map by vertical position
    if (!tag && !headline && !subheadline && !cta) {
      const textEls = layout.elements.filter((e) => e.kind === 'text')
      tag = textEls[0]
      headline = textEls[1]
      subheadline = textEls[2]
      cta = textEls[3]
    }

    return {
      tagEl: tag,
      headlineEl: headline,
      subheadlineEl: subheadline,
      ctaEl: cta,
      imageEls: images,
    }
  }, [layout.elements])

  // Responsive dimensions & scale calculation
  const currentW = artboardSize.width > 0 ? artboardSize.width : 250
  const currentH = artboardSize.height > 0 ? artboardSize.height : Math.round(250 / templateRatio)
  const isCompact = currentH < 85 || currentW < 140
  const isWide = templateRatio >= 1.5

  // Normalize scale across aspect ratios using geometric mean / effective dimension
  // This ensures portrait (9:16), square (1:1), and wide (1.91:1) have balanced visual scale
  const effectiveDim = Math.sqrt(currentW * currentH)
  const scaleFactor = Math.max(0.75, Math.min(2.0, effectiveDim / 185))

  // Legible typography scaling
  const tagFontSize = Math.max(8.5, Math.round(9 * scaleFactor))
  // Headline font scaling: short headlines (<=22 chars) scale up for prominence; longer wrap gracefully
  const headlineCharCount = headlineEl?.kind === 'text' ? (headlineEl.textContent || '').length : 30
  const headlineBase = headlineCharCount <= 22 ? 16.5 : headlineCharCount <= 38 ? 15 : 14
  const headlineFontSize = Math.max(12.5, Math.round(headlineBase * scaleFactor))
  const subheadlineFontSize = Math.max(9, Math.round(10 * scaleFactor))
  const ctaFontSize = Math.max(8.5, Math.round(9.5 * scaleFactor))
  const ctaHeight = isCompact ? 18 : Math.max(22, Math.round(26 * scaleFactor))

  // Alignment
  const textAlign = headlineEl?.kind === 'text' ? headlineEl.style.align || 'left' : 'left'
  const isCentered = textAlign === 'center'
  const isRight = textAlign === 'right'
  const alignClass = isCentered
    ? 'items-center text-center'
    : isRight
    ? 'items-end text-right'
    : 'items-start text-left'
  const buttonSelfAlign = isCentered ? 'self-center' : isRight ? 'self-end' : 'self-start'

  // Proportional artboard padding preserving canvas start position
  const firstY = tagEl?.kind === 'text' ? tagEl.rect.y : headlineEl?.kind === 'text' ? headlineEl.rect.y : 100
  const canvasTopRatio = Math.min(0.2, Math.max(0.08, firstY / layout.height))
  const padX = Math.max(10, Math.round(currentW * (isWide ? 0.065 : 0.08)))
  const padY = Math.max(8, Math.round(currentH * canvasTopRatio))

  // CTA Button Contrast
  const ctaTextColor = ctaEl?.kind === 'text' ? ctaEl.style.color : '#071526'
  const isDarkCta = ctaTextColor
    ? ctaTextColor.startsWith('#0') ||
      ctaTextColor.startsWith('#1') ||
      ctaTextColor.startsWith('#2') ||
      ctaTextColor === '#000000' ||
      ctaTextColor === '#090d16'
    : true
  const ctaBg = isDarkCta ? '#ffffff' : 'rgba(255,255,255,0.2)'
  const ctaBorder = isDarkCta ? 'border-transparent' : 'border border-white/30'

  const Icon = getTemplateIcon(template.icon)

  // Content block rendered within the Artboard
  const artboardContent = (
    <>
      {/* Background radial/linear tone glow matching template */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${TONE_GRADIENT[template.tone]} opacity-25 pointer-events-none`}
      />

      {/* Embedded Images (if any) */}
      {imageEls.map((img, idx) => (
        <div key={idx} className="absolute inset-0 overflow-hidden pointer-events-none">
          {img.src ? (
            <img src={img.src} alt={img.alt || img.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-white/10" />
          )}
        </div>
      ))}

      {/* Content flex layer with canvas design hierarchy */}
      <div
        className={`relative z-10 flex h-full w-full flex-col ${alignClass}`}
        style={{
          paddingLeft: `${padX}px`,
          paddingRight: `${padX}px`,
          paddingTop: `${padY}px`,
          paddingBottom: `${padY}px`,
        }}
      >
        {/* Tag + Headline + Subheadline + CTA Button in sequence */}
        <div className={`flex flex-col ${alignClass} min-w-0 w-full`}>
          {/* Category Tag */}
          {tagEl && tagEl.kind === 'text' && (
            <div
              className="font-bold uppercase tracking-wider line-clamp-1 select-none"
              style={{
                fontFamily: getFontFamily(tagEl.style.fontFamilyId),
                fontSize: `${tagFontSize}px`,
                color: tagEl.style.color,
                letterSpacing: `${Math.max(1, Math.round(1.5 * scaleFactor))}px`,
                marginBottom: `${Math.max(2, Math.round(3 * scaleFactor))}px`,
              }}
            >
              {tagEl.textContent}
            </div>
          )}

          {/* Main Headline */}
          {headlineEl && headlineEl.kind === 'text' && (
            <div
              className={`font-bold select-none ${isWide ? 'line-clamp-2' : 'line-clamp-3'}`}
              style={{
                fontFamily: getFontFamily(headlineEl.style.fontFamilyId),
                fontSize: `${headlineFontSize}px`,
                color: headlineEl.style.color || '#ffffff',
                lineHeight: headlineEl.style.lineHeight || 1.18,
                marginBottom: `${Math.max(3, Math.round(4 * scaleFactor))}px`,
              }}
            >
              {headlineEl.textContent}
            </div>
          )}

          {/* Subheadline (hidden in ultra-compact list view) */}
          {subheadlineEl && subheadlineEl.kind === 'text' && !isCompact && (
            <div
              className={`select-none text-foreground/75 ${isWide ? 'line-clamp-1' : 'line-clamp-2'}`}
              style={{
                fontFamily: getFontFamily(subheadlineEl.style.fontFamilyId),
                fontSize: `${subheadlineFontSize}px`,
                color: subheadlineEl.style.color || '#94a3b8',
                lineHeight: subheadlineEl.style.lineHeight || 1.3,
                marginBottom: `${Math.max(4, Math.round(6 * scaleFactor))}px`,
              }}
            >
              {subheadlineEl.textContent}
            </div>
          )}

          {/* Call to Action Button - positioned in sequence directly after subheadline as on Canvas */}
          {ctaEl && ctaEl.kind === 'text' && (
            <div
              className={`inline-flex items-center justify-center font-bold shadow-md select-none shrink-0 ${buttonSelfAlign} ${ctaBorder}`}
              style={{
                fontFamily: getFontFamily(ctaEl.style.fontFamilyId),
                fontSize: `${ctaFontSize}px`,
                color: ctaTextColor,
                backgroundColor: ctaBg,
                height: `${ctaHeight}px`,
                paddingLeft: `${Math.max(8, Math.round(12 * scaleFactor))}px`,
                paddingRight: `${Math.max(8, Math.round(12 * scaleFactor))}px`,
                borderRadius: `${Math.max(4, Math.round(6 * scaleFactor))}px`,
                letterSpacing: '0.5px',
                marginTop: `${Math.max(4, Math.round(6 * scaleFactor))}px`,
              }}
            >
              {ctaEl.textContent}
            </div>
          )}
        </div>
      </div>

      {/* Subtle corner watermark icon */}
      {!isCompact && (
        <div className="absolute right-2.5 bottom-2.5 pointer-events-none opacity-20">
          <Icon className="h-5 w-5 text-white" />
        </div>
      )}
    </>
  )

  // Case 1: Fixed aspect ratio provided (Standardized card preview in Grid or List view)
  if (fixedRatio != null) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#0e1424] to-[#070913] ${className ?? ''}`}
        style={{ aspectRatio: String(fixedRatio) }}
      >
        {/* Stage ambient tone glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${TONE_GRADIENT[template.tone]} opacity-15 pointer-events-none`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

        {/* Viewport centering the artboard with balanced stage padding */}
        <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-2.5">
          <div
            ref={artboardRef}
            className="relative flex flex-col justify-between overflow-hidden rounded-lg border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.55)] select-none transition-transform group-hover:scale-[1.01]"
            style={{
              aspectRatio: String(templateRatio),
              maxWidth: '100%',
              maxHeight: '100%',
              backgroundColor: layout.background,
            }}
          >
            {artboardContent}
          </div>
        </div>
      </div>
    )
  }

  // Case 2: Natural aspect ratio (Modal detailed preview, recent templates strip)
  return (
    <div
      ref={artboardRef}
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/15 shadow-xl select-none ${className ?? ''}`}
      style={{
        aspectRatio: String(templateRatio),
        backgroundColor: layout.background,
      }}
    >
      {artboardContent}
    </div>
  )
}
