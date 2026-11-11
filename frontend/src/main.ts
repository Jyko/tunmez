import { createApp, watchEffect } from 'vue'
import App from './App.vue'
import { resolveLocale } from './i18n/locale'
import { createI18nPlugin } from './plugins/i18n'
import { createVuetifyPlugin } from './plugins/vuetify'

const i18n = createI18nPlugin(resolveLocale(navigator.languages))

// Keep the document language in sync for assistive technologies (WCAG 3.1.1).
watchEffect(() => {
  document.documentElement.lang = i18n.global.locale.value
})

createApp(App).use(i18n).use(createVuetifyPlugin(i18n)).mount('#app')
