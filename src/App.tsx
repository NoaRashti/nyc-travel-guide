import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { fetchPlaces } from './api/wikipedia'
import NavigationBar from './components/NavigationBar'
import AttractionDetailsPage from './pages/AttractionDetailsPage'
import ExplorePage from './pages/ExplorePage'
import FavoritesPage from './pages/FavoritesPage'
import type { Place, PlacesState } from './types/place'
import { toggleFavorite } from './utils/favorites'
import './App.css'

function App() {
  // The list is loaded once here and passed to the pages in props.
  const [placesState, setPlacesState] = useState<PlacesState>({
    status: 'loading',
  })

  // Favorites live in memory only, so they reset on refresh.
  // (Saving them in localStorage is a possible bonus later.)
  const [favorites, setFavorites] = useState<Place[]>([])

  function handleToggleFavorite(place: Place) {
    setFavorites((current) => toggleFavorite(current, place))
  }

  useEffect(() => {
    // Cancels the request if App unmounts. In development React runs effects
    // twice, so the first request is cancelled on purpose.
    const controller = new AbortController()

    fetchPlaces(controller.signal)
      .then((places) => setPlacesState({ status: 'success', places }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error ? error.message : 'Something went wrong.'
        setPlacesState({ status: 'error', message })
      })

    return () => controller.abort()
  }, [])

  return (
    <>
      <NavigationBar favoritesCount={favorites.length} />
      <main className="app">
        <Routes>
          <Route
            path="/"
            element={
              <ExplorePage
                placesState={placesState}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          {/* The details page loads its own attraction by the id in the URL. */}
          <Route
            path="/items/:id"
            element={
              <AttractionDetailsPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default App
