import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import type { DisplayPreferencesApi } from '../api/displayPreferences'
import { createDisplayPreferences, displayPreferencesKey } from '../composables/useDisplayPreferences'
import { createI18nPlugin } from '../plugins/i18n'
import { createVuetifyPlugin } from '../plugins/vuetify'
import SettingsPage from './SettingsPage.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function mountPage() {
  const i18n = createI18nPlugin('en')
  const vuetify = createVuetifyPlugin(i18n)
  const api: DisplayPreferencesApi = {
    load: vi.fn(async () => ({ locale: '', theme: 'system', invalidConfig: '' }) as const),
    setLocale: vi.fn(async () => {}),
    setTheme: vi.fn(async () => {}),
  }
  const prefs = createDisplayPreferences({ api, i18n, theme: vuetify.theme, hostLanguages: ['en'] })

  wrapper = mount(SettingsPage, {
    attachTo: document.body,
    global: { plugins: [i18n, vuetify], provide: { [displayPreferencesKey]: prefs } },
  })
  await flushPromises()
  return { api, wrapper }
}

function radio(label: string): HTMLInputElement {
  const input = [...document.querySelectorAll<HTMLInputElement>('input[type="radio"]')].find(
    (el) => el.labels?.[0]?.textContent?.trim() === label,
  )
  if (!input) throw new Error(`No radio labelled ${label}`)
  return input
}

describe('SettingsPage', () => {
  it('groups the settings into labelled sections', async () => {
    const { wrapper } = await mountPage()

    expect(wrapper.get('h1').text()).toBe('Settings')
    expect(wrapper.findAll('section h2').map((h) => h.text())).toEqual(['Language', 'Appearance'])
    for (const section of wrapper.findAll('section')) {
      expect(document.getElementById(section.attributes('aria-labelledby') ?? '')).not.toBeNull()
    }
  })

  it('saves the chosen language', async () => {
    const { api, wrapper } = await mountPage()

    await wrapper.get('.v-select .v-field').trigger('mousedown')
    await flushPromises()
    const option = [...document.querySelectorAll<HTMLElement>('.v-overlay .v-list-item')].find(
      (el) => el.textContent?.trim() === 'Français',
    )
    option?.click()
    await flushPromises()

    expect(api.setLocale).toHaveBeenCalledWith('fr-FR')
  })

  it('saves the chosen theme', async () => {
    const { api } = await mountPage()

    radio('Dark').click()
    await flushPromises()

    expect(api.setTheme).toHaveBeenCalledWith('dark')
  })

  it('labels the theme group for assistive technologies', async () => {
    await mountPage()

    const group = document.querySelector('[role="radiogroup"]')
    expect(group?.getAttribute('aria-labelledby')).toBe('settings-theme')
  })
})
