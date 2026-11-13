import { describe, expect, it } from 'vitest'
import { createNavigation } from './useNavigation'

describe('createNavigation', () => {
  it('starts on the home page without history', () => {
    const navigation = createNavigation()

    expect(navigation.current.value).toBe('home')
    expect(navigation.canGoBack.value).toBe(false)
    expect(navigation.back()).toBe(false)
  })

  it('records visited pages and goes back to the previous one', () => {
    const navigation = createNavigation()

    navigation.navigate('settings')
    navigation.navigate('farms')
    expect(navigation.history.value).toEqual(['home', 'settings', 'farms'])

    expect(navigation.back()).toBe(true)
    expect(navigation.current.value).toBe('settings')
    expect(navigation.back()).toBe(true)
    expect(navigation.current.value).toBe('home')
    expect(navigation.canGoBack.value).toBe(false)
  })

  it('ignores navigation to the current page', () => {
    const navigation = createNavigation()

    navigation.navigate('profile')
    navigation.navigate('profile')

    expect(navigation.history.value).toEqual(['home', 'profile'])
  })

  it('bounds the history', () => {
    const navigation = createNavigation()

    for (let i = 0; i < 150; i++) navigation.navigate(i % 2 ? 'farms' : 'settings')

    expect(navigation.history.value).toHaveLength(100)
    expect(navigation.current.value).toBe('farms')
  })
})
