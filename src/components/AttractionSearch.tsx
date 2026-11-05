type AttractionSearchProps = {
  value: string
  onChange: (value: string) => void
  /** How many attractions match, and how many there are in total. */
  resultCount: number
  totalCount: number
}

function AttractionSearch({
  value,
  onChange,
  resultCount,
  totalCount,
}: AttractionSearchProps) {
  return (
    <div className="attraction-search" role="search">
      <label htmlFor="attraction-search-input" className="attraction-search__label">
        Search attractions by name
      </label>
      <input
        id="attraction-search-input"
        className="attraction-search__input"
        type="search"
        placeholder="e.g. Central Park"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {/* aria-live lets screen readers hear the new count while typing. */}
      <p className="attraction-search__count" aria-live="polite">
        Showing {resultCount} of {totalCount} attractions
      </p>
    </div>
  )
}

export default AttractionSearch
