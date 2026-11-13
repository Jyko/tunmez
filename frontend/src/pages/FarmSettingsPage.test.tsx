import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { memoryFarmsApi, type MemoryFarmsApi } from '../test/farms'
import { renderWithApp } from '../test/render'
import FarmSettingsPage from './FarmSettingsPage'

const renderPage = (api: MemoryFarmsApi) => renderWithApp(<FarmSettingsPage />, { api, page: 'farmSettings' })

const dialog = () => screen.getByRole('alertdialog')
const deleteButton = () => within(dialog()).getByRole<HTMLButtonElement>('button', { name: 'Delete' })
const current = (history: readonly string[]) => history.at(-1)

describe('FarmSettingsPage', () => {
  it('shows the name of the active farm', async () => {
    await renderPage(memoryFarmsApi(['A', 'B'], 'farm-2'))

    expect(screen.getByText('B')).toBeTruthy()
  })

  it('renames the active farm', async () => {
    const api = memoryFarmsApi(['A'], 'farm-1')
    const { user } = await renderPage(api)

    await user.click(screen.getByRole('button', { name: 'Rename' }))
    const input = within(screen.getByRole('dialog')).getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Les Jardins du Lac')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(api.rename).toHaveBeenCalledWith('farm-1', 'Les Jardins du Lac')
    await waitFor(() => expect(screen.getByText('Les Jardins du Lac')).toBeTruthy())
  })

  it('deletes the farm only once its name is typed, then returns home', async () => {
    const api = memoryFarmsApi(['A', 'B'], 'farm-1')
    const { user, navigation } = await renderPage(api)

    await user.click(screen.getByRole('button', { name: 'Delete this farm' }))
    expect(dialog().textContent).toContain('“A” and all its data will be permanently deleted.')
    expect(deleteButton().getAttribute('aria-disabled') ?? String(deleteButton().disabled)).toBe('true')

    const input = within(dialog()).getByRole('textbox')
    await user.type(input, 'a{Enter}')
    expect(api.remove).not.toHaveBeenCalled()

    await user.clear(input)
    await user.type(input, 'A')
    await user.click(deleteButton())

    expect(api.remove).toHaveBeenCalledWith('farm-1')
    await waitFor(() => expect(current(navigation.history.get())).toBe('home'))
  })

  it('keeps the farm when deletion is cancelled', async () => {
    const api = memoryFarmsApi(['A'], 'farm-1')
    const { user } = await renderPage(api)

    await user.click(screen.getByRole('button', { name: 'Delete this farm' }))
    await user.click(within(dialog()).getByRole('button', { name: 'Cancel' }))

    expect(api.remove).not.toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('returns home when no farm is open', async () => {
    const { navigation } = await renderPage(memoryFarmsApi(['A']))

    expect(current(navigation.history.get())).toBe('home')
  })
})
