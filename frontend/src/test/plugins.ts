import { vi } from 'vitest'
import type { FarmsApi } from '../api/farms'
import { createDisplayPreferences, displayPreferencesKey } from '../composables/useDisplayPreferences'
import { createFarms, farmsKey } from '../composables/useFarms'
import type { Locale } from '../i18n/locale'
import { createI18nPlugin } from '../plugins/i18n'
import { createVuetifyPlugin } from '../plugins/vuetify'
import { memoryFarmsApi } from './farms'

// Builds the plugins and provided state that components expect, with loaded
// farms. Spread the result's global into mount options.
export async function setupApp(locale: Locale = 'en', api: FarmsApi = memoryFarmsApi()) {
  const i18n = createI18nPlugin(locale)
  const vuetify = createVuetifyPlugin(i18n)
  const displayApi = { load: vi.fn(), setLocale: vi.fn(), setTheme: vi.fn() }
  const prefs = createDisplayPreferences({ api: displayApi, i18n, theme: vuetify.theme, hostLanguages: [locale] })
  const farms = createFarms(api)
  await farms.load()
  return {
    farms,
    global: {
      plugins: [i18n, vuetify],
      provide: { [displayPreferencesKey]: prefs, [farmsKey]: farms },
    },
  }
}
