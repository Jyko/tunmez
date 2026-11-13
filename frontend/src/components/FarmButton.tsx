import { useEffect, useState } from 'react'
import { Button, SelectPanel, type SelectPanelItemInput } from '@primer/react'
import { LocationIcon, PlusIcon, TriangleDownIcon } from '@primer/octicons-react'
import { useT } from '../i18n/messages'
import { primaryShortcut } from '../keyboard/primaryShortcut'
import { useFarms } from '../state/farms'
import styles from './FarmButton.module.css'

const shortcut = primaryShortcut('o')

interface Props {
  onSelect(id: string): void
  onCreate(): void
}

// Case and accent insensitive, so "etang" finds "Étang".
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase()

// Shows the active farm next to the application name, as GitHub shows the
// current repository, and opens a filterable list to switch farm or create
// one, also with Ctrl/⌘+O.
export default function FarmButton({ onSelect, onCreate }: Props) {
  const t = useT()
  const { farms, active } = useFarms()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (!shortcut.matches(event)) return
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [])

  function changeOpen(next: boolean) {
    setOpen(next)
    if (!next) setFilter('')
  }

  // The active farm stays on top (Primer "current selection" practice), the
  // others keep the API order: most recently used first.
  const ordered = active ? [active, ...farms.filter((farm) => farm.id !== active.id)] : farms
  const items = ordered
    .filter((farm) => fold(farm.name).includes(fold(filter)))
    .map((farm) => ({ id: farm.id, text: farm.name, leadingVisual: LocationIcon }))
  const copy = farms.length ? 'farm.noMatch' : 'farm.empty'
  const selected = items.find((item) => item.id === active?.id)

  const label = active ? active.name : t(farms.length ? 'farm.placeholder.choose' : 'farm.placeholder.none')
  const hint = t('farm.hint', { shortcut: shortcut.label })

  return (
    <SelectPanel
      title={t('farm.switch')}
      placeholderText={t('farm.filter')}
      inputLabel={t('farm.filter')}
      open={open}
      onOpenChange={changeOpen}
      items={items}
      selected={selected}
      onSelectedChange={(item: SelectPanelItemInput | undefined) => {
        // Picking the active farm again only closes the panel.
        if (typeof item?.id === 'string' && item.id !== active?.id) onSelect(item.id)
      }}
      filterValue={filter}
      onFilterChange={setFilter}
      // A message replaces the list, so it is only given for an empty list.
      message={items.length ? undefined : { variant: 'empty', title: t(`${copy}.title`), body: t(`${copy}.text`) }}
      secondaryAction={
        <SelectPanel.SecondaryActionButton
          leadingVisual={PlusIcon}
          onClick={() => {
            changeOpen(false)
            onCreate()
          }}
        >
          {t('farm.new')}
        </SelectPanel.SecondaryActionButton>
      }
      renderAnchor={(anchorProps) => (
        <Button
          {...anchorProps}
          variant="invisible"
          trailingAction={TriangleDownIcon}
          title={active ? `${active.name} · ${hint}` : hint}
          aria-keyshortcuts={shortcut.aria}
        >
          <span className={active ? styles.activeName : styles.name}>{label}</span>
        </Button>
      )}
    />
  )
}
