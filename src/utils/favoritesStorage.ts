// Saves the favorites in localStorage, so they survive a page refresh.
// Every function here is safe: if localStorage is blocked (e.g. some private
// browsing modes) or holds broken data, the app just starts with no favorites.
import type { Place } from '../types/place'

export const FAVORITES_STORAGE_KEY = 'manhattan-explorer:favorites'

/** The two localStorage methods we use. Tests pass a fake with the same shape. */
export type FavoritesStorage = Pick<Storage, 'getItem' | 'setItem'>

/** Returns the browser's localStorage, or null when it is not available. */
function getBrowserStorage(): FavoritesStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    // Reading window.localStorage itself can throw when storage is blocked.
    return null
  }
}

/** Checks that a value read from storage really has the shape of a Place. */
export function isPlace(value: unknown): value is Place {
  if (typeof value !== 'object' || value === null) return false

  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.description === 'string' &&
    (item.imageUrl === undefined || typeof item.imageUrl === 'string')
  )
}

/**
 * Reads the saved favorites. Returns an empty list when nothing is saved yet,
 * or when the saved data cannot be used. Items with a wrong shape are skipped.
 */
export function loadFavorites(
  storage: FavoritesStorage | null = getBrowserStorage(),
): Place[] {
  if (!storage) return []

  try {
    const saved = storage.getItem(FAVORITES_STORAGE_KEY)
    if (saved === null) return []

    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter(isPlace) : []
  } catch {
    // Broken JSON or blocked storage: start with no favorites.
    return []
  }
}

/** Saves the favorites. Does nothing if storage is blocked or full. */
export function saveFavorites(
  favorites: Place[],
  storage: FavoritesStorage | null = getBrowserStorage(),
): void {
  if (!storage) return

  try {
    storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // Storage full or blocked: favorites still work for this visit.
  }
}
