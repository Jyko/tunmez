import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { memoryFarmsApi, type MemoryFarmsApi } from '../test/farms'
import { setupApp } from '../test/plugins'
import { typeInDialog } from '../test/dom'
import FarmManagement from './FarmManagement.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountManagement(api: MemoryFarmsApi) {
  const { global } = await setupApp('en', api)
  wrapper = mount(FarmManagement, { attachTo: document.body, global })
  return wrapper
}

function button(label: string): HTMLButtonElement {
  const found = [...document.querySelectorAll<HTMLButtonElement>('button')].find(
    (el) => el.getAttribute('aria-label') === label || el.textContent?.trim() === label,
  )
  if (!found) throw new Error(`No button ${label}`)
  return found
}

async function click(label: string) {
  button(label).click()
  await flushPromises()
}

describe('FarmManagement', () => {
  it('renames a farm', async () => {
    const api = memoryFarmsApi(['A'])
    await mountManagement(api)

    await click('Rename “A”')
    await typeInDialog('B')
    await click('Save')

    expect(api.rename).toHaveBeenCalledWith('farm-1', 'B')
    expect(document.body.textContent).toContain('B')
  })

  it('deletes a farm after confirmation and stays when another is active', async () => {
    const api = memoryFarmsApi(['A', 'B'], 'farm-1')
    const w = await mountManagement(api)

    await click('Delete “B”')
    expect(document.querySelector('.v-dialog')?.textContent).toContain('“B” and all its data will be permanently deleted.')
    expect(api.remove).not.toHaveBeenCalled()
    await click('Delete')

    expect(api.remove).toHaveBeenCalledWith('farm-2')
    expect(w.emitted('back')).toBeUndefined()
  })

  it('returns home after deleting the active farm', async () => {
    const w = await mountManagement(memoryFarmsApi(['A', 'B'], 'farm-1'))

    await click('Delete “A”')
    await click('Delete')

    expect(w.emitted('back')).toHaveLength(1)
  })

  it('keeps the farm when deletion is cancelled', async () => {
    const api = memoryFarmsApi(['A'])
    await mountManagement(api)

    await click('Delete “A”')
    await click('Cancel')

    expect(api.remove).not.toHaveBeenCalled()
  })
})
