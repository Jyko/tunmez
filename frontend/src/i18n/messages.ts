import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import en from '../locales/en.json'
import frFR from '../locales/fr-FR.json'
import { FALLBACK_LOCALE, type Locale } from './locale'

type Tree = { [key: string]: string | Tree }

// react-intl reads flat message ids, the locale files are nested by topic.
function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((flat, [key, value]) => {
    const id = prefix + key
    return typeof value === 'string' ? { ...flat, [id]: value } : { ...flat, ...flatten(value, `${id}.`) }
  }, {})
}

const catalogs: Record<Locale, Record<string, string>> = { 'fr-FR': flatten(frFR), en: flatten(en) }

// Messages of locale, completed by the fallback locale.
export function messagesFor(locale: Locale): Record<string, string> {
  return { ...catalogs[FALLBACK_LOCALE], ...catalogs[locale] }
}

export type Translate = (id: string, values?: Record<string, string | number>) => string

// Returns a function that translates a message id, like vue-i18n's t().
export function useT(): Translate {
  const intl = useIntl()
  return useCallback((id, values) => intl.formatMessage({ id }, values), [intl])
}
