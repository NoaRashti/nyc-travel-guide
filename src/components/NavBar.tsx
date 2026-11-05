import { Link, NavLink } from 'react-router'

function NavBar() {
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
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
