import { FARM_NAME_MAX_LENGTH, type Farm, type FarmsApi } from '../api/farms'
import { createRequiredContext } from './context'
import { createStore, useStore, type Store } from './store'

export interface FarmsSnapshot {
  // Farms, most recently used first.
  farms: readonly Farm[]
  active: Farm | null
}

export interface FarmsActions {
  load(): Promise<void>
  create(name: string): Promise<void>
  select(id: string): Promise<void>
  rename(id: string, name: string): Promise<void>
  remove(id: string): Promise<void>
}

export interface FarmsState extends FarmsActions {
  state: Store<FarmsSnapshot>
}

export type FarmNameError = 'required' | 'tooLong'

// Returns why name is not a valid farm name, or null. Mirrors the Go rules:
// trimmed, not empty, at most FARM_NAME_MAX_LENGTH characters.
export function farmNameError(name: string): FarmNameError | null {
  const trimmed = name.trim()
  if (!trimmed) return 'required'
  if ([...trimmed].length > FARM_NAME_MAX_LENGTH) return 'tooLong'
  return null
}

// Creates the farms state. Every change reloads the list from the API, which
// owns the ordering and the active farm.
export function createFarms(api: FarmsApi): FarmsState {
  const state = createStore<FarmsSnapshot>({ farms: [], active: null })

  async function refresh() {
    const [farms, active] = await Promise.all([api.list(), api.active()])
    state.set({ farms, active })
  }

  return {
    state,
    async load() {
      try {
        await refresh()
      } catch (error) {
        // The empty state lets the user create a farm anyway.
        console.error('Failed to load farms', error)
      }
    },
    async create(name) {
      await api.create(name.trim())
      await refresh()
    },
    async select(id) {
      await api.select(id)
      await refresh()
    },
    async rename(id, name) {
      await api.rename(id, name.trim())
      await refresh()
    },
    async remove(id) {
      await api.remove(id)
      await refresh()
    },
  }
}

const [FarmsContext, useFarmsState] = createRequiredContext<FarmsState>('Farms')
export { FarmsContext }

export function useFarms(): FarmsSnapshot & FarmsActions {
  const { state, ...actions } = useFarmsState()
  return { ...useStore(state), ...actions }
}
