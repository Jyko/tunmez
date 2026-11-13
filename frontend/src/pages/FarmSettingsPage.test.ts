import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { memoryFarmsApi, type MemoryFarmsApi } from '../test/farms'
import { setupApp } from '../test/plugins'
import { query, submitDialog, typeInDialog } from '../test/dom'
import FarmSettingsPage from './FarmSettingsPage.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountPage(api: MemoryFarmsApi) {
  const { global, navigation } = await setupApp('en', api)
  navigation.navigate('farmSettings')
  wrapper = mount(FarmSettingsPage, { attachTo: document.body, global })
  await flushPromises()
  return navigation
}

async function click(label: string) {
  const found = [...document.querySelectorAll<HTMLButtonElement>('button')].find(
    (el) => el.textContent?.trim() === label,
  )
  if (!found) throw new Error(`No button ${label}`)
  found.click()
  await flushPromises()
}

const deleteButton = () => query<HTMLButtonElement>('.v-dialog button[type="submit"]')

describe('FarmSettingsPage', () => {
  it('shows the name of the active farm', async () => {
    await mountPage(memoryFarmsApi(['A', 'B'], 'farm-2'))

    expect(document.querySelector('main, .v-container')?.textContent).toContain('B')
  })

  it('renames the active farm', async () => {
    const api = memoryFarmsApi(['A'], 'farm-1')
    await mountPage(api)

    await click('Rename')
    await typeInDialog('Les Jardins du Lac')
    await submitDialog()

    expect(api.rename).toHaveBeenCalledWith('farm-1', 'Les Jardins du Lac')
    expect(document.body.textContent).toContain('Les Jardins du Lac')
  })

  it('deletes the farm only once its name is typed, then returns home', async () => {
    const api = memoryFarmsApi(['A', 'B'], 'farm-1')
    const navigation = await mountPage(api)

    await click('Delete this farm')
    expect(query('.v-dialog').textContent).toContain('“A” and all its data will be permanently deleted.')
    expect(deleteButton().disabled).toBe(true)

    await typeInDialog('a')
    await submitDialog()
    expect(api.remove).not.toHaveBeenCalled()

    await typeInDialog('A')
    expect(deleteButton().disabled).toBe(false)
    await submitDialog()

    expect(api.remove).toHaveBeenCalledWith('farm-1')
    expect(navigation.current.value).toBe('home')
  })

  it('keeps the farm when deletion is cancelled', async () => {
    const api = memoryFarmsApi(['A'], 'farm-1')
    await mountPage(api)

    await click('Delete this farm')
    await click('Cancel')

    expect(api.remove).not.toHaveBeenCalled()
  })

  it('returns home when no farm is open', async () => {
    const navigation = await mountPage(memoryFarmsApi(['A']))

    expect(navigation.current.value).toBe('home')
  })
})
