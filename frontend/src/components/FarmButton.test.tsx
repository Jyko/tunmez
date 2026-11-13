import { describe, expect, it, vi } from 'vitest'
import { act, screen, within } from '@testing-library/react'
import { memoryFarmsApi } from '../test/farms'
import { renderWithApp } from '../test/render'
import FarmButton from './FarmButton'

async function renderButton(names: string[] = [], activeId = '') {
  const onSelect = vi.fn()
  const onCreate = vi.fn()
  const result = await renderWithApp(
    <FarmButton
      onSelect={onSelect}
      onCreate={onCreate}
    />,
    { api: memoryFarmsApi(names, activeId) },
  )
  return { ...result, onSelect, onCreate }
}

const trigger = () => screen.getByRole('button', { expanded: false })
const options = () => screen.getAllByRole('option').map((option) => option.textContent)

describe('FarmButton', () => {
  it.each([
    [['Les Jardins du Lac'], 'farm-1', 'Les Jardins du Lac'],
    [['A'], '', 'Choose a farm'],
    [[], '', 'No farms'],
  ])('shows %j with active %j as %j', async (names, activeId, label) => {
    await renderButton(names, activeId)

    expect(trigger().textContent).toBe(label)
    expect(trigger().getAttribute('aria-haspopup')).toBe('true')
  })

  it('lists the active farm first, then the others most recently used first', async () => {
    const { user } = await renderButton(['A', 'B', 'C'], 'farm-2')

    await user.click(trigger())

    expect(options()).toEqual(['B', 'A', 'C'])
    expect(screen.getByRole('option', { name: 'B' }).getAttribute('aria-selected')).toBe('true')
  })

  it('filters farms by name, ignoring case and accents', async () => {
    const { user } = await renderButton(['Les Jardins du Lac', 'Ferme de l’Étang', 'Potager'], 'farm-1')

    await user.click(trigger())
    await user.type(screen.getByRole('combobox'), 'etang')

    expect(options()).toEqual(['Ferme de l’Étang'])
  })

  it('says when no farm matches the filter', async () => {
    const { user } = await renderButton(['A'], 'farm-1')

    await user.click(trigger())
    await user.type(screen.getByRole('combobox'), 'zzz')

    expect(screen.getByText('No matching farm')).toBeTruthy()
  })

  it('opens another farm and closes', async () => {
    const { user, onSelect } = await renderButton(['A', 'B'], 'farm-1')

    await user.click(trigger())
    await user.click(screen.getByRole('option', { name: 'B' }))

    expect(onSelect).toHaveBeenCalledWith('farm-2')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('closes without reopening the active farm', async () => {
    const { user, onSelect } = await renderButton(['A', 'B'], 'farm-1')

    await user.click(trigger())
    await user.click(screen.getByRole('option', { name: 'A' }))

    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('creates a farm from the panel footer, even without farms', async () => {
    const { user, onCreate } = await renderButton()

    await user.click(trigger())
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('No farms yet')).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: 'New farm' }))

    expect(onCreate).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens with Ctrl+O', async () => {
    await renderButton(['A'], 'farm-1')
    expect(trigger().getAttribute('aria-keyshortcuts')).toBe('Control+O')

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o', ctrlKey: true }))
    })

    expect(screen.getByRole('listbox')).toBeTruthy()
  })
})
