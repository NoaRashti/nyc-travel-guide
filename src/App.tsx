import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { fetchPlaces } from './api/wikipedia'
import NavBar from './components/NavBar'
import AttractionDetailsPage from './pages/AttractionDetailsPage'
import ExplorePage from './pages/ExplorePage'
import type { PlacesState } from './types/place'
import './App.css'

function App() {
  // The list is loaded once here and passed to the pages in props.
  const [placesState, setPlacesState] = useState<PlacesState>({
    status: 'loading',
  })

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
      <NavBar />
      <main className="app">
        <Routes>
          <Route
            path="/"
            element={<ExplorePage placesState={placesState} />}
          />
          <Route
            path="/items/:id"
            element={<AttractionDetailsPage placesState={placesState} />}
          />
        </Routes>
      </main>
    </>
  )
}

export default App
