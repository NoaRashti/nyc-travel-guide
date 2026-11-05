import type { Place } from '../types/place'
import type { WikiQueryResponse } from '../types/wikipedia'
import { mapWikiPages } from '../utils/mapWikiPages'

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

export const PLACES_URL = `https://en.wikipedia.org/w/api.php?${params}`

/** Loads the attraction list. Throws when the request or the API fails. */
export async function fetchPlaces(signal?: AbortSignal): Promise<Place[]> {
  const response = await fetch(PLACES_URL, { signal })
  if (!response.ok) {
    throw new Error(`Wikipedia responded with status ${response.status}`)
  }

  const data: WikiQueryResponse = await response.json()
  if (data.error) {
    throw new Error(`Wikipedia error: ${data.error.info}`)
  }

  return mapWikiPages(data)
}
