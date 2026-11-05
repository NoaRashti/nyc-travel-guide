import type { Place } from '../types/place'
import AttractionCard from './AttractionCard'

type AttractionListProps = {
  places: Place[]
}

function AttractionList({ places }: AttractionListProps) {
  return (
    <ul className="attraction-list">
      {places.map((place) => (
        // The Wikipedia pageid is unique, so it works as the key.
        <li key={place.id}>
          <AttractionCard place={place} />
        </li>
      ))}
    </ul>
  )
}

export default AttractionList
