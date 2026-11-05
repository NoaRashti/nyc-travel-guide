import type { Place } from '../types/place'

/**
 * Returns the places whose name contains the search text.
 * - Upper and lower case do not matter ("CENTRAL" finds "Central Park").
 * - Spaces at the start and end of the search text are ignored.
 * - An empty search returns the whole list.
 * The original order is kept, and the original array is not changed.
 */
export function filterPlacesByName(places: Place[], query: string): Place[] {
  const search = query.trim().toLowerCase()
  if (search === '') return places

  return places.filter((place) => place.title.toLowerCase().includes(search))
}
