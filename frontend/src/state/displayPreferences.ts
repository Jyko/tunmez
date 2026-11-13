import type { ContrastChoice, DisplayPreferencesApi, LocaleChoice, ThemeChoice } from '../api/displayPreferences'
import { resolveLocale, type Locale } from '../i18n/locale'
import { createRequiredContext } from './context'
import { createStore, useStore, type Store } from './store'

export interface DisplayPreferencesSnapshot {
  locale: LocaleChoice
  // Language of the interface: the user's choice, or the host language.
  activeLocale: Locale
  theme: ThemeChoice
  contrast: ContrastChoice
  // Path of the settings file when it is invalid and defaults are used, or empty.
  invalidConfig: string
}

export interface DisplayPreferencesActions {
  load(): Promise<void>
  setLocale(locale: LocaleChoice): Promise<void>
  setTheme(theme: ThemeChoice): Promise<void>
  setContrast(contrast: ContrastChoice): Promise<void>
}

export interface DisplayPreferencesState extends DisplayPreferencesActions {
  state: Store<DisplayPreferencesSnapshot>
}

interface Options {
  api: DisplayPreferencesApi
  hostLanguages: readonly string[]
}

// Creates the display preferences state: the user's choices, persisted
// through the API, with the language they resolve to.
export function createDisplayPreferences({ api, hostLanguages }: Options): DisplayPreferencesState {
  const resolve = (locale: LocaleChoice) => locale || resolveLocale(hostLanguages)
  const state = createStore<DisplayPreferencesSnapshot>({
    locale: '',
    activeLocale: resolve(''),
    theme: 'system',
    contrast: 'standard',
    invalidConfig: '',
  })

  function update(changes: Partial<DisplayPreferencesSnapshot>) {
    const next = { ...state.get(), ...changes }
    state.set({ ...next, activeLocale: resolve(next.locale) })
  }

  return {
    state,
    async load() {
      try {
        update(await api.load())
      } catch (error) {
        // The interface stays usable with host defaults.
        console.error('Failed to load display preferences', error)
      }
    },
    async setLocale(locale) {
      await api.setLocale(locale)
      update({ locale })
    },
    async setTheme(theme) {
      await api.setTheme(theme)
      update({ theme })
    },
    async setContrast(contrast) {
      await api.setContrast(contrast)
      update({ contrast })
    },
  }
}

const [DisplayPreferencesContext, useDisplayPreferencesState] =
  createRequiredContext<DisplayPreferencesState>('Display preferences')
export { DisplayPreferencesContext }

export function useDisplayPreferences(): DisplayPreferencesSnapshot & DisplayPreferencesActions {
  const { state, ...actions } = useDisplayPreferencesState()
  return { ...useStore(state), ...actions }
}
