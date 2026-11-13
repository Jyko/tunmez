import { describe, expect, it, vi } from 'vitest'
import { memoryFarmsApi } from '../test/farms'
import { createFarms, farmNameError } from './farms'

describe('farmNameError', () => {
  it.each([
    ['', 'required'],
    ['   ', 'required'],
    ['é'.repeat(256), 'tooLong'],
    ['é'.repeat(255), null],
    ['🌱'.repeat(255), null],
    ['  Les Jardins du Lac  ', null],
  ])('validates %j', (name, expected) => {
    expect(farmNameError(name)).toBe(expected)
  })
})

describe('createFarms', () => {
  it('loads the farms and the active farm', async () => {
    const farms = createFarms(memoryFarmsApi(['A', 'B'], 'farm-2'))

    await farms.load()

    expect(farms.state.get().farms.map((f) => f.name)).toEqual(['A', 'B'])
    expect(farms.state.get().active?.name).toBe('B')
  })

  it('stays empty when loading fails', async () => {
    const api = memoryFarmsApi(['A'])
    vi.mocked(api.list).mockRejectedValue(new Error('unavailable'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const farms = createFarms(api)

    await farms.load()

    expect(farms.state.get().farms).toEqual([])
    expect(farms.state.get().active).toBeNull()
  })

  it('creates a trimmed farm and makes it active', async () => {
    const api = memoryFarmsApi(['A'])
    const farms = createFarms(api)

    await farms.create('  B  ')

    expect(api.create).toHaveBeenCalledWith('B')
    expect(farms.state.get().farms.map((f) => f.name)).toEqual(['B', 'A'])
    expect(farms.state.get().active?.name).toBe('B')
  })

  it('selects a farm and moves it first', async () => {
    const farms = createFarms(memoryFarmsApi(['A', 'B']))

    await farms.select('farm-2')

    expect(farms.state.get().farms.map((f) => f.name)).toEqual(['B', 'A'])
    expect(farms.state.get().active?.id).toBe('farm-2')
  })

  it('renames a farm', async () => {
    const farms = createFarms(memoryFarmsApi(['A'], 'farm-1'))

    await farms.rename('farm-1', ' Z ')

    expect(farms.state.get().active?.name).toBe('Z')
  })

  it('leaves no active farm after deleting it', async () => {
    const farms = createFarms(memoryFarmsApi(['A', 'B'], 'farm-1'))

    await farms.remove('farm-1')

    expect(farms.state.get().farms.map((f) => f.name)).toEqual(['B'])
    expect(farms.state.get().active).toBeNull()
  })
})
