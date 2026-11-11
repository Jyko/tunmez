import { createI18n } from 'vue-i18n'
import { en as vuetifyEn, fr as vuetifyFr } from 'vuetify/locale'
import en from '../locales/en.json'
import frFR from '../locales/fr-FR.json'
import { FALLBACK_LOCALE, type Locale } from '../i18n/locale'

// Vuetify reads its own component strings under the $vuetify key.
const messages = {
  'fr-FR': { ...frFR, $vuetify: vuetifyFr },
  en: { ...en, $vuetify: vuetifyEn },
}

export function createI18nPlugin(locale: Locale) {
  // Widened to string: Vuetify's locale adapter expects an untyped locale.
  const initial: string = locale
  return createI18n({
    legacy: false,
    locale: initial,
    fallbackLocale: FALLBACK_LOCALE,
    messages,
  })
}

export type I18nPlugin = ReturnType<typeof createI18nPlugin>
