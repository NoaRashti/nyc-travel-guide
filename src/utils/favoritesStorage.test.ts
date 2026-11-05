import { describe, expect, it } from 'vitest'
import type { Place } from '../types/place'
import {
  FAVORITES_STORAGE_KEY,
  type FavoritesStorage,
  isPlace,
  loadFavorites,
  saveFavorites,
} from './favoritesStorage'

// A fake localStorage that keeps values in a Map. Tests run in Node,
// where there is no browser localStorage.
function createFakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  const storage: FavoritesStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
  }
  return { storage, data }
}

// A storage that throws, like a blocked or full localStorage.
const brokenStorage: FavoritesStorage = {
  getItem: () => {
    throw new Error('SecurityError: storage is blocked')
  },
  setItem: () => {
    throw new Error('QuotaExceededError: storage is full')
  },
}

const centralPark: Place = {
  id: 37536,
  title: 'Central Park',
  description: 'An urban park in Manhattan.',
  imageUrl: 'https://upload.wikimedia.org/central-park.jpg',
}

const chrysler: Place = {
  id: 6788,
  title: 'Chrysler Building',
  description: 'An Art Deco skyscraper.',
  // no imageUrl
}

describe('loadFavorites', () => {
  it('returns an empty list when nothing is saved yet', () => {
    const { storage } = createFakeStorage()

    expect(loadFavorites(storage)).toEqual([])
  })

  it('returns an empty list when there is no storage at all', () => {
    expect(loadFavorites(null)).toEqual([])
  })

  it('returns an empty list when the saved text is not valid JSON', () => {
    const { storage } = createFakeStorage({
      [FAVORITES_STORAGE_KEY]: '[{"id": 1, "title": ',
    })

    expect(loadFavorites(storage)).toEqual([])
  })

  it('returns an empty list when the saved value is not an array', () => {
    const { storage } = createFakeStorage({
      [FAVORITES_STORAGE_KEY]: '{"id": 1}',
    })

    expect(loadFavorites(storage)).toEqual([])
  })

  it('skips saved items that do not look like a Place', () => {
    const { storage } = createFakeStorage({
      [FAVORITES_STORAGE_KEY]: JSON.stringify([
        centralPark,
        { id: '6788', title: 'Wrong id type', description: 'x' },
        null,
        'Times Square',
      ]),
    })

    expect(loadFavorites(storage)).toEqual([centralPark])
  })

  it('returns an empty list instead of crashing when storage is blocked', () => {
    expect(loadFavorites(brokenStorage)).toEqual([])
  })
})

describe('saveFavorites', () => {
  it('saves the favorites as JSON under the app key', () => {
    const { storage, data } = createFakeStorage()

    saveFavorites([centralPark], storage)

    expect(JSON.parse(data.get(FAVORITES_STORAGE_KEY) ?? 'null')).toEqual([
      centralPark,
    ])
  })

  it('saves an empty list when the last favorite is removed', () => {
    const { storage, data } = createFakeStorage({
      [FAVORITES_STORAGE_KEY]: JSON.stringify([centralPark]),
    })

    saveFavorites([], storage)

    expect(data.get(FAVORITES_STORAGE_KEY)).toBe('[]')
  })

  it('does not crash when storage is full or blocked', () => {
    expect(() => saveFavorites([centralPark], brokenStorage)).not.toThrow()
  })
})

describe('saving and loading together', () => {
  it('loads back exactly what was saved, in the same order', () => {
    // This is what happens on a page refresh.
    const { storage } = createFakeStorage()

    saveFavorites([chrysler, centralPark], storage)

    expect(loadFavorites(storage)).toEqual([chrysler, centralPark])
  })
})

describe('isPlace', () => {
  it('accepts a place with or without an image', () => {
    expect(isPlace(centralPark)).toBe(true)
    expect(isPlace(chrysler)).toBe(true)
  })

  it('rejects values with missing or wrong fields', () => {
    expect(isPlace({ id: 1, title: 'No description' })).toBe(false)
    expect(isPlace({ ...centralPark, imageUrl: 42 })).toBe(false)
    expect(isPlace(undefined)).toBe(false)
  })
})
