import { SlidersHorizontal, MousePointerClick, Lock, Unlock } from 'lucide-react'
import { Input, Select, Slider, ColorPicker } from '@/components/ui'
import { useCanvasObjects } from '../objects/store'
import { FONT_CONFIG } from '../fonts/config'
import type { TextObject, ImageObject, CanvasRect } from '../objects/model'
import { t, useLanguage } from '@/i18n'
import { cn } from '@/utils/cn'

const fontOptions = FONT_CONFIG.map((f) => ({ label: f.label, value: f.id }))

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-foreground-muted">{label}</span>
      {children}
    </label>
  )
}

function NumberInput({
  value,
  onChange,
  disabled,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
  step?: number
}) {
  return (
    <Input
      type="number"
      value={String(Math.round(value))}
      step={step}
      disabled={disabled}
      onChange={(e) => {
        const n = Number(e.target.value)
        if (!Number.isNaN(n)) onChange(n)
      }}
      className="w-full"
    />
  )
}

/**
 * Right-hand properties panel.
 * Shows a placeholder when nothing is selected, and LIVE controls bound to the
 * selected text object (X, Y, W, H, Rotation, Font Size, Font Family, Color,
 * Opacity). Edits write straight to the centralized store.
 */
export function RightPropertiesPanel() {
  const selectedId = useCanvasObjects((s) => s.selectedObjectId)
  const object = useCanvasObjects((s) => (selectedId ? s.objectsById[selectedId] : null))
  const update = useCanvasObjects((s) => s.updateObject)
  const setObjectLocked = useCanvasObjects((s) => s.setObjectLocked)
  // Subscribe to language so all property labels re-render on switch.
  useLanguage()

  const isText = object && object.kind === 'text'
  const isImage = object && object.kind === 'image'
  const textObj = isText ? (object as TextObject) : null
  const imgObj = isImage ? (object as ImageObject) : null

  const header = (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-brand-purple" />
        <h2 className="text-sm font-semibold text-foreground">{t('props.title')}</h2>
      </div>
      {object && (
        <button
          type="button"
          onClick={() => setObjectLocked(object.id, !object.locked)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition',
            object.locked
              ? 'border border-amber-500/40 bg-amber-500/20 text-amber-300'
              : 'border border-white/10 bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground',
          )}
          title={object.locked ? 'Unlock object' : 'Lock object'}
        >
          {object.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          <span>{object.locked ? 'Locked' : 'Lock'}</span>
        </button>
      )}
    </div>
  )

  if (!object || (!isText && !isImage)) {
    return (
      <aside className="hidden w-72 shrink-0 flex-col border-l border-white/10 bg-surface/40 lg:flex">
        {header}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-foreground-muted">
            <MousePointerClick className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t('props.none')}</p>
            <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-foreground-muted">
              {t('props.none.hint')}
            </p>
          </div>
          <ul className="max-w-[15rem] space-y-1.5 text-left text-xs text-foreground-muted">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-purple" />
              {t('props.bullet.position')}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-rose" />
              {t('props.bullet.typography')}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-cyan" />
              {t('props.bullet.alignment')}
            </li>
          </ul>
        </div>
      </aside>
    )
  }

  const setRect = (patch: Partial<CanvasRect>) =>
    update(object.id, { rect: { ...object.rect, ...patch } })

  if (imgObj) {
    return (
      <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-surface/40 lg:flex">
        {header}
        <fieldset disabled={imgObj.locked} className={cn('flex flex-col gap-4 p-4', imgObj.locked && 'opacity-60')}>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('props.x')}>
              <NumberInput value={imgObj.rect.x} disabled={imgObj.locked} onChange={(v) => setRect({ x: v })} />
            </Field>
            <Field label={t('props.y')}>
              <NumberInput value={imgObj.rect.y} disabled={imgObj.locked} onChange={(v) => setRect({ y: v })} />
            </Field>
            <Field label={t('props.width')}>
              <NumberInput value={imgObj.rect.width} disabled={imgObj.locked} onChange={(v) => setRect({ width: Math.max(16, v) })} />
            </Field>
            <Field label={t('props.height')}>
              <NumberInput value={imgObj.rect.height} disabled={imgObj.locked} onChange={(v) => setRect({ height: Math.max(16, v) })} />
            </Field>
          </div>

          <Field label={t('props.rotation')}>
            <Slider
              min={-180}
              max={180}
              value={imgObj.rotation}
              disabled={imgObj.locked}
              onChange={(v) => update(imgObj.id, { rotation: v })}
            />
          </Field>

          <Field label={t('props.opacity', { pct: Math.round(imgObj.opacity * 100) })}>
            <Slider
              min={0}
              max={100}
              value={Math.round(imgObj.opacity * 100)}
              disabled={imgObj.locked}
              onChange={(v) => update(imgObj.id, { opacity: v / 100 })}
            />
          </Field>

          <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] font-medium text-foreground-muted">Natural Resolution</p>
            <p className="mt-0.5 font-mono text-xs font-semibold text-brand-cyan">
              {imgObj.naturalWidth} × {imgObj.naturalHeight} px
            </p>
          </div>
        </fieldset>
      </aside>
    )
  }

  const setStyle = (patch: Partial<TextObject['style']>) => update(textObj!.id, { style: patch })

  return (
    <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-surface/40 lg:flex">
      {header}
      <fieldset disabled={textObj!.locked} className={cn('flex flex-col gap-4 p-4', textObj!.locked && 'opacity-60')}>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('props.x')}>
            <NumberInput value={textObj!.rect.x} disabled={textObj!.locked} onChange={(v) => setRect({ x: v })} />
          </Field>
          <Field label={t('props.y')}>
            <NumberInput value={textObj!.rect.y} disabled={textObj!.locked} onChange={(v) => setRect({ y: v })} />
          </Field>
          <Field label={t('props.width')}>
            <NumberInput value={textObj!.rect.width} disabled={textObj!.locked} onChange={(v) => setRect({ width: Math.max(24, v) })} />
          </Field>
          <Field label={t('props.height')}>
            <NumberInput value={textObj!.rect.height} disabled={textObj!.locked} onChange={(v) => setRect({ height: Math.max(24, v) })} />
          </Field>
        </div>

        <Field label={t('props.rotation')}>
          <Slider
            min={-180}
            max={180}
            value={textObj!.rotation}
            disabled={textObj!.locked}
            onChange={(v) => update(textObj!.id, { rotation: v })}
          />
        </Field>

        <Field label={t('props.fontSize')}>
          <NumberInput value={textObj!.style.fontSize} disabled={textObj!.locked} onChange={(v) => setStyle({ fontSize: Math.max(1, v) })} />
        </Field>

        <Field label={t('props.fontFamily')}>
          <Select
            value={textObj!.style.fontFamilyId}
            options={fontOptions}
            disabled={textObj!.locked}
            onChange={(e) => setStyle({ fontFamilyId: e.target.value })}
          />
        </Field>

        <Field label={t('props.align')}>
          <Select
            value={textObj!.style.align}
            options={[
              { label: t('props.align.left'), value: 'left' },
              { label: t('props.align.center'), value: 'center' },
              { label: t('props.align.right'), value: 'right' },
            ]}
            disabled={textObj!.locked}
            onChange={(e) => setStyle({ align: e.target.value as TextObject['style']['align'] })}
          />
        </Field>

        <Field label={t('props.color')}>
          <ColorPicker value={textObj!.style.color} onChange={(v) => setStyle({ color: v })} />
        </Field>

        <Field label={t('props.opacity', { pct: Math.round(textObj!.opacity * 100) })}>
          <Slider
            min={0}
            max={100}
            value={Math.round(textObj!.opacity * 100)}
            disabled={textObj!.locked}
            onChange={(v) => update(textObj!.id, { opacity: v / 100 })}
          />
        </Field>
      </fieldset>
    </aside>
  )
}
