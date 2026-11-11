import { describe, expect, it } from 'vitest'
import { FALLBACK_LOCALE, resolveLocale } from './locale'

describe('resolveLocale', () => {
  it.each([
    [['fr-FR'], 'fr-FR'],
    [['fr-CA'], 'fr-FR'],
    [['fr'], 'fr-FR'],
    [['en-US'], 'en'],
    [['en'], 'en'],
    [['EN-gb'], 'en'],
    [['de-DE', 'en-US'], 'en'],
    [['en-US', 'fr-FR'], 'en'],
  ])('resolves %j to %s', (languages, expected) => {
    expect(resolveLocale(languages)).toBe(expected)
  })

  it('falls back to fr-FR when no language is supported', () => {
    expect(resolveLocale(['de-DE', 'es'])).toBe(FALLBACK_LOCALE)
    expect(resolveLocale([])).toBe(FALLBACK_LOCALE)
  })
})
