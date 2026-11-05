// One attraction, in the shape the UI uses.
// The fields follow what the Wikipedia API returns, so the API data can be
// mapped into this type later (task 4).
export type Place = {
  /** Wikipedia pageid — unique, and used later in the /items/:id URL. */
  id: number
  title: string
  /** Short description (the first sentences of the article). */
  description: string
  /** Thumbnail URL. Missing when the article has no image. */
  imageUrl?: string
}
