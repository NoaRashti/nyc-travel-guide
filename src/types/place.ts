// One attraction, in the shape the UI uses.
// Built from the Wikipedia API response by mapWikiPages (src/utils/mapWikiPages.ts).
export type Place = {
  /** Wikipedia pageid — unique, and used in the /items/:id URL. */
  id: number
  title: string
  /** Short description (the first sentences of the article). */
  description: string
  /** Thumbnail URL. Missing when the article has no image. */
  imageUrl?: string
}

/** One attraction with the extra fields shown on its details page. */
export type PlaceDetails = Place & {
  /** Link to the original Wikipedia article. */
  wikipediaUrl: string
}

/** The three states of loading the attraction list. */
export type PlacesState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; places: Place[] }
