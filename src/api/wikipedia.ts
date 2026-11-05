import type { Place, PlaceDetails } from '../types/place'
import type { WikiQueryResponse } from '../types/wikipedia'
import { mapWikiPageDetails, mapWikiPages } from '../utils/mapWikiPages'

const API_BASE = 'https://en.wikipedia.org/w/api.php'

// Pages in "Category:Tourist attractions in Manhattan" on English Wikipedia,
// each with a short intro and a thumbnail. No API key is needed.
// `origin=*` allows the request from the browser (CORS).
const params = new URLSearchParams({
  action: 'query',
  format: 'json',
  formatversion: '2',
  origin: '*',
  generator: 'categorymembers',
  gcmtitle: 'Category:Tourist attractions in Manhattan',
  gcmtype: 'page',
  gcmlimit: '20',
  prop: 'extracts|pageimages',
  exintro: '1',
  explaintext: '1',
  exsentences: '2',
  exlimit: '20',
  piprop: 'thumbnail',
  pithumbsize: '400',
  pilimit: '20',
})

export const PLACES_URL = `${API_BASE}?${params}`

/**
 * One page by its id, with the full intro (not just 2 sentences), a larger
 * thumbnail, and the article URL.
 */
export function buildPlaceDetailsUrl(id: number): string {
  const detailsParams = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    pageids: String(id),
    prop: 'extracts|pageimages|info',
    exintro: '1',
    explaintext: '1',
    piprop: 'thumbnail',
    pithumbsize: '800',
    inprop: 'url',
  })
  return `${API_BASE}?${detailsParams}`
}

/** Fetches a URL and returns the Wikipedia response, or throws on failure. */
async function requestWikipedia(
  url: string,
  signal?: AbortSignal,
): Promise<WikiQueryResponse> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Wikipedia responded with status ${response.status}`)
  }

  const data: WikiQueryResponse = await response.json()
  if (data.error) {
    throw new Error(`Wikipedia error: ${data.error.info}`)
  }
  return data
}

/** Loads the attraction list. Throws when the request or the API fails. */
export async function fetchPlaces(signal?: AbortSignal): Promise<Place[]> {
  const data = await requestWikipedia(PLACES_URL, signal)
  return mapWikiPages(data)
}

/**
 * Loads one attraction by its Wikipedia page id.
 * Returns null when no page has this id. Throws when the request fails.
 */
export async function fetchPlaceDetails(
  id: number,
  signal?: AbortSignal,
): Promise<PlaceDetails | null> {
  const data = await requestWikipedia(buildPlaceDetailsUrl(id), signal)
  return mapWikiPageDetails(data)
}
