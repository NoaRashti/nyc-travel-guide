// The raw Wikipedia API response (action=query, formatversion=2).
// Only the fields we request are typed. `extract` and `thumbnail` can be missing.

export type WikiPage = {
  pageid: number
  title: string
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
