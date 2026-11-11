import { inject, ref, type InjectionKey, type Ref } from 'vue'
import type { ThemeInstance } from 'vuetify'
import type { DisplayPreferencesApi, LocaleChoice, ThemeChoice } from '../api/displayPreferences'
import { resolveLocale } from '../i18n/locale'
import type { I18nPlugin } from '../plugins/i18n'

export interface DisplayPreferencesState {
  locale: Readonly<Ref<LocaleChoice>>
  theme: Readonly<Ref<ThemeChoice>>
  load(): Promise<void>
  setLocale(locale: LocaleChoice): Promise<void>
  setTheme(theme: ThemeChoice): Promise<void>
}

interface Options {
  api: DisplayPreferencesApi
  i18n: I18nPlugin
  theme: ThemeInstance
  hostLanguages: readonly string[]
}

export const displayPreferencesKey: InjectionKey<DisplayPreferencesState> = Symbol('displayPreferences')

// Creates the display preferences state: the user's choices, applied to
// vue-i18n and Vuetify, and persisted through the API.
export function createDisplayPreferences({ api, i18n, theme, hostLanguages }: Options): DisplayPreferencesState {
  const locale = ref<LocaleChoice>('')
  const themeChoice = ref<ThemeChoice>('system')

  function applyLocale(choice: LocaleChoice) {
    locale.value = choice
    i18n.global.locale.value = choice || resolveLocale(hostLanguages)
  }

  function applyTheme(choice: ThemeChoice) {
    themeChoice.value = choice
    void theme.change(choice)
  }

  return {
    locale,
    theme: themeChoice,
    async load() {
      try {
        const stored = await api.load()
        applyLocale(stored.locale)
        applyTheme(stored.theme)
      } catch (error) {
        // The interface stays usable with host defaults.
        console.error('Failed to load display preferences', error)
      }
    },
    async setLocale(choice) {
      await api.setLocale(choice)
      applyLocale(choice)
    },
    async setTheme(choice) {
      await api.setTheme(choice)
      applyTheme(choice)
    },
  }
}

export function useDisplayPreferences(): DisplayPreferencesState {
  const state = inject(displayPreferencesKey)
  if (!state) throw new Error('Display preferences are not provided')
  return state
}
