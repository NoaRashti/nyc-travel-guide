import AttractionList from './components/AttractionList'
import placesData from './data/places.json'
import type { Place } from './types/place'
import './App.css'

// Temporary local sample data. Replaced by the Wikipedia API in task 4.
const places: Place[] = placesData

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>Manhattan Explorer</h1>
        <p>Discover attractions in Manhattan, New York.</p>
      </header>
      <AttractionList places={places} />
    </main>
  )
}

export default App
