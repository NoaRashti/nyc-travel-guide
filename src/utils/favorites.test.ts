import { describe, expect, it } from 'vitest'
import type { Place } from '../types/place'
import {
  addFavorite,
  isFavorite,
  removeFavorite,
  toggleFavorite,
} from './favorites'

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
}

const highLine: Place = {
  id: 2509793,
  title: 'High Line',
  description: 'An elevated linear park.',
}

describe('isFavorite', () => {
  it('checks by id, not by object', () => {
    // A copy with the same id still counts as the same favorite.
    const copy: Place = { ...centralPark }

    expect(isFavorite([centralPark], copy.id)).toBe(true)
    expect(isFavorite([centralPark], chrysler.id)).toBe(false)
    expect(isFavorite([], centralPark.id)).toBe(false)
  })
})

describe('addFavorite', () => {
  it('adds a place to the end of the list', () => {
    expect(addFavorite([centralPark], chrysler)).toEqual([centralPark, chrysler])
  })

  it('does not add the same place twice', () => {
    const favorites = [centralPark, chrysler]

    expect(addFavorite(favorites, { ...chrysler })).toEqual(favorites)
  })

  it('does not change the original array', () => {
    const favorites = [centralPark]

    const result = addFavorite(favorites, chrysler)

    expect(favorites).toEqual([centralPark])
    // A new array is what makes React re-render.
    expect(result).not.toBe(favorites)
  })
})

describe('removeFavorite', () => {
  it('removes only the place with that id and keeps the order', () => {
    const favorites = [centralPark, chrysler, highLine]

    expect(removeFavorite(favorites, chrysler.id)).toEqual([
      centralPark,
      highLine,
    ])
    expect(favorites).toHaveLength(3)
  })

  it('returns the same items when the id is not in the list', () => {
    expect(removeFavorite([centralPark], 999)).toEqual([centralPark])
  })
})

describe('toggleFavorite', () => {
  it('adds a place that is not a favorite, then removes it', () => {
    const afterAdd = toggleFavorite([centralPark], highLine)
    expect(afterAdd).toEqual([centralPark, highLine])

    const afterRemove = toggleFavorite(afterAdd, highLine)
    expect(afterRemove).toEqual([centralPark])
  })
})
