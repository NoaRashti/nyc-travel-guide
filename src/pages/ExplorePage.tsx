import AttractionList from '../components/AttractionList'
import StatusMessage from '../components/StatusMessage'
import type { PlacesState } from '../types/place'

type ExplorePageProps = {
  placesState: PlacesState
}

function ExplorePage({ placesState }: ExplorePageProps) {
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
          <AttractionList places={placesState.places} />
        ))}
    </>
  )
}

export default ExplorePage
