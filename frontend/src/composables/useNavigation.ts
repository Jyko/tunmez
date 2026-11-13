import { computed, inject, readonly, ref, type ComputedRef, type InjectionKey } from 'vue'

// Pages of the central content.
export type Page = 'home' | 'farms' | 'farmSettings' | 'settings' | 'profile'

export interface NavigationState {
  current: ComputedRef<Page>
  // Pages visited, oldest first; the last one is the current page.
  history: Readonly<{ value: readonly Page[] }>
  canGoBack: ComputedRef<boolean>
  navigate(page: Page): void
  // Returns to the previous page. Returns false when there is none.
  back(): boolean
}

// Bounds memory over a long session; older pages are forgotten first.
const MAX_HISTORY = 100

export const navigationKey: InjectionKey<NavigationState> = Symbol('navigation')

// Creates the navigation state of the central content, with its history.
export function createNavigation(start: Page = 'home'): NavigationState {
  const history = ref<Page[]>([start])
  const current = computed(() => history.value.at(-1) ?? start)

  return {
    current,
    history: readonly(history),
    canGoBack: computed(() => history.value.length > 1),
    navigate(page) {
      if (page === current.value) return
      history.value.push(page)
      if (history.value.length > MAX_HISTORY) history.value.shift()
    },
    back() {
      if (history.value.length < 2) return false
      history.value.pop()
      return true
    },
  }
}

export function useNavigation(): NavigationState {
  const state = inject(navigationKey)
  if (!state) throw new Error('Navigation is not provided')
  return state
}
