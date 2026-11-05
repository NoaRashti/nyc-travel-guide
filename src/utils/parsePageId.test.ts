import { describe, expect, it } from 'vitest'
import { parsePageId } from './parsePageId'

describe('parsePageId', () => {
  it('turns a numeric id from the URL into a number', () => {
    expect(parsePageId('6788')).toBe(6788)
  })

  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['text', 'abc'],
    ['negative', '-5'],
    ['decimal', '1.5'],
    ['zero', '0'],
    ['number with text', '12abc'],
    ['too large to be exact', '99999999999999999999'],
  ])('returns null for a %s id', (_label, value) => {
    expect(parsePageId(value)).toBeNull()
  })
})
