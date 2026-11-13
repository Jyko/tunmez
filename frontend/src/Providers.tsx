import type { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { BaseStyles } from '@primer/react'
import { ThemeProvider } from '@primer/react/next'
import { messagesFor } from './i18n/messages'
import { FALLBACK_LOCALE } from './i18n/locale'
import { DisplayPreferencesContext, useDisplayPreferences, type DisplayPreferencesState } from './state/displayPreferences'
import { FarmsContext, type FarmsState } from './state/farms'
import { NavigationContext, type NavigationState } from './state/navigation'
import { primerScheme } from './theme'
import styles from './Providers.module.css'

export interface AppState {
  displayPreferences: DisplayPreferencesState
  farms: FarmsState
  navigation: NavigationState
}

function Theme({ children }: { children: ReactNode }) {
  const { activeLocale, theme, contrast } = useDisplayPreferences()
  return (
    <IntlProvider
      locale={activeLocale}
      defaultLocale={FALLBACK_LOCALE}
      messages={messagesFor(activeLocale)}
    >
      <ThemeProvider {...primerScheme(theme, contrast)}>
        <BaseStyles className={styles.root}>{children}</BaseStyles>
      </ThemeProvider>
    </IntlProvider>
  )
}

// Provides the application state, the translations and the Primer theme.
export function Providers({ state, children }: { state: AppState; children: ReactNode }) {
  return (
    <DisplayPreferencesContext value={state.displayPreferences}>
      <FarmsContext value={state.farms}>
        <NavigationContext value={state.navigation}>
          <Theme>{children}</Theme>
        </NavigationContext>
      </FarmsContext>
    </DisplayPreferencesContext>
  )
}
