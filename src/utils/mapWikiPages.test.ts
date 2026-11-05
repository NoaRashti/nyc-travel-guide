import { describe, expect, it } from 'vitest'
import type { WikiPage, WikiQueryResponse } from '../types/wikipedia'
import { NO_DESCRIPTION, mapWikiPage, mapWikiPages } from './mapWikiPages'

// Sample pages in the same shape the Wikipedia API returns.
const chrysler: WikiPage = {
  pageid: 6788,
  title: 'Chrysler Building',
  extract:
    'The Chrysler Building is an Art Deco skyscraper in the Turtle Bay neighborhood on the East Side of Manhattan.',
  thumbnail: {
    source: 'https://upload.wikimedia.org/chrysler-400px.jpg',
    width: 400,
    height: 600,
  },
}

const federalHall: WikiPage = {
  pageid: 464921,
  title: 'Federal Hall',
  extract: 'Federal Hall is a historic building at 26 Wall Street in Manhattan.',
  // no thumbnail: this article has no image
}

const apolloTheater: WikiPage = {
  pageid: 372799,
  title: 'Apollo Theater',
  extract: 'The Apollo Theater is a music hall in Harlem.',
}

describe('mapWikiPage', () => {
  it('maps every field of a full page to a Place', () => {
    expect(mapWikiPage(chrysler)).toEqual({
      id: 6788,
      title: 'Chrysler Building',
      description:
        'The Chrysler Building is an Art Deco skyscraper in the Turtle Bay neighborhood on the East Side of Manhattan.',
      imageUrl: 'https://upload.wikimedia.org/chrysler-400px.jpg',
    })
  })

  it('leaves imageUrl undefined when the page has no thumbnail', () => {
    const place = mapWikiPage(federalHall)

    expect(place.imageUrl).toBeUndefined()
    // The rest of the page is still mapped.
    expect(place.id).toBe(464921)
    expect(place.description).toBe(federalHall.extract)
  })

  it('uses the fallback text when the extract is missing', () => {
    const page: WikiPage = { pageid: 1, title: 'No Extract' }

    expect(mapWikiPage(page).description).toBe(NO_DESCRIPTION)
  })

  it('uses the fallback text when the extract is only whitespace', () => {
    const page: WikiPage = { pageid: 2, title: 'Blank', extract: '  \n\t ' }

    expect(mapWikiPage(page).description).toBe(NO_DESCRIPTION)
  })

  it('trims whitespace around the extract', () => {
    const page: WikiPage = {
      pageid: 3,
      title: 'Padded',
      extract: '\n  A park in Manhattan.  \n',
    }

    expect(mapWikiPage(page).description).toBe('A park in Manhattan.')
  })
})

describe('mapWikiPages', () => {
  it('maps all pages and sorts them by title', () => {
    const response: WikiQueryResponse = {
      query: { pages: [federalHall, chrysler, apolloTheater] },
    }

    const places = mapWikiPages(response)

    expect(places.map((place) => place.title)).toEqual([
      'Apollo Theater',
      'Chrysler Building',
      'Federal Hall',
    ])
    // The id stays attached to the right place after sorting.
    expect(places.map((place) => place.id)).toEqual([372799, 6788, 464921])
  })

  it('returns an empty list when the response has no query', () => {
    expect(mapWikiPages({})).toEqual([])
  })

  it('returns an empty list for an API error response', () => {
    const response: WikiQueryResponse = {
      error: { code: 'badvalue', info: 'Unrecognized value for parameter.' },
    }

    expect(mapWikiPages(response)).toEqual([])
  })

  it('does not change the original response', () => {
    const pages = [federalHall, chrysler]
    const response: WikiQueryResponse = { query: { pages } }

    mapWikiPages(response)

    expect(response.query?.pages.map((page) => page.title)).toEqual([
      'Federal Hall',
      'Chrysler Building',
    ])
  })
})
