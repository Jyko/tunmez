import { useSyncExternalStore } from 'react'

// A value that notifies its subscribers when it changes. State lives in stores
// so its logic stays testable without rendering React components.
export interface Store<T> {
  get(): T
  subscribe(listener: () => void): () => void
}

export interface WritableStore<T> extends Store<T> {
  set(value: T): void
}

export function createStore<T>(initial: T): WritableStore<T> {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    get: () => value,
    set(next) {
      value = next
      listeners.forEach((listener) => listener())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

// Renders the component again when the store changes.
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get)
}
