import { describe, expect, it } from 'vitest'
import type { Place } from '../types/place'
import { filterPlacesByName } from './filterPlaces'

// Real titles from the Wikipedia category, kept in the order the list shows.
const places: Place[] = [
  { id: 47742, title: 'Brooklyn Bridge', description: 'A bridge.' },
  { id: 4308395, title: 'Chelsea Market', description: 'A food hall.' },
  { id: 1780830, title: 'Chelsea Piers', description: 'Sports piers.' },
  { id: 6788, title: 'Chrysler Building', description: 'A skyscraper.' },
  { id: 9736, title: 'Empire State Building', description: 'A skyscraper.' },
  { id: 406051, title: "Grant's Tomb", description: 'A mausoleum.' },
]

const titles = (result: Place[]) => result.map((place) => place.title)

describe('filterPlacesByName', () => {
  it('ignores upper and lower case', () => {
    const expected = ['Chelsea Market', 'Chelsea Piers']

    expect(titles(filterPlacesByName(places, 'chelsea'))).toEqual(expected)
    expect(titles(filterPlacesByName(places, 'CHELSEA'))).toEqual(expected)
    expect(titles(filterPlacesByName(places, 'cHeLsEa'))).toEqual(expected)
  })

  it('matches text in the middle of the name and keeps the list order', () => {
    expect(titles(filterPlacesByName(places, 'building'))).toEqual([
      'Chrysler Building',
      'Empire State Building',
    ])
  })

  it('ignores spaces at the start and end, but not inside the text', () => {
    expect(titles(filterPlacesByName(places, '  empire state  '))).toEqual([
      'Empire State Building',
    ])
    // A space inside the search is part of it: "chelsea m" is only the market.
    expect(titles(filterPlacesByName(places, 'chelsea m'))).toEqual([
      'Chelsea Market',
    ])
  })

  it('returns the whole list for an empty or blank search', () => {
    expect(filterPlacesByName(places, '')).toEqual(places)
    expect(filterPlacesByName(places, '   ')).toEqual(places)
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterPlacesByName(places, 'statue of liberty')).toEqual([])
  })

  it('handles names with an apostrophe', () => {
    expect(titles(filterPlacesByName(places, "grant's"))).toEqual([
      "Grant's Tomb",
    ])
  })

  it('does not change the original list', () => {
    const copy = [...places]

    filterPlacesByName(places, 'chelsea')

    expect(places).toEqual(copy)
  })
})
