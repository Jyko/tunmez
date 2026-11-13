import { describe, expect, it } from 'vitest'
import { createNavigation, currentPage } from './navigation'

describe('createNavigation', () => {
  it('starts on the home page without history', () => {
    const navigation = createNavigation()

    expect(currentPage(navigation.history.get())).toBe('home')
    expect(navigation.history.get().length > 1).toBe(false)
    expect(navigation.back()).toBe(false)
  })

  it('records visited pages and goes back to the previous one', () => {
    const navigation = createNavigation()

    navigation.navigate('farmSettings')
    navigation.navigate('profile')
    expect(navigation.history.get()).toEqual(['home', 'farmSettings', 'profile'])

    expect(navigation.back()).toBe(true)
    expect(currentPage(navigation.history.get())).toBe('farmSettings')
    expect(navigation.back()).toBe(true)
    expect(currentPage(navigation.history.get())).toBe('home')
    expect(navigation.history.get().length > 1).toBe(false)
  })

  it('ignores navigation to the current page', () => {
    const navigation = createNavigation()

    navigation.navigate('profile')
    navigation.navigate('profile')

    expect(navigation.history.get()).toEqual(['home', 'profile'])
  })

  it('bounds the history', () => {
    const navigation = createNavigation()

    for (let i = 0; i < 150; i++) navigation.navigate(i % 2 ? 'profile' : 'farmSettings')

    expect(navigation.history.get()).toHaveLength(100)
    expect(currentPage(navigation.history.get())).toBe('profile')
  })
})
