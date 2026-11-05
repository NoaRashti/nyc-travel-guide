/**
 * Turns the :id from the URL into a Wikipedia page id.
 * Returns null when it is not a positive whole number (e.g. "abc", "-5", "1.5").
 */
export function parsePageId(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null

  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}
