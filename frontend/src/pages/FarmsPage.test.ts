import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { memoryFarmsApi, type MemoryFarmsApi } from '../test/farms'
import { setupApp } from '../test/plugins'
import FarmsPage from './FarmsPage.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountPage(api: MemoryFarmsApi) {
  const { global, navigation } = await setupApp('en', api)
  navigation.navigate('farms')
  wrapper = mount(FarmsPage, { attachTo: document.body, global })
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

describe('FarmsPage', () => {
  it('has no rename or delete action on the cards', async () => {
    await mountPage(memoryFarmsApi(['A', 'B'], 'farm-1'))

    expect(document.querySelectorAll('[role="listitem"] button')).toHaveLength(1)
  })

  it('creates a farm from the page', async () => {
    await mountPage(memoryFarmsApi(['A']))

    await click('New farm')

    expect(wrapper?.emitted('create')).toHaveLength(1)
  })

  it('opens another farm but not the active one', async () => {
    await mountPage(memoryFarmsApi(['A', 'B'], 'farm-1'))

    expect(() => button('Open “A”')).toThrow()
    await click('Open “B”')

    expect(wrapper?.emitted('select')).toEqual([['farm-2']])
  })

  it('shows the active farm and the other farms in two sections', async () => {
    await mountPage(memoryFarmsApi(['A', 'B', 'C'], 'farm-2'))

    const sections = [...document.querySelectorAll('section')]
    const titles = (section: Element) =>
      [...section.querySelectorAll('[role="listitem"] .v-card-title')].map((title) => title.textContent)
    expect(sections.map((section) => section.querySelector('h2')?.textContent?.trim())).toEqual([
      'Active farm',
      'Other farms',
    ])
    expect(sections.map(titles)).toEqual([['B'], ['A', 'C']])
  })

  it('says no farm is open when none is active', async () => {
    await mountPage(memoryFarmsApi(['A', 'B']))

    const sections = [...document.querySelectorAll('section')]
    expect(sections[0]?.textContent).toContain('No farm is open. Choose one below.')
    expect(sections[0]?.querySelector('[role="listitem"]')).toBeNull()
    expect(sections[1]?.querySelectorAll('[role="listitem"]')).toHaveLength(2)
  })

  it('hides the other farms section when the active farm is the only one', async () => {
    await mountPage(memoryFarmsApi(['A'], 'farm-1'))

    expect(document.querySelectorAll('section')).toHaveLength(1)
  })
})
