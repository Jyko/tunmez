import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import App from './App.vue'
import type { Locale } from './i18n/locale'
import { memoryFarmsApi } from './test/farms'
import { setupApp } from './test/plugins'
import { query, submitDialog, typeInDialog } from './test/dom'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountApp(locale: Locale = 'en', names: string[] = [], activeId = '', invalidConfig = '') {
  const setup = await setupApp(locale, memoryFarmsApi(names, activeId), { invalidConfig })
  wrapper = mount(App, { attachTo: document.body, global: setup.global })
  return { wrapper, navigation: setup.navigation }
}

async function click(selector: string) {
  query(selector).click()
  await flushPromises()
}

describe('App', () => {
  it('shows no tagline', async () => {
    const { wrapper } = await mountApp('en')

    expect(wrapper.get('header').text()).not.toContain('Crop rotation planner')
  })

  it.each([
    ['fr-FR', 'Réglages', 'Profil', 'Développer ou réduire le menu'],
    ['en', 'Settings', 'Profile', 'Expand or collapse the menu'],
  ] as const)('labels the application bar buttons in %s', async (locale, settings, profile, menu) => {
    const { wrapper } = await mountApp(locale)

    for (const label of [settings, profile, menu]) {
      expect(wrapper.find(`header button[aria-label="${label}"]`).exists()).toBe(true)
    }
  })

  it('shows the empty state without an active farm', async () => {
    const { wrapper } = await mountApp('en')

    expect(wrapper.get('main h1').text()).toBe('No farms yet')
  })

  it('opens the last used farm', async () => {
    const { wrapper } = await mountApp('en', ['Les Jardins du Lac'], 'farm-1')

    expect(wrapper.find('main h1').exists()).toBe(false)
    expect(wrapper.get('header').text()).toContain('Les Jardins du Lac')
  })

  it('creates a farm from the empty state', async () => {
    const { wrapper } = await mountApp('en')

    await wrapper.get('main button').trigger('click')
    await flushPromises()
    await typeInDialog('Les Jardins du Lac')
    await submitDialog()

    expect(wrapper.get('header').text()).toContain('Les Jardins du Lac')
    expect(wrapper.find('main h1').exists()).toBe(false)
  })

  it('opens the settings and profile pages in the central content', async () => {
    const { wrapper, navigation } = await mountApp('en')

    await click('header button[aria-label="Settings"]')
    expect(wrapper.get('main h1').text()).toBe('Settings')
    expect(document.activeElement).toBe(wrapper.get('main h1').element)

    await click('header button[aria-label="Profile"]')
    expect(wrapper.get('main h1').text()).toBe('Profile')

    expect(navigation.history.value).toEqual(['home', 'settings', 'profile'])
    navigation.back()
    await flushPromises()
    expect(wrapper.get('main h1').text()).toBe('Settings')
  })

  it('opens the farms page from the farm button and switches farm there', async () => {
    const { wrapper, navigation } = await mountApp('en', ['A', 'B'], 'farm-1')

    await wrapper.get('header button[title^="A"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('main h1').text()).toBe('Farms')

    await click('main button[aria-label="Open “B”"]')
    expect(wrapper.get('header').text()).toContain('B')
    expect(navigation.current.value).toBe('farms')
    expect(document.activeElement?.textContent?.trim()).toBe('Active farm')
  })

  it('shows the farm settings entry in the navigation only while a farm is open', async () => {
    const { wrapper } = await mountApp('en', ['A'])
    const entry = () => wrapper.find('nav#main-navigation [aria-label="Farm settings"]')
    expect(entry().exists()).toBe(false)

    await click('main .v-list-item')
    await entry().trigger('click')
    await flushPromises()

    expect(wrapper.get('main h1').text()).toBe('Farm settings')
  })

  it('expands and collapses the navigation with the menu button', async () => {
    const { wrapper } = await mountApp('en')
    const toggle = () => wrapper.get('header button[aria-label="Expand or collapse the menu"]')
    const nav = () => wrapper.get('nav#main-navigation')

    expect(toggle().attributes('aria-expanded')).toBe('false')
    expect(nav().classes()).toContain('v-navigation-drawer--rail')

    await toggle().trigger('click')

    expect(toggle().attributes('aria-expanded')).toBe('true')
    expect(nav().classes()).not.toContain('v-navigation-drawer--rail')
    expect(nav().text()).toContain('Home')
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
