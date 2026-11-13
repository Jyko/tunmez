import { describe, expect, it } from 'vitest'
import { FALLBACK_LOCALE, SUPPORTED_LOCALES } from './locale'
import { catalogFor, messagesFor } from './messages'

describe('messagesFor', () => {
  it('flattens nested messages into ids', () => {
    expect(messagesFor('en')['farm.errors.required']).toBe('The name is required.')
  })

  it.each(SUPPORTED_LOCALES)('translates every message id in %s', (locale) => {
    const ids = (messages: Record<string, string>) => Object.keys(messages).sort()
    expect(ids(catalogFor(locale))).toEqual(ids(catalogFor(FALLBACK_LOCALE)))
  })

  it('has a Breton catalog', () => {
    expect(messagesFor('br')['nav.home']).not.toBe(messagesFor('fr-FR')['nav.home'])
  })
})
