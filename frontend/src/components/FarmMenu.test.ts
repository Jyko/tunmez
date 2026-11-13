import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { memoryFarmsApi } from '../test/farms'
import { setupApp } from '../test/plugins'
import FarmMenu from './FarmMenu.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountMenu(names: string[] = [], activeId = '') {
  const { global } = await setupApp('en', memoryFarmsApi(names, activeId))
  wrapper = mount(FarmMenu, { attachTo: document.body, global })
  return wrapper
}

function items(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('#farm-menu-list .v-list-item')]
}

function item(title: string): HTMLElement {
  const found = items().find((el) => el.textContent?.trim() === title)
  if (!found) throw new Error(`No menu item ${title}`)
  return found
}

async function open(w: VueWrapper) {
  await w.get('button').trigger('click')
  await flushPromises()
}

describe('FarmMenu', () => {
  it('shows the active farm name', async () => {
    const w = await mountMenu(['Les Jardins du Lac'], 'farm-1')

    expect(w.get('button').text()).toBe('Les Jardins du Lac')
    expect(w.get('button').attributes('aria-keyshortcuts')).toBe('Control+O')
  })

  it('shows a generic label without an active farm', async () => {
    const w = await mountMenu(['A'])

    expect(w.get('button').text()).toBe('Farms')
  })

  it('lists the farms and marks the active one', async () => {
    const w = await mountMenu(['B', 'A'], 'farm-2')
    await open(w)

    expect(items().map((el) => el.textContent?.trim())).toEqual(['B', 'A', 'New farm', 'Manage farms'])
    expect(item('A').getAttribute('aria-current')).toBe('true')
    expect(item('B').hasAttribute('aria-current')).toBe(false)
  })

  it('emits the chosen action', async () => {
    const w = await mountMenu(['A'])

    for (const title of ['A', 'New farm', 'Manage farms']) {
      await open(w)
      item(title).click()
      await flushPromises()
    }

    expect(w.emitted('select')).toEqual([['farm-1']])
    expect(w.emitted('create')).toHaveLength(1)
    expect(w.emitted('manage')).toHaveLength(1)
  })

  it('opens with Ctrl+O', async () => {
    await mountMenu(['A'])

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o', ctrlKey: true }))
    await flushPromises()

    expect(items()).toHaveLength(3)
  })
})
