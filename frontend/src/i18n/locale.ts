export const SUPPORTED_LOCALES = ['fr-FR', 'en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const FALLBACK_LOCALE: Locale = 'fr-FR'

// Returns the first supported locale matching the host languages, compared by primary
// subtag so that regional variants (fr-CA, en-GB) map to the supported locale.
export function resolveLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const match = SUPPORTED_LOCALES.find((locale) => primarySubtag(locale) === primarySubtag(language))
    if (match) return match
  }
  return FALLBACK_LOCALE
}

function primarySubtag(tag: string): string {
  const [primary = ''] = tag.toLowerCase().split('-')
  return primary
}
