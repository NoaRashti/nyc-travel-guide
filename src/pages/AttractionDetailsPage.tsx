import { Link, useParams } from 'react-router'
import AttractionImage from '../components/AttractionImage'
import StatusMessage from '../components/StatusMessage'
import type { PlacesState } from '../types/place'

type AttractionDetailsPageProps = {
  placesState: PlacesState
}

// For now the details come from the list loaded in App.
// Task 6 loads a single attraction by its id instead.
function AttractionDetailsPage({ placesState }: AttractionDetailsPageProps) {
  // The id comes from the URL (/items/:id) as a string.
  const { id } = useParams()

  const backLink = (
    <Link to="/" className="details__back">
      ← Back to all attractions
    </Link>
  )

  if (placesState.status === 'loading') {
    return (
      <section className="details">
        <StatusMessage type="loading" message="Loading attraction…" />
      </section>
    )
  }

  if (placesState.status === 'error') {
    return (
      <section className="details">
        {backLink}
        <StatusMessage
          type="error"
          message={`Could not load this attraction (${placesState.message}). Please check your connection and refresh the page.`}
        />
      </section>
    )
  }

  const place = placesState.places.find((p) => String(p.id) === id)

  if (!place) {
    return (
      <section className="details">
        <h1>Attraction not found</h1>
        <p>There is no attraction with the id "{id}".</p>
        {backLink}
      </section>
    )
  }

  return (
    <article className="details">
      {backLink}
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
