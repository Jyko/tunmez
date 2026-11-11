import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'
import { createI18nPlugin } from './plugins/i18n'
import { createVuetifyPlugin } from './plugins/vuetify'
import type { Locale } from './i18n/locale'

function mountApp(locale: Locale) {
  const i18n = createI18nPlugin(locale)
  return mount(App, { global: { plugins: [i18n, createVuetifyPlugin(i18n)] } })
}

describe('App', () => {
  it.each([
    ['fr-FR', "Planificateur d'assolement"],
    ['en', 'Crop rotation planner'],
  ] as const)('shows the tagline in %s', (locale, tagline) => {
    expect(mountApp(locale).text()).toContain(tagline)
  })
})
