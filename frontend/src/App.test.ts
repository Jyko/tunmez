import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import App from './App.vue'
import type { Locale } from './i18n/locale'
import { memoryFarmsApi } from './test/farms'
import { setupApp } from './test/plugins'
import { submitDialog, typeInDialog } from './test/dom'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountApp(locale: Locale = 'en', names: string[] = [], activeId = '', invalidConfig = '') {
  const { global } = await setupApp(locale, memoryFarmsApi(names, activeId), { invalidConfig })
  wrapper = mount(App, { attachTo: document.body, global })
  return wrapper
}

describe('App', () => {
  it.each([
    ['fr-FR', "Planificateur d'assolement"],
    ['en', 'Crop rotation planner'],
  ] as const)('shows the tagline in %s', async (locale, tagline) => {
    expect((await mountApp(locale)).text()).toContain(tagline)
  })

  it.each([
    ['fr-FR', 'Réglages'],
    ['en', 'Settings'],
  ] as const)('shows a labelled settings button in %s', async (locale, label) => {
    expect((await mountApp(locale)).find(`button[aria-label="${label}"]`).exists()).toBe(true)
  })

  it('shows the empty state without an active farm', async () => {
    const w = await mountApp('en')

    expect(w.get('main h1').text()).toBe('No farms yet')
  })

  it('opens the last used farm', async () => {
    const w = await mountApp('en', ['Les Jardins du Lac'], 'farm-1')

    expect(w.find('main h1').exists()).toBe(false)
    expect(w.get('header').text()).toContain('Les Jardins du Lac')
  })

  it('creates a farm from the empty state', async () => {
    const w = await mountApp('en')

    await w.get('main button').trigger('click')
    await flushPromises()
    await typeInDialog('Les Jardins du Lac')
    await submitDialog()

    expect(w.get('header').text()).toContain('Les Jardins du Lac')
    expect(w.find('main h1').exists()).toBe(false)
  })

  it('warns about an invalid settings file', async () => {
    await mountApp('en', [], '', '/home/grower/.config/tunmez/config.yaml')
    await flushPromises()

    expect(document.body.textContent).toContain(
      'The settings file /home/grower/.config/tunmez/config.yaml is invalid.',
    )
  })

  it('shows no warning for a valid settings file', async () => {
    await mountApp('en')
    await flushPromises()

    expect(document.body.textContent).not.toContain('The settings file')
  })
})
