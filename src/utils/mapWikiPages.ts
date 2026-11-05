import type { Place } from '../types/place'
import type { WikiPage, WikiQueryResponse } from '../types/wikipedia'

export const NO_DESCRIPTION = 'No description available.'

/** Converts one Wikipedia page to a Place. */
export function mapWikiPage(page: WikiPage): Place {
  const description = page.extract?.trim()

  return {
    id: page.pageid,
    title: page.title,
    description: description || NO_DESCRIPTION,
    imageUrl: page.thumbnail?.source,
  }
}

/** Converts a whole API response to a list of Places, sorted by title. */
export function mapWikiPages(response: WikiQueryResponse): Place[] {
  const pages = response.query?.pages ?? []

  return pages
    .map(mapWikiPage)
    .sort((a, b) => a.title.localeCompare(b.title))
}
