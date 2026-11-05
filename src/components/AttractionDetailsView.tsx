import type { Place, PlaceDetails } from '../types/place'
import { isFavorite } from '../utils/favorites'
import { splitParagraphs, toCardPlace } from '../utils/mapWikiPages'
import AttractionImage from './AttractionImage'
import FavoriteButton from './FavoriteButton'

type AttractionDetailsViewProps = {
  place: PlaceDetails
  favorites: Place[]
  onToggleFavorite: (place: Place) => void
  /** h1 on the details page; h2 on Discover, which has its own h1. */
  headingLevel?: 'h1' | 'h2'
}

/** The full view of one attraction: name, favorite button, image, text, link. */
function AttractionDetailsView({
  place,
  favorites,
  onToggleFavorite,
  headingLevel = 'h1',
}: AttractionDetailsViewProps) {
  const Heading = headingLevel

  return (
    <>
      <Heading className="details__title">{place.title}</Heading>
      <div className="details__actions">
        <FavoriteButton
          isFavorite={isFavorite(favorites, place.id)}
          title={place.title}
          onToggle={() => onToggleFavorite(toCardPlace(place))}
        />
      </div>
      <AttractionImage
        src={place.imageUrl}
        alt={place.title}
        className="details__image"
      />
      <div className="details__description">
        {splitParagraphs(place.description).map((paragraph, index) => (
          // Paragraphs have no id and never change order, so the index is a safe key.
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <a
        className="details__wiki-link"
        href={place.wikipediaUrl}
        target="_blank"
        rel="noreferrer"
      >
        Read the full article on Wikipedia ↗
      </a>
    </>
  )
}

export default AttractionDetailsView
