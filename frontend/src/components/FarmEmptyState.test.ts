import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Locale } from '../i18n/locale'
import { memoryFarmsApi } from '../test/farms'
import { setupApp } from '../test/plugins'
import FarmEmptyState from './FarmEmptyState.vue'

async function mountEmptyState(names: string[] = [], locale: Locale = 'en') {
  const { global } = await setupApp(locale, memoryFarmsApi(names))
  return mount(FarmEmptyState, { global })
}

describe('FarmEmptyState', () => {
  it.each([
    ['fr-FR', 'Créer une exploitation'],
    ['en', 'Create a farm'],
  ] as const)('offers a labelled call to action in %s', async (locale, label) => {
    const w = await mountEmptyState([], locale)

    await w.get('button').trigger('click')

    expect(w.get('button').text()).toBe(label)
    expect(w.emitted('create')).toHaveLength(1)
    expect(w.find('[role="listbox"], .v-list').exists()).toBe(false)
  })

  it('lists existing farms to open one', async () => {
    const w = await mountEmptyState(['A', 'B'])

    expect(w.get('h1').text()).toBe('Choose a farm')
    await w.findAll('.v-list-item')[1]?.trigger('click')

    expect(w.emitted('select')).toEqual([['farm-2']])
    expect(w.get('button').text()).toBe('Create a farm')
  })
})
