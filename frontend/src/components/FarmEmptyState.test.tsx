import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type { Locale } from '../i18n/locale'
import { memoryFarmsApi } from '../test/farms'
import { renderWithApp } from '../test/render'
import FarmEmptyState from './FarmEmptyState'

async function renderEmptyState(names: string[] = [], locale: Locale = 'en') {
  const onSelect = vi.fn()
  const onCreate = vi.fn()
  const result = await renderWithApp(<FarmEmptyState onSelect={onSelect} onCreate={onCreate} />, {
    locale,
    api: memoryFarmsApi(names),
  })
  return { ...result, onSelect, onCreate }
}

describe('FarmEmptyState', () => {
  it.each([
    ['fr-FR', 'Créer une ferme'],
    ['en', 'Create a farm'],
  ] as const)('offers a labelled call to action in %s', async (locale, label) => {
    const { user, onCreate } = await renderEmptyState([], locale)

    await user.click(screen.getByRole('button', { name: label }))

    expect(onCreate).toHaveBeenCalledOnce()
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('lists existing farms to open one', async () => {
    const { user, onSelect } = await renderEmptyState(['A', 'B'])

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Choose a farm')
    await user.click(screen.getByText('B'))

    expect(onSelect).toHaveBeenCalledWith('farm-2')
    expect(screen.getByRole('button', { name: 'Create a farm' })).toBeTruthy()
  })
})
