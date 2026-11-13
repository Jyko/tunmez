import { createApp, watchEffect } from 'vue'
import App from './App.vue'
import { displayPreferencesApi } from './api/displayPreferences'
import { farmsApi } from './api/farms'
import { createDisplayPreferences, displayPreferencesKey } from './composables/useDisplayPreferences'
import { createFarms, farmsKey } from './composables/useFarms'
import { resolveLocale } from './i18n/locale'
import { createI18nPlugin } from './plugins/i18n'
import { createVuetifyPlugin } from './plugins/vuetify'

const hostLanguages = navigator.languages
const i18n = createI18nPlugin(resolveLocale(hostLanguages))
const vuetify = createVuetifyPlugin(i18n)
const displayPreferences = createDisplayPreferences({
  api: displayPreferencesApi,
  i18n,
  theme: vuetify.theme,
  hostLanguages,
})
const farms = createFarms(farmsApi)

// Keep the document language in sync for assistive technologies (WCAG 3.1.1).
watchEffect(() => {
  document.documentElement.lang = i18n.global.locale.value
})

// Apply saved preferences and open the last used farm before the first
// render, to avoid a flash of the wrong language, theme or screen.
await Promise.all([displayPreferences.load(), farms.load()])

createApp(App)
  .use(i18n)
  .use(vuetify)
  .provide(displayPreferencesKey, displayPreferences)
  .provide(farmsKey, farms)
  .mount('#app')
