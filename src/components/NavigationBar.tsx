import { Link, NavLink } from 'react-router'

type NavigationBarProps = {
  /** Shown next to the Favorites link. */
  favoritesCount: number
}

function NavigationBar({ favoritesCount }: NavigationBarProps) {
  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Main">
        <Link to="/" className="navbar__brand">
          Manhattan Explorer
        </Link>
        <ul className="navbar__links">
          <li>
            {/* `end` keeps "Explore" from staying active on /items/:id. */}
            <NavLink to="/" end className="navbar__link">
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink to="/favorites" className="navbar__link">
              Favorites ({favoritesCount})
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default NavigationBar
