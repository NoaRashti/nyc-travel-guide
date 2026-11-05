// Pure helpers for the favorites list. They never change the array they get;
// they return a new one, which is what React state needs.
import type { Place } from '../types/place'

export function isFavorite(favorites: Place[], id: number): boolean {
  return favorites.some((place) => place.id === id)
}

/** Adds a place at the end. Does nothing if it is already a favorite. */
export function addFavorite(favorites: Place[], place: Place): Place[] {
  if (isFavorite(favorites, place.id)) return favorites
  return [...favorites, place]
}

export function removeFavorite(favorites: Place[], id: number): Place[] {
  return favorites.filter((place) => place.id !== id)
}

/** Adds the place if it is not a favorite yet, otherwise removes it. */
export function toggleFavorite(favorites: Place[], place: Place): Place[] {
  return isFavorite(favorites, place.id)
    ? removeFavorite(favorites, place.id)
    : addFavorite(favorites, place)
}
