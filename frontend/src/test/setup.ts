// Browser APIs used by Primer that jsdom does not implement.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

globalThis.ResizeObserver ??= ObserverStub as unknown as typeof ResizeObserver
globalThis.IntersectionObserver ??= ObserverStub as unknown as typeof IntersectionObserver

window.matchMedia ??= (query: string) =>
  Object.assign(new EventTarget(), {
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
  }) as unknown as MediaQueryList

// Without the native Popover API, Primer loads a polyfill that moves focus
// back to the trigger when a tooltip hides, which browsers do not do.
if (!('popover' in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, 'popover', {
    get(this: HTMLElement) {
      return this.getAttribute('popover')
    },
    set(this: HTMLElement, value: string | null) {
      if (value === null) this.removeAttribute('popover')
      else this.setAttribute('popover', value)
    },
  })
  Object.assign(HTMLElement.prototype, {
    showPopover() {},
    hidePopover() {},
    togglePopover() {
      return false
    },
  })
}

// SelectPanel scrolls its list to the active item.
Element.prototype.scrollTo ??= () => {}
