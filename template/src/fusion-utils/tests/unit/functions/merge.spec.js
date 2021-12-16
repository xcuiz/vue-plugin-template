import { describe, it } from 'mocha'
import { expect } from 'chai'
import { merge } from '../../../src/functions/merge.js'

describe('functions:merge', () => {
  // merge Array
  describe('#Array', () => {
    it('merge Array is correct', () => {
      expect(merge([1], [1, 3, 5])).to.deep.equal([1, 3, 5])
    })
  })

  // merge Object
  describe('#Object', () => {
    it('merge Object is correct', () => {
      expect(merge({ a: 1, b: { c: 2 }, d: 4 }, { a: 2, b: { e: 5, f: 6 }, g: 1 })).to.deep.equal({ a: 2, b: { c: 2, e: 5, f: 6 }, d: 4, g: 1 })
    })
  })
})
