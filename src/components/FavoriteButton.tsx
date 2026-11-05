type FavoriteButtonProps = {
  isFavorite: boolean
  /** Used in the label for screen readers, e.g. "Add Central Park to favorites". */
  title: string
  onToggle: () => void
}

function FavoriteButton({ isFavorite, title, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-button${isFavorite ? ' favorite-button--active' : ''}`}
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove ${title} from favorites`
          : `Add ${title} to favorites`
      }
    >
      <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>{' '}
      {isFavorite ? 'Saved' : 'Save'}
    </button>
  )
}

export default FavoriteButton
