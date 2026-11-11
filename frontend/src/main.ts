import { createApp, watchEffect } from 'vue'
import App from './App.vue'
import { displayPreferencesApi } from './api/displayPreferences'
import { createDisplayPreferences, displayPreferencesKey } from './composables/useDisplayPreferences'
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

// Keep the document language in sync for assistive technologies (WCAG 3.1.1).
watchEffect(() => {
  document.documentElement.lang = i18n.global.locale.value
})

// Apply saved preferences before the first render to avoid a flash of the
// wrong language or theme.
await displayPreferences.load()

createApp(App)
  .use(i18n)
  .use(vuetify)
  .provide(displayPreferencesKey, displayPreferences)
  .mount('#app')
