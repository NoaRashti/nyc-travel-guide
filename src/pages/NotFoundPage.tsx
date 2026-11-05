import { Link, useLocation } from 'react-router'

/** Shown for any URL that does not match one of the app's pages. */
function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <section className="details">
      <h1>Page not found</h1>
      <p>
        There is no page at <code>{pathname}</code>.
      </p>
      <Link to="/" className="details__back">
        ← Back to Explore
      </Link>
    </section>
  )
}

export default NotFoundPage
