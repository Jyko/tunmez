import { Service as FarmService } from '../../bindings/github.com/Jyko/tunmez/internal/farm'

export interface Farm {
  id: string
  name: string
}

// Maximum number of characters in a farm name, enforced by the Go service.
export const FARM_NAME_MAX_LENGTH = 255

export interface FarmsApi {
  // Farms, most recently used first.
  list(): Promise<Farm[]>
  active(): Promise<Farm | null>
  create(name: string): Promise<Farm>
  select(id: string): Promise<Farm>
  rename(id: string, name: string): Promise<Farm>
  remove(id: string): Promise<void>
}

function toFarm({ id, name }: Farm): Farm {
  return { id, name }
}

// Client for the Go farm Service, the only module that calls its bindings.
export const farmsApi: FarmsApi = {
  async list() {
    return ((await FarmService.List()) ?? []).map(toFarm)
  },
  async active() {
    const farm = await FarmService.Active()
    return farm && toFarm(farm)
  },
  async create(name) {
    return toFarm(await FarmService.Create(name))
  },
  async select(id) {
    return toFarm(await FarmService.Select(id))
  },
  async rename(id, name) {
    return toFarm(await FarmService.Rename(id, name))
  },
  async remove(id) {
    await FarmService.Delete(id)
  },
}
