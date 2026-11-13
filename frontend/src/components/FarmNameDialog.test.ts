import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { setupApp } from '../test/plugins'
import { query, submitDialog, typeInDialog } from '../test/dom'
import FarmNameDialog from './FarmNameDialog.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountDialog(save: (name: string) => Promise<void>, initialName?: string) {
  const { global } = await setupApp('en')
  wrapper = mount(FarmNameDialog, {
    attachTo: document.body,
    global,
    props: { modelValue: true, title: 'New farm', submitLabel: 'Create a farm', initialName, save },
  })
  await flushPromises()
  return wrapper
}

const input = () => query<HTMLInputElement>('.v-dialog input')

const text = () => document.querySelector('.v-dialog')?.textContent ?? ''

describe('FarmNameDialog', () => {
  it('requires a name', async () => {
    const save = vi.fn(async () => {})
    await mountDialog(save)

    await submitDialog()

    expect(save).not.toHaveBeenCalled()
    expect(text()).toContain('The name is required.')
  })

  it('limits the name to 255 characters', async () => {
    const save = vi.fn(async () => {})
    await mountDialog(save)

    await typeInDialog('a'.repeat(256))
    await submitDialog()

    expect(save).not.toHaveBeenCalled()
    expect(text()).toContain('The name must not exceed 255 characters.')
  })

  it('saves a valid name and closes', async () => {
    const save = vi.fn(async () => {})
    const w = await mountDialog(save, 'Old name')

    expect(input().value).toBe('Old name')
    await typeInDialog('Les Jardins du Lac')
    await submitDialog()

    expect(save).toHaveBeenCalledWith('Les Jardins du Lac')
    expect(w.emitted('update:modelValue')).toEqual([[false]])
  })

  it('stays open and explains a failed save', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const w = await mountDialog(vi.fn(async () => Promise.reject(new Error('disk full'))))

    await typeInDialog('A')
    await submitDialog()

    expect(text()).toContain('Saving failed. Please try again.')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
})
