import type { Place } from '../types/place'

/**
 * Picks a random place from the list.
 * - Never returns `excludeId` (the place shown now), unless it is the only one.
 * - Returns null for an empty list.
 * `random` returns a number in [0, 1). It is a parameter so tests can control it.
 */
export function pickRandomPlace(
  places: Place[],
  excludeId: number | null = null,
  random: () => number = Math.random,
): Place | null {
  const candidates =
    places.length > 1
      ? places.filter((place) => place.id !== excludeId)
      : places

  if (candidates.length === 0) return null

  const index = Math.floor(random() * candidates.length)
  return candidates[index]
}
