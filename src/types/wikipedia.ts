// The raw Wikipedia API response (action=query, formatversion=2).
// Only the fields we request are typed. Everything except `pageid` can be
// missing: a page id that does not exist comes back as { pageid, missing: true }.

export type WikiPage = {
  pageid: number
  title?: string
  /** true when no page has this id. */
  missing?: boolean
  /** Link to the article (requested with prop=info&inprop=url). */
  fullurl?: string
  extract?: string
  thumbnail?: {
    source: string
    width: number
    height: number
  }
}

export type WikiQueryResponse = {
  query?: {
    pages: WikiPage[]
  }
  error?: {
    code: string
    info: string
  }
}
