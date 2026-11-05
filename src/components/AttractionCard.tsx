import type { Place } from '../types/place'

type AttractionCardProps = {
  place: Place
}

function AttractionCard({ place }: AttractionCardProps) {
  return (
    <article className="attraction-card">
      {place.imageUrl ? (
        <img
          className="attraction-card__image"
          src={place.imageUrl}
          alt={place.title}
          loading="lazy"
        />
      ) : (
        <div className="attraction-card__image attraction-card__image--empty">
          No image available
        </div>
      )}
      <div className="attraction-card__body">
        <h2 className="attraction-card__title">{place.title}</h2>
        <p className="attraction-card__description">{place.description}</p>
      </div>
    </article>
  )
}

export default AttractionCard
