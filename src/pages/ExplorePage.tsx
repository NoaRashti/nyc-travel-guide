import { useState } from 'react'
import AttractionList from '../components/AttractionList'
import AttractionSearch from '../components/AttractionSearch'
import StatusMessage from '../components/StatusMessage'
import type { Place, PlacesState } from '../types/place'
import { filterPlacesByName } from '../utils/filterPlaces'

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
  // The search text. The filtered list is calculated from it on every render,
  // so it is never out of sync with the loaded places.
  const [query, setQuery] = useState('')

  const header = (
    <header className="page-header">
      <h1>Explore Manhattan</h1>
      <p>Discover attractions in Manhattan, New York.</p>
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

  const { places } = placesState

  if (places.length === 0) {
    return (
      <>
        {header}
        <StatusMessage type="empty" message="No attractions found." />
      </>
    )
  }

  const results = filterPlacesByName(places, query)

  return (
    <>
      {header}

      <AttractionSearch
        value={query}
        onChange={setQuery}
        resultCount={results.length}
        totalCount={places.length}
      />

      {results.length === 0 ? (
        <StatusMessage
          type="empty"
          message={`No attractions match "${query.trim()}". Try a different name.`}
        />
      ) : (
        <AttractionList
          places={results}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  )
}

export default ExplorePage
