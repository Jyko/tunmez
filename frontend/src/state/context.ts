import { createContext, useContext, type Context } from 'react'

// Creates a context whose hook fails loudly when no provider is mounted.
export function createRequiredContext<T>(name: string): [Context<T | null>, () => T] {
  const context = createContext<T | null>(null)
  function useRequired(): T {
    const value = useContext(context)
    if (!value) throw new Error(`${name} is not provided`)
    return value
  }
  return [context, useRequired]
}
