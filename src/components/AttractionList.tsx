import type { Place } from '../types/place'
import { isFavorite } from '../utils/favorites'
import AttractionCard from './AttractionCard'

type AttractionListProps = {
  places: Place[]
  favorites: Place[]
  onToggleFavorite: (place: Place) => void
}

function AttractionList({
  places,
  favorites,
  onToggleFavorite,
}: AttractionListProps) {
  return (
    <ul className="attraction-list">
      {places.map((place) => (
        // The Wikipedia pageid is unique, so it works as the key.
        <li key={place.id}>
          <AttractionCard
            place={place}
            isFavorite={isFavorite(favorites, place.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}

export default AttractionList
