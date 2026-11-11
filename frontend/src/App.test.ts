import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'
import { createI18nPlugin } from './plugins/i18n'
import { createVuetifyPlugin } from './plugins/vuetify'
import { createDisplayPreferences, displayPreferencesKey } from './composables/useDisplayPreferences'
import type { Locale } from './i18n/locale'

function mountApp(locale: Locale) {
  const i18n = createI18nPlugin(locale)
  const vuetify = createVuetifyPlugin(i18n)
  const api = { load: vi.fn(), setLocale: vi.fn(), setTheme: vi.fn() }
  const prefs = createDisplayPreferences({ api, i18n, theme: vuetify.theme, hostLanguages: [locale] })
  return mount(App, {
    global: { plugins: [i18n, vuetify], provide: { [displayPreferencesKey]: prefs } },
  })
}

describe('App', () => {
  it.each([
    ['fr-FR', "Planificateur d'assolement"],
    ['en', 'Crop rotation planner'],
  ] as const)('shows the tagline in %s', (locale, tagline) => {
    expect(mountApp(locale).text()).toContain(tagline)
  })

  it.each([
    ['fr-FR', 'Réglages'],
    ['en', 'Settings'],
  ] as const)('shows a labelled settings button in %s', (locale, label) => {
    expect(mountApp(locale).find(`button[aria-label="${label}"]`).exists()).toBe(true)
  })
})
