// Browser APIs used by Vuetify overlays that jsdom does not implement.

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub

if (!globalThis.visualViewport) {
  Object.defineProperty(globalThis, 'visualViewport', {
    value: Object.assign(new EventTarget(), {
      width: 1024,
      height: 768,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
    }),
  })
}
