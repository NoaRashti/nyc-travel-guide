import { describe, expect, it } from 'vitest'
import type { Place } from '../types/place'
import { pickRandomPlace } from './pickRandomPlace'

const places: Place[] = [
  { id: 1, title: 'Central Park', description: 'A park.' },
  { id: 2, title: 'Chrysler Building', description: 'A skyscraper.' },
  { id: 3, title: 'High Line', description: 'An elevated park.' },
]

// A fake random function that always returns the same number.
const always = (value: number) => () => value

describe('pickRandomPlace', () => {
  it('uses the random number to choose the index', () => {
    expect(pickRandomPlace(places, null, always(0))?.id).toBe(1)
    expect(pickRandomPlace(places, null, always(0.5))?.id).toBe(2)
    // Just below 1 must still be inside the list.
    expect(pickRandomPlace(places, null, always(0.999))?.id).toBe(3)
  })

  it('never returns the place that is shown now', () => {
    // With id 1 excluded the choices are [2, 3], so 0 picks 2, not 1.
    expect(pickRandomPlace(places, 1, always(0))?.id).toBe(2)

    // Whatever the random number, id 2 is never returned when excluded.
    for (const value of [0, 0.25, 0.5, 0.75, 0.999]) {
      expect(pickRandomPlace(places, 2, always(value))?.id).not.toBe(2)
    }
  })

  it('returns the only place even if it is the one shown now', () => {
    const one = [places[0]]

    expect(pickRandomPlace(one, 1, always(0.7))).toEqual(places[0])
  })

  it('returns null for an empty list', () => {
    expect(pickRandomPlace([], null, always(0.3))).toBeNull()
  })

  it('works with the real Math.random', () => {
    for (let i = 0; i < 50; i++) {
      const place = pickRandomPlace(places, 3)
      expect([1, 2]).toContain(place?.id)
    }
  })
})
