import { afterEach, describe, expect, it, vi } from 'vitest'
import type { WikiQueryResponse } from '../types/wikipedia'
import { PLACES_URL, fetchPlaceDetails, fetchPlaces } from './wikipedia'

// Replaces the real fetch with one that returns `body` with the given status.
// No real network request is made.
function mockFetch(body: WikiQueryResponse, status = 200) {
  const fetchMock = vi.fn<typeof fetch>(async () =>
    new Response(JSON.stringify(body), { status }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PLACES_URL', () => {
  it('asks English Wikipedia for the Manhattan attractions category', () => {
    const url = new URL(PLACES_URL)

    expect(url.origin).toBe('https://en.wikipedia.org')
    expect(url.searchParams.get('gcmtitle')).toBe(
      'Category:Tourist attractions in Manhattan',
    )
    // Without origin=* the browser blocks the response (CORS).
    expect(url.searchParams.get('origin')).toBe('*')
  })
})

describe('fetchPlaces', () => {
  it('returns the response converted to sorted Places', async () => {
    const fetchMock = mockFetch({
      query: {
        pages: [
          { pageid: 2, title: 'Times Square', extract: 'A busy square.' },
          { pageid: 1, title: 'Central Park', extract: 'A large park.' },
        ],
      },
    })

    const places = await fetchPlaces()

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toBe(PLACES_URL)
    expect(places).toEqual([
      { id: 1, title: 'Central Park', description: 'A large park.', imageUrl: undefined },
      { id: 2, title: 'Times Square', description: 'A busy square.', imageUrl: undefined },
    ])
  })

  it('throws when the server answers with an HTTP error', async () => {
    mockFetch({}, 500)

    await expect(fetchPlaces()).rejects.toThrow(
      'Wikipedia responded with status 500',
    )
  })

  it('throws when Wikipedia returns an error object', async () => {
    mockFetch({
      error: { code: 'badvalue', info: 'Unrecognized value for parameter.' },
    })

    await expect(fetchPlaces()).rejects.toThrow(
      'Wikipedia error: Unrecognized value for parameter.',
    )
  })

  it('passes the abort signal on to fetch', async () => {
    const fetchMock = mockFetch({ query: { pages: [] } })
    const controller = new AbortController()

    await fetchPlaces(controller.signal)

    expect(fetchMock.mock.calls[0][1]).toEqual({ signal: controller.signal })
  })
})

describe('fetchPlaceDetails', () => {
  it('requests the page by its id and returns its details', async () => {
    const fetchMock = mockFetch({
      query: {
        pages: [
          {
            pageid: 6788,
            title: 'Chrysler Building',
            extract: 'An Art Deco skyscraper.',
            fullurl: 'https://en.wikipedia.org/wiki/Chrysler_Building',
          },
        ],
      },
    })

    const place = await fetchPlaceDetails(6788)

    const url = new URL(String(fetchMock.mock.calls[0][0]))
    expect(url.searchParams.get('pageids')).toBe('6788')
    expect(url.searchParams.get('inprop')).toBe('url')
    expect(place?.title).toBe('Chrysler Building')
    expect(place?.wikipediaUrl).toBe(
      'https://en.wikipedia.org/wiki/Chrysler_Building',
    )
  })

  it('returns null when the page does not exist', async () => {
    mockFetch({ query: { pages: [{ pageid: 999999999, missing: true }] } })

    await expect(fetchPlaceDetails(999999999)).resolves.toBeNull()
  })

  it('throws when the request fails', async () => {
    mockFetch({}, 503)

    await expect(fetchPlaceDetails(6788)).rejects.toThrow(
      'Wikipedia responded with status 503',
    )
  })
})
