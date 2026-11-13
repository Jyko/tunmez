import { vi } from 'vitest'
import type { DisplayPreferences } from '../api/displayPreferences'
import type { FarmsApi } from '../api/farms'
import { createDisplayPreferences, displayPreferencesKey } from '../composables/useDisplayPreferences'
import { createFarms, farmsKey } from '../composables/useFarms'
import type { Locale } from '../i18n/locale'
import { createI18nPlugin } from '../plugins/i18n'
import { createVuetifyPlugin } from '../plugins/vuetify'
import { memoryFarmsApi } from './farms'

// Builds the plugins and provided state that components expect, with loaded
// preferences and farms. Spread the result's global into mount options.
export async function setupApp(
  locale: Locale = 'en',
  api: FarmsApi = memoryFarmsApi(),
  display: Partial<DisplayPreferences> = {},
) {
  const i18n = createI18nPlugin(locale)
  const vuetify = createVuetifyPlugin(i18n)
  const displayApi = {
    load: vi.fn(async (): Promise<DisplayPreferences> => ({ locale, theme: 'system', invalidConfig: '', ...display })),
    setLocale: vi.fn(async () => {}),
    setTheme: vi.fn(async () => {}),
  }
  const prefs = createDisplayPreferences({ api: displayApi, i18n, theme: vuetify.theme, hostLanguages: [locale] })
  const farms = createFarms(api)
  await Promise.all([prefs.load(), farms.load()])
  return {
    farms,
    global: {
      plugins: [i18n, vuetify],
      provide: { [displayPreferencesKey]: prefs, [farmsKey]: farms },
    },
  }
}
