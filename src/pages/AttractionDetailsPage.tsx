import { Link, useParams } from 'react-router'
import AttractionImage from '../components/AttractionImage'
import type { Place } from '../types/place'

type AttractionDetailsPageProps = {
  places: Place[]
}

function AttractionDetailsPage({ places }: AttractionDetailsPageProps) {
  // The id comes from the URL (/items/:id) as a string.
  const { id } = useParams()
  const place = places.find((p) => String(p.id) === id)

  if (!place) {
    return (
      <section className="details">
        <h1>Attraction not found</h1>
        <p>There is no attraction with the id "{id}".</p>
        <Link to="/" className="details__back">
          ← Back to all attractions
        </Link>
      </section>
    )
  }

  return (
    <article className="details">
      <Link to="/" className="details__back">
        ← Back to all attractions
      </Link>
      <h1>{place.title}</h1>
      <AttractionImage
        src={place.imageUrl}
        alt={place.title}
        className="details__image"
      />
      <p className="details__description">{place.description}</p>
    </article>
  )
}

export default AttractionDetailsPage
