import { Link } from 'react-router'
import AttractionList from '../components/AttractionList'
import type { Place } from '../types/place'

type FavoritesPageProps = {
  favorites: Place[]
  onToggleFavorite: (place: Place) => void
}

function FavoritesPage({ favorites, onToggleFavorite }: FavoritesPageProps) {
  return (
    <>
      <header className="page-header">
        <h1>My Favorites</h1>
        <p>The attractions you saved.</p>
      </header>

      {favorites.length === 0 ? (
        <div className="status-message status-message--empty" role="status">
          <p>You have no favorites yet.</p>
          <p>
            Press <strong>☆ Save</strong> on an attraction to add it here.{' '}
            <Link to="/">Explore attractions</Link>
          </p>
        </div>
      ) : (
        // Pressing "Saved" here removes the attraction from this list.
        <AttractionList
          places={favorites}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  )
}

export default FavoritesPage
