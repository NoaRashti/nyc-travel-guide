import { Link } from 'react-router'
import type { Place } from '../types/place'
import AttractionImage from './AttractionImage'

type AttractionCardProps = {
  place: Place
}

function AttractionCard({ place }: AttractionCardProps) {
  return (
    <article className="attraction-card">
      {/* The whole card is a link to the details page. */}
      <Link to={`/items/${place.id}`} className="attraction-card__link">
        <AttractionImage src={place.imageUrl} alt={place.title} />
        <div className="attraction-card__body">
          <h2 className="attraction-card__title">{place.title}</h2>
          <p className="attraction-card__description">{place.description}</p>
        </div>
      </Link>
    </article>
  )
}

export default AttractionCard
