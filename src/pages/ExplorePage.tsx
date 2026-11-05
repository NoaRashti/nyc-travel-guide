import AttractionList from '../components/AttractionList'
import StatusMessage from '../components/StatusMessage'
import type { Place, PlacesState } from '../types/place'

type ExplorePageProps = {
  placesState: PlacesState
  favorites: Place[]
  onToggleFavorite: (place: Place) => void
}

function ExplorePage({
  placesState,
  favorites,
  onToggleFavorite,
}: ExplorePageProps) {
  return (
    <>
      <header className="page-header">
        <h1>Explore Manhattan</h1>
        <p>Discover attractions in Manhattan, New York.</p>
      </header>

      {placesState.status === 'loading' && (
        <StatusMessage type="loading" message="Loading attractions…" />
      )}

      {placesState.status === 'error' && (
        <StatusMessage
          type="error"
          message={`Could not load attractions (${placesState.message}). Please check your connection and refresh the page.`}
        />
      )}

      {placesState.status === 'success' &&
        (placesState.places.length === 0 ? (
          <StatusMessage type="empty" message="No attractions found." />
        ) : (
          <AttractionList
            places={placesState.places}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
    </>
  )
}

export default ExplorePage
