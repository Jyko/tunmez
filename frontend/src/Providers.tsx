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

// Browsers and webviews may lack Intl data for Breton: react-intl then formats
// numbers and dates with the fallback locale, which suits Breton users in
// France, so that case is not an error. Other errors keep react-intl's report.
function reportIntlError(error: { code: string }) {
  if (error.code === 'MISSING_DATA') return
  console.error(error)
}

function Theme({ children }: { children: ReactNode }) {
  const { activeLocale, theme, contrast } = useDisplayPreferences()
  return (
    <IntlProvider
      locale={activeLocale}
      defaultLocale={FALLBACK_LOCALE}
      messages={messagesFor(activeLocale)}
      onError={reportIntlError}
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
