import { useState } from 'react'
import {
  Plus,
  Trash2,
  MoreVertical,
  Settings,
  Download,
  Pencil,
  Image as ImageIcon,
  Edit3,
} from 'lucide-react'
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  ColorPicker,
  Slider,
  Switch,
  Badge,
  Chip,
  Tooltip,
  Modal,
  Drawer,
  Tabs,
  Accordion,
  Dropdown,
  Popover,
  ContextMenu,
  Card,
  GlassCard,
  SectionHeader,
  PageHeader,
  LoadingSpinner,
  EmptyState,
} from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
// NOTE: `Toast` component export removed from showcase; ToastProvider is mounted in App.tsx.
import { NAV_ITEMS } from '@/features/navigation/navItems'
import { t, useLanguage } from '@/i18n'

/**
 * Phase 1 developer showcase for the reusable UI primitive library.
 * This is a DEV/QA route only (navigable via /ui-kit) and contains no business logic.
 */
export function UiKitPage() {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [switchOn, setSwitchOn] = useState(true)
  const [sliderVal, setSliderVal] = useState(42)
  const [color, setColor] = useState('#a855f7')
  const [chips, setChips] = useState(['Facebook', 'Instagram', 'LinkedIn'])
  // Subscribe so all showcase labels localize on language switch.
  useLanguage()

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('page.uikit')}
        description={t('page.uikit.desc')}
        actions={
          <Button
            onClick={() => toast('Button clicked — toast works!', 'success')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {t('page.uikit.triggerToast')}
          </Button>
        }
      />

      <section>
        <SectionHeader title={t('page.uikit.buttons')} />
        <div className="flex flex-wrap items-center gap-3">
          <Button>{t('page.uikit.primary')}</Button>
          <Button variant="secondary">{t('page.uikit.secondary')}</Button>
          <Button variant="outline">{t('page.uikit.outline')}</Button>
          <Button variant="ghost">{t('page.uikit.ghost')}</Button>
          <Button variant="danger">{t('page.uikit.danger')}</Button>
          <Button loading>{t('page.uikit.loading')}</Button>
          <Button size="sm">{t('page.uikit.small')}</Button>
          <Button size="lg">{t('page.uikit.large')}</Button>
          <IconButton label={t('page.uikit.edit')} tone="cyan"><Pencil className="h-4 w-4" /></IconButton>
          <IconButton label={t('page.uikit.delete')} tone="rose"><Trash2 className="h-4 w-4" /></IconButton>
          <IconButton label={t('page.uikit.ghost')}><Settings className="h-4 w-4" /></IconButton>
        </div>
      </section>

      <section>
        <SectionHeader title={t('page.uikit.inputs')} />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label={t('page.uikit.name')} placeholder={t('page.uikit.name.ph')} />
          <Select label={t('page.uikit.platform')} options={NAV_ITEMS.map((n) => ({ label: n.label, value: n.id }))} />
          <Textarea label={t('page.uikit.notes')} placeholder={t('page.uikit.notes.ph')} />
          <div className="space-y-5 pt-1">
            <Slider label={t('page.uikit.opacity')} value={sliderVal} onChange={setSliderVal} />
            <ColorPicker label={t('page.uikit.accent')} value={color} onChange={setColor} />
            <Switch checked={switchOn} onChange={setSwitchOn} label={t('page.uikit.enableAutoExport')} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title={t('page.uikit.badges')} />
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="rose">{t('page.uikit.rose')}</Badge>
            <Badge tone="purple">{t('page.uikit.purple')}</Badge>
            <Badge tone="cyan">{t('page.uikit.cyan')}</Badge>
            <Badge tone="success">{t('page.uikit.live')}</Badge>
            <Badge tone="slate">{t('page.uikit.draft')}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c} onRemove={() => setChips((p) => p.filter((x) => x !== c))} active>
                {c}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Tooltip content={t('page.uikit.hover')}>
              <Button variant="outline">{t('page.uikit.hover')}</Button>
            </Tooltip>
            <LoadingSpinner label={t('page.uikit.loading')} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title={t('page.uikit.surfaces')} />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="font-semibold text-foreground">{t('page.uikit.card')}</p>
            <p className="mt-1 text-sm text-foreground-muted">{t('page.uikit.cardDesc')}</p>
          </Card>
          <GlassCard accent="cyan">
            <p className="font-semibold text-foreground">{t('page.uikit.glassCard')}</p>
            <p className="mt-1 text-sm text-foreground-muted">{t('page.uikit.glassCardDesc')}</p>
          </GlassCard>
          <div className="md:col-span-2">
            <EmptyState icon={ImageIcon} title={t('page.assets.empty')} description={t('page.assets.empty.desc')} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title={t('page.uikit.overlays')} />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setModalOpen(true)}>{t('page.uikit.openModal')}</Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>{t('page.uikit.openDrawer')}</Button>
          <Dropdown
            trigger={
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" /> {t('page.uikit.menu')}
              </Button>
            }
            options={[
              { label: t('page.uikit.edit'), value: 'edit', icon: <Edit3 className="h-4 w-4" /> },
              { label: t('page.uikit.download'), value: 'dl', icon: <Download className="h-4 w-4" /> },
              { label: t('page.uikit.delete'), value: 'del', icon: <Trash2 className="h-4 w-4" /> },
            ]}
            onSelect={(v) => toast(`Selected: ${v}`, 'info')}
          />
          <Popover
            trigger={<Button variant="outline">{t('page.uikit.overlays')}</Button>}
          >
            <p className="text-sm text-foreground-secondary">{t('page.uikit.popoverContent')}</p>
          </Popover>
          <ContextMenu
            items={[
              { label: t('page.uikit.edit'), icon: <Edit3 className="h-4 w-4" />, onClick: () => toast('Rename', 'info') },
              { label: t('page.uikit.delete'), icon: <Trash2 className="h-4 w-4" />, danger: true, onClick: () => toast('Deleted', 'error') },
            ]}
          >
            <div className="grid h-20 w-48 place-items-center rounded-xl border border-dashed border-white/15 text-sm text-foreground-muted">
              {t('page.uikit.rightClick')}
            </div>
          </ContextMenu>
        </div>
      </section>

      <section>
        <SectionHeader title={t('page.uikit.tabs')} />
        <Tabs
          tabs={[
            { id: 'a', label: t('page.uikit.tplTab'), content: <p className="text-sm text-foreground-secondary">{t('page.uikit.tplTabDesc')}</p> },
            { id: 'b', label: t('page.uikit.brandTab'), content: <p className="text-sm text-foreground-secondary">{t('page.uikit.brandTabDesc')}</p> },
            { id: 'c', label: t('page.uikit.exportTab'), content: <p className="text-sm text-foreground-secondary">{t('page.uikit.exportTabDesc')}</p> },
          ]}
        />
        <div className="mt-4">
          <Accordion
            items={[
              { id: '1', title: t('page.uikit.accordion1'), content: t('page.uikit.accordion1Body') },
              { id: '2', title: t('page.uikit.accordion2'), content: t('page.uikit.accordion2Body') },
            ]}
          />
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('page.uikit.modal.title')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>{t('user.cancel')}</Button>
            <Button onClick={() => setModalOpen(false)}>{t('page.uikit.confirm')}</Button>
          </>
        }
      >
        <p className="text-sm text-foreground-secondary">{t('page.uikit.modalBody')}</p>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={t('page.uikit.drawer.title')}>
        <p className="text-sm text-foreground-secondary">{t('page.uikit.drawerBody')}</p>
      </Drawer>
    </div>
  )
}
