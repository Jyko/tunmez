import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createI18nPlugin } from '../plugins/i18n'
import { createVuetifyPlugin } from '../plugins/vuetify'
import type { DisplayPreferencesApi } from '../api/displayPreferences'
import { createDisplayPreferences, displayPreferencesKey } from '../composables/useDisplayPreferences'
import SettingsMenu from './SettingsMenu.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})

async function openMenu() {
  const i18n = createI18nPlugin('en')
  const vuetify = createVuetifyPlugin(i18n)
  const api: DisplayPreferencesApi = {
    load: vi.fn(async () => ({ locale: '', theme: 'system', invalidConfig: '' }) as const),
    setLocale: vi.fn(async () => {}),
    setTheme: vi.fn(async () => {}),
  }
  const prefs = createDisplayPreferences({ api, i18n, theme: vuetify.theme, hostLanguages: ['en'] })

  wrapper = mount(SettingsMenu, {
    attachTo: document.body,
    global: { plugins: [i18n, vuetify], provide: { [displayPreferencesKey]: prefs } },
  })
  await wrapper.get('button[aria-label="Settings"]').trigger('click')
  await flushPromises()
  return api
}

function radio(label: string): HTMLInputElement {
  const input = [...document.querySelectorAll<HTMLInputElement>('input[type="radio"]')].find(
    (el) => el.labels?.[0]?.textContent?.trim() === label,
  )
  if (!input) throw new Error(`No radio labelled ${label}`)
  return input
}

describe('SettingsMenu', () => {
  it('saves the chosen language', async () => {
    const api = await openMenu()

    radio('Français').click()
    await flushPromises()

    expect(api.setLocale).toHaveBeenCalledWith('fr-FR')
  })

  it('saves the chosen theme', async () => {
    const api = await openMenu()

    radio('Dark').click()
    await flushPromises()

    expect(api.setTheme).toHaveBeenCalledWith('dark')
  })

  it('labels each group for assistive technologies', async () => {
    await openMenu()

    const groups = [...document.querySelectorAll('[role="radiogroup"]')]
    expect(groups.map((g) => g.getAttribute('aria-labelledby'))).not.toContain(null)
  })
})
