import { useEffect, useState } from 'react'
import { fetchPlaceDetails } from '../api/wikipedia'
import type { PlaceDetails } from '../types/place'

/** What the page should show while loading one attraction. */
export type AttractionDetailsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'not-found' }
  | { status: 'success'; place: PlaceDetails }

// A finished request. `forId` records which id it belongs to, so when the id
// changes the hook reports "loading" again instead of the old attraction.
type FinishedResult =
  | { forId: number; status: 'error'; message: string }
  | { forId: number; status: 'not-found' }
  | { forId: number; status: 'success'; place: PlaceDetails }

/**
 * Loads one attraction from Wikipedia by its page id, with fetch in useEffect.
 * Pass null when there is nothing to load yet.
 * Used by the details page and the Discover page.
 */
export function useAttractionDetails(
  pageId: number | null,
): AttractionDetailsState {
  const [result, setResult] = useState<FinishedResult | null>(null)

  useEffect(() => {
    if (pageId === null) return

    // Cancels the request when leaving the page or moving to another id.
    const controller = new AbortController()

    fetchPlaceDetails(pageId, controller.signal)
      .then((place) =>
        setResult(
          place
            ? { forId: pageId, status: 'success', place }
            : { forId: pageId, status: 'not-found' },
        ),
      )
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error ? error.message : 'Something went wrong.'
        setResult({ forId: pageId, status: 'error', message })
      })

    return () => controller.abort()
  }, [pageId])

  if (pageId === null) return { status: 'idle' }
  if (result === null || result.forId !== pageId) return { status: 'loading' }

  switch (result.status) {
    case 'error':
      return { status: 'error', message: result.message }
    case 'not-found':
      return { status: 'not-found' }
    case 'success':
      return { status: 'success', place: result.place }
  }
}
