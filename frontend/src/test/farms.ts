import { vi } from 'vitest'
import type { Farm, FarmsApi } from '../api/farms'

export interface MemoryFarmsApi extends FarmsApi {
  farms: Farm[]
  activeId: string
}

// In-memory FarmsApi mirroring the Go service; farms are kept most recently
// used first. Every method is a spy.
export function memoryFarmsApi(names: string[] = [], activeId = ''): MemoryFarmsApi {
  let next = names.length
  const api: MemoryFarmsApi = {
    farms: names.map((name, i) => ({ id: `farm-${i + 1}`, name })),
    activeId,
    list: vi.fn(async () => api.farms.map((farm) => ({ ...farm }))),
    active: vi.fn(async () => api.farms.find((farm) => farm.id === api.activeId) ?? null),
    create: vi.fn(async (name: string) => {
      const farm = { id: `farm-${++next}`, name }
      api.farms.unshift(farm)
      api.activeId = farm.id
      return farm
    }),
    select: vi.fn(async (id: string) => {
      const farm = find(id)
      api.farms = [farm, ...api.farms.filter((f) => f !== farm)]
      api.activeId = id
      return farm
    }),
    rename: vi.fn(async (id: string, name: string) => {
      const farm = find(id)
      farm.name = name
      return farm
    }),
    remove: vi.fn(async (id: string) => {
      find(id)
      api.farms = api.farms.filter((farm) => farm.id !== id)
      if (api.activeId === id) api.activeId = ''
    }),
  }

  function find(id: string): Farm {
    const farm = api.farms.find((f) => f.id === id)
    if (!farm) throw new Error('farm not found')
    return farm
  }

  return api
}
