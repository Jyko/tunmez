import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithApp } from '../test/render'
import FarmNameDialog from './FarmNameDialog'

async function renderDialog(save: (name: string) => Promise<void>, initialName?: string) {
  const onClose = vi.fn()
  const result = await renderWithApp(
    <FarmNameDialog open onClose={onClose} title="New farm" submitLabel="Create a farm" initialName={initialName} save={save} />,
  )
  return { ...result, onClose }
}

const dialog = () => screen.getByRole('dialog')
const input = () => within(dialog()).getByRole<HTMLInputElement>('textbox', { name: /Farm name/ })
const submit = () => within(dialog()).getByRole('button', { name: 'Create a farm' })

describe('FarmNameDialog', () => {
  it('requires a name', async () => {
    const save = vi.fn(async () => {})
    const { user } = await renderDialog(save)

    await user.click(submit())

    expect(save).not.toHaveBeenCalled()
    expect(dialog().textContent).toContain('The name is required.')
  })

  it('limits the name to 255 characters', async () => {
    const save = vi.fn(async () => {})
    const { user } = await renderDialog(save)

    await user.click(input())
    await user.paste('a'.repeat(256))
    await user.click(submit())

    expect(save).not.toHaveBeenCalled()
    expect(dialog().textContent).toContain('The name must not exceed 255 characters.')
    expect(dialog().textContent).toContain('256 / 255')
  })

  it('saves a valid name and closes', async () => {
    const save = vi.fn(async () => {})
    const { user, onClose } = await renderDialog(save, 'Old name')

    expect(input().value).toBe('Old name')
    await user.clear(input())
    await user.type(input(), 'Les Jardins du Lac')
    await user.click(submit())

    expect(save).toHaveBeenCalledWith('Les Jardins du Lac')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('stays open and explains a failed save', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { user, onClose } = await renderDialog(vi.fn(async () => Promise.reject(new Error('disk full'))))

    await user.type(input(), 'A')
    await user.click(submit())

    expect(dialog().textContent).toContain('Saving failed. Please try again.')
    expect(onClose).not.toHaveBeenCalled()
  })
})
