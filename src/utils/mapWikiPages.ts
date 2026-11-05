import type { Place, PlaceDetails } from '../types/place'
import type { WikiPage, WikiQueryResponse } from '../types/wikipedia'

export const NO_DESCRIPTION = 'No description available.'
export const UNTITLED = 'Untitled'

/** Converts one Wikipedia page to a Place. */
export function mapWikiPage(page: WikiPage): Place {
  const description = page.extract?.trim()

  return {
    id: page.pageid,
    title: page.title ?? UNTITLED,
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

/**
 * Converts the response for a single page to PlaceDetails.
 * Returns null when the page does not exist.
 */
export function mapWikiPageDetails(
  response: WikiQueryResponse,
): PlaceDetails | null {
  const page = response.query?.pages[0]
  if (!page || page.missing) return null

  return {
    ...mapWikiPage(page),
    // fullurl should always be there; the curid link is a safe fallback.
    wikipediaUrl:
      page.fullurl ?? `https://en.wikipedia.org/?curid=${page.pageid}`,
  }
}

/** Splits a plain-text extract into paragraphs, dropping empty lines. */
export function splitParagraphs(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}
