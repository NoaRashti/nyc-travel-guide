import { Link, useParams } from 'react-router'
import AttractionDetailsView from '../components/AttractionDetailsView'
import StatusMessage from '../components/StatusMessage'
import { useAttractionDetails } from '../hooks/useAttractionDetails'
import type { Place } from '../types/place'
import { parsePageId } from '../utils/parsePageId'

type AttractionDetailsPageProps = {
  favorites: Place[]
  onToggleFavorite: (place: Place) => void
}

function AttractionDetailsPage({
  favorites,
  onToggleFavorite,
}: AttractionDetailsPageProps) {
  // The id comes from the URL (/items/:id) as a string.
  const { id } = useParams()
  const pageId = parsePageId(id)
  const details = useAttractionDetails(pageId)

  const backLink = (
    <Link to="/" className="details__back">
      ← Back to all attractions
    </Link>
  )

  // An id that is not a number can never exist ("idle"), so nothing is loaded.
  if (details.status === 'idle' || details.status === 'not-found') {
    return (
      <section className="details">
        {backLink}
        <h1>Attraction not found</h1>
        <p>There is no attraction with the id "{id}".</p>
      </section>
    )
  }

  if (details.status === 'loading') {
    return (
      <section className="details">
        {backLink}
        <StatusMessage type="loading" message="Loading attraction…" />
      </section>
    )
  }

  if (details.status === 'error') {
    return (
      <section className="details">
        {backLink}
        <StatusMessage
          type="error"
          message={`Could not load this attraction (${details.message}). Please check your connection and refresh the page.`}
        />
      </section>
    )
  }

  return (
    <article className="details">
      {backLink}
      <AttractionDetailsView
        place={details.place}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    </article>
  )
}

export default AttractionDetailsPage
