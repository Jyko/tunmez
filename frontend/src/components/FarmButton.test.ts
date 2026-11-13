import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { memoryFarmsApi } from '../test/farms'
import { setupApp } from '../test/plugins'
import FarmButton from './FarmButton.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
})

async function mountButton(names: string[] = [], activeId = '') {
  const { global, navigation } = await setupApp('en', memoryFarmsApi(names, activeId))
  wrapper = mount(FarmButton, { global })
  return { wrapper, navigation }
}

describe('FarmButton', () => {
  it.each([
    [['Les Jardins du Lac'], 'farm-1', 'Les Jardins du Lac'],
    [['A'], '', 'Choose a farm'],
    [[], '', 'No farms'],
  ])('shows %j with active %j as %j', async (names, activeId, label) => {
    const { wrapper } = await mountButton(names, activeId)

    expect(wrapper.get('button').text()).toBe(label)
  })

  it('opens the farms page, even without farms', async () => {
    const { wrapper, navigation } = await mountButton()

    await wrapper.get('button').trigger('click')

    expect(navigation.current.value).toBe('farms')
    expect(wrapper.get('button').attributes('aria-current')).toBe('page')
  })

  it('opens the farms page with Ctrl+O', async () => {
    const { wrapper, navigation } = await mountButton(['A'], 'farm-1')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o', ctrlKey: true }))
    await flushPromises()

    expect(navigation.current.value).toBe('farms')
    expect(wrapper.get('button').attributes('aria-keyshortcuts')).toBe('Control+O')
  })
})
