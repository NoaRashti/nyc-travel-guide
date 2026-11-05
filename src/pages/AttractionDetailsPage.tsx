import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { fetchPlaceDetails } from '../api/wikipedia'
import AttractionImage from '../components/AttractionImage'
import FavoriteButton from '../components/FavoriteButton'
import StatusMessage from '../components/StatusMessage'
import type { Place, PlaceDetails } from '../types/place'
import { isFavorite } from '../utils/favorites'
import { splitParagraphs } from '../utils/mapWikiPages'
import { parsePageId } from '../utils/parsePageId'

type AttractionDetailsPageProps = {
  favorites: Place[]
  onToggleFavorite: (place: Place) => void
}

// Favorites are shown as cards, so save only the card fields, with the first
// paragraph as the description (the details page loads the full intro).
function toCardPlace(details: PlaceDetails): Place {
  return {
    id: details.id,
    title: details.title,
    description: splitParagraphs(details.description)[0] ?? details.description,
    imageUrl: details.imageUrl,
  }
}

// The result of loading one attraction. `forId` records which id it belongs
// to, so when the URL changes to another id the page shows "loading" again.
type DetailsResult =
  | { forId: number; status: 'error'; message: string }
  | { forId: number; status: 'not-found' }
  | { forId: number; status: 'success'; place: PlaceDetails }

function AttractionDetailsPage({
  favorites,
  onToggleFavorite,
}: AttractionDetailsPageProps) {
  // The id comes from the URL (/items/:id) as a string.
  const { id } = useParams()
  const pageId = parsePageId(id)
  const [result, setResult] = useState<DetailsResult | null>(null)

  useEffect(() => {
    if (pageId === null) return

    // Cancels the request when leaving the page or moving to another id.
    const controller = new AbortController()

    fetchPlaceDetails(pageId, controller.signal)
      .then((place) =>
        setResult(
          place
            ? { forId: pageId, status: 'success', place }
            : { forId: pageId, status: 'not-found' },
        ),
      )
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error ? error.message : 'Something went wrong.'
        setResult({ forId: pageId, status: 'error', message })
      })

    return () => controller.abort()
  }, [pageId])

  const backLink = (
    <Link to="/" className="details__back">
      ← Back to all attractions
    </Link>
  )

  // An id that is not a number can never exist, so there is nothing to load.
  if (pageId === null || result?.status === 'not-found') {
    return (
      <section className="details">
        {backLink}
        <h1>Attraction not found</h1>
        <p>There is no attraction with the id "{id}".</p>
      </section>
    )
  }

  if (result === null || result.forId !== pageId) {
    return (
      <section className="details">
        {backLink}
        <StatusMessage type="loading" message="Loading attraction…" />
      </section>
    )
  }

  if (result.status === 'error') {
    return (
      <section className="details">
        {backLink}
        <StatusMessage
          type="error"
          message={`Could not load this attraction (${result.message}). Please check your connection and refresh the page.`}
        />
      </section>
    )
  }

  const { place } = result

  return (
    <article className="details">
      {backLink}
      <h1>{place.title}</h1>
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
    </article>
  )
}

export default AttractionDetailsPage
