import { createRequiredContext } from './context'
import { createStore, useStore, type Store } from './store'

// Pages of the central content.
export type Page = 'home' | 'farmSettings' | 'profile'

export interface NavigationActions {
  navigate(page: Page): void
  // Returns to the previous page. Returns false when there is none.
  back(): boolean
}

export interface NavigationState extends NavigationActions {
  // Pages visited, oldest first; the last one is the current page.
  history: Store<readonly Page[]>
}

// Bounds memory over a long session; older pages are forgotten first.
const MAX_HISTORY = 100

export function currentPage(history: readonly Page[]): Page {
  return history.at(-1) ?? 'home'
}

// Creates the navigation state of the central content, with its history.
export function createNavigation(start: Page = 'home'): NavigationState {
  const history = createStore<readonly Page[]>([start])

  return {
    history,
    navigate(page) {
      const pages = history.get()
      if (page === currentPage(pages)) return
      history.set([...pages, page].slice(-MAX_HISTORY))
    },
    back() {
      const pages = history.get()
      if (pages.length < 2) return false
      history.set(pages.slice(0, -1))
      return true
    },
  }
}

const [NavigationContext, useNavigationState] = createRequiredContext<NavigationState>('Navigation')
export { NavigationContext }

export function useNavigation() {
  const { history, navigate, back } = useNavigationState()
  const pages = useStore(history)
  return { current: currentPage(pages), history: pages, canGoBack: pages.length > 1, navigate, back }
}
