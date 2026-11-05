import { useState } from 'react'
import AttractionDetailsView from '../components/AttractionDetailsView'
import StatusMessage from '../components/StatusMessage'
import { useAttractionDetails } from '../hooks/useAttractionDetails'
import type { Place, PlacesState } from '../types/place'
import { pickRandomPlace } from '../utils/pickRandomPlace'

type DiscoverPageProps = {
  placesState: PlacesState
  favorites: Place[]
  onToggleFavorite: (place: Place) => void
}

function DiscoverPage({
  placesState,
  favorites,
  onToggleFavorite,
}: DiscoverPageProps) {
  // The id of the place picked from the list. Its full details are then
  // loaded from Wikipedia with the same hook the details page uses.
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const details = useAttractionDetails(selectedId)

  const header = (
    <header className="page-header">
      <h1>Discover</h1>
      <p>Not sure where to go? Let us pick an attraction for you.</p>
    </header>
  )

  if (placesState.status === 'loading') {
    return (
      <>
        {header}
        <StatusMessage type="loading" message="Loading attractions…" />
      </>
    )
  }

  if (placesState.status === 'error') {
    return (
      <>
        {header}
        <StatusMessage
          type="error"
          message={`Could not load attractions (${placesState.message}). Please check your connection and refresh the page.`}
        />
      </>
    )
  }

  if (placesState.places.length === 0) {
    return (
      <>
        {header}
        <StatusMessage type="empty" message="No attractions to discover." />
      </>
    )
  }

  const { places } = placesState

  function showRandomPlace() {
    const place = pickRandomPlace(places, selectedId)
    if (place) setSelectedId(place.id)
  }

  return (
    <>
      {header}

      <button type="button" className="discover-button" onClick={showRandomPlace}>
        {selectedId === null ? 'Show me a random place' : 'Show me another place'}
      </button>

      {/* aria-live announces the new place to screen readers. */}
      <section className="details discover__result" aria-live="polite">
        {details.status === 'loading' && (
          <StatusMessage type="loading" message="Loading attraction…" />
        )}

        {details.status === 'error' && (
          <StatusMessage
            type="error"
            message={`Could not load this attraction (${details.message}). Try another place.`}
          />
        )}

        {details.status === 'not-found' && (
          <StatusMessage
            type="empty"
            message="This attraction is no longer on Wikipedia. Try another place."
          />
        )}

        {details.status === 'success' && (
          <AttractionDetailsView
            place={details.place}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            headingLevel="h2"
          />
        )}
      </section>
    </>
  )
}

export default DiscoverPage
