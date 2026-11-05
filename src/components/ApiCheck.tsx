// TEMPORARY (task 3): checks that the Wikipedia API can be called from the
// browser. It does not change the attraction list. Delete this file, and its
// line in App.tsx, once the check is done.
import { useEffect, useState } from 'react'

// Only the fields we asked for. `extract` and `thumbnail` can be missing.
type WikiPage = {
  pageid: number
  title: string
  extract?: string
  thumbnail?: {
    source: string
    width: number
    height: number
  }
}

type WikiQueryResponse = {
  query?: {
    pages: WikiPage[]
  }
  error?: {
    code: string
    info: string
  }
}

type CheckState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; pages: WikiPage[] }

// Pages in "Category:Tourist attractions in Manhattan", with a short intro and
// a thumbnail for each. `origin=*` allows the request from the browser (CORS).
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
const API_URL = `https://en.wikipedia.org/w/api.php?${params}`

function ApiCheck() {
  const [state, setState] = useState<CheckState>({ status: 'loading' })

  useEffect(() => {
    // Cancels the request if the component unmounts. In development React
    // runs effects twice, so the first request is cancelled on purpose.
    const controller = new AbortController()

    async function runCheck() {
      try {
        console.log('[API check] GET', API_URL)
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data: WikiQueryResponse = await response.json()
        if (data.error) {
          throw new Error(`${data.error.code}: ${data.error.info}`)
        }

        const pages = data.query?.pages ?? []
        const uniqueIds = new Set(pages.map((page) => page.pageid))

        console.log('[API check] raw response', data)
        console.log('[API check] summary', {
          pages: pages.length,
          uniqueIds: uniqueIds.size,
          withDescription: pages.filter((page) => page.extract).length,
          withImage: pages.filter((page) => page.thumbnail).length,
        })
        console.table(
          pages.map((page) => ({
            pageid: page.pageid,
            title: page.title,
            hasDescription: Boolean(page.extract),
            hasImage: Boolean(page.thumbnail),
          })),
        )

        setState({ status: 'success', pages })
      } catch (error) {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : String(error)
        console.error('[API check] failed:', message)
        setState({ status: 'error', message })
      }
    }

    runCheck()
    return () => controller.abort()
  }, [])

  return (
    <section className="api-check" aria-label="API check (temporary)">
      <h2>API check (temporary)</h2>
      {state.status === 'loading' && <p>Loading from Wikipedia…</p>}
      {state.status === 'error' && (
        <p className="api-check__error">Request failed: {state.message}</p>
      )}
      {state.status === 'success' && (
        <>
          <p>
            Received {state.pages.length} pages ·{' '}
            {new Set(state.pages.map((page) => page.pageid)).size} unique ids ·{' '}
            {state.pages.filter((page) => page.extract).length} with description ·{' '}
            {state.pages.filter((page) => page.thumbnail).length} with image
          </p>
          <ol className="api-check__list">
            {state.pages.map((page) => (
              <li key={page.pageid}>
                {page.title} <code>#{page.pageid}</code>
                {!page.thumbnail && ' · no image'}
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}

export default ApiCheck
