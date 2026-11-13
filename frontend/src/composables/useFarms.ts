import { inject, readonly, ref, type InjectionKey, type Ref } from 'vue'
import { FARM_NAME_MAX_LENGTH, type Farm, type FarmsApi } from '../api/farms'

export interface FarmsState {
  // Farms, most recently used first.
  farms: Readonly<Ref<readonly Farm[]>>
  active: Readonly<Ref<Farm | null>>
  load(): Promise<void>
  create(name: string): Promise<void>
  select(id: string): Promise<void>
  rename(id: string, name: string): Promise<void>
  remove(id: string): Promise<void>
}

export type FarmNameError = 'required' | 'tooLong'

export const farmsKey: InjectionKey<FarmsState> = Symbol('farms')

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
  const farms = ref<Farm[]>([])
  const active = ref<Farm | null>(null)

  async function refresh() {
    const [list, current] = await Promise.all([api.list(), api.active()])
    farms.value = list
    active.value = current
  }

  return {
    farms: readonly(farms),
    active: readonly(active),
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

export function useFarms(): FarmsState {
  const state = inject(farmsKey)
  if (!state) throw new Error('Farms are not provided')
  return state
}
