import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import placesData from './data/places.json'
import AttractionDetailsPage from './pages/AttractionDetailsPage'
import ExplorePage from './pages/ExplorePage'
import type { Place } from './types/place'
import './App.css'

// Temporary local sample data. Replaced by the Wikipedia API in task 4.
const places: Place[] = placesData

function App() {
  return (
    <>
      <NavBar />
      <main className="app">
        <Routes>
          <Route path="/" element={<ExplorePage places={places} />} />
          <Route
            path="/items/:id"
            element={<AttractionDetailsPage places={places} />}
          />
        </Routes>
      </main>
    </>
  )
}

export default App
