import { Link } from 'react-router'
import type { Place } from '../types/place'
import AttractionImage from './AttractionImage'
import FavoriteButton from './FavoriteButton'

type AttractionCardProps = {
  place: Place
  isFavorite: boolean
  onToggleFavorite: (place: Place) => void
}

function AttractionCard({
  place,
  isFavorite,
  onToggleFavorite,
}: AttractionCardProps) {
  return (
    <article className="attraction-card">
      {/* The image and text link to the details page. The button stays
          outside the link, so clicking it does not open the details. */}
      <Link to={`/items/${place.id}`} className="attraction-card__link">
        <AttractionImage src={place.imageUrl} alt={place.title} />
        <div className="attraction-card__body">
          <h2 className="attraction-card__title">{place.title}</h2>
          <p className="attraction-card__description">{place.description}</p>
        </div>
      </Link>
      <div className="attraction-card__actions">
        <FavoriteButton
          isFavorite={isFavorite}
          title={place.title}
          onToggle={() => onToggleFavorite(place)}
        />
      </div>
    </article>
  )
}

export default AttractionCard
