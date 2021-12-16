import { describe, it } from 'mocha'
import assert from 'assert'
import { formatDate } from '../../../src/formates/format-date.js'
describe('functions:formatDate', () => {
  // formatDate
  describe('#date', () => {
    it('formatDate is correct', () => {
      assert.strictEqual(formatDate.call(new Date(1573648596030), 'yyyy-MM-dd'), '2019-11-13')
      assert.ok(isNaN(formatDate.call(new Date(NaN), 'yyyy-MM-dd')))
      assert.ok(isNaN(formatDate.call(new Date(undefined), 'yyyy-MM-dd')))
    })
  })
})
