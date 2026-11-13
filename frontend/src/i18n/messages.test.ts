import { describe, expect, it } from 'vitest'
import { messagesFor } from './messages'

describe('messagesFor', () => {
  it('flattens nested messages into ids', () => {
    expect(messagesFor('en')['farm.errors.required']).toBe('The name is required.')
  })

  it('has the same ids in every locale', () => {
    expect(Object.keys(messagesFor('en')).sort()).toEqual(Object.keys(messagesFor('fr-FR')).sort())
  })
})
