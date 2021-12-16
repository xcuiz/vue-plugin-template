import { describe, it } from 'mocha'
import assert from 'assert'
import { formatNumber } from '../../../src/formates/format-number.js'

describe('functions:formatNumber', () => {
  // format
  describe('#en', () => {
    it('unit is en', () => {
      assert.strictEqual(formatNumber(1000), '1K')
      assert.strictEqual(formatNumber(1000000), '1M')
      assert.strictEqual(formatNumber(100000000), '1B')
      assert.ok(isNaN(formatNumber(NaN)))
      assert.ok(isNaN(formatNumber(undefined)))
      assert.strictEqual(formatNumber(null), 0)
      assert.strictEqual(formatNumber(''), 0)
    })
  })

  describe('#zh', () => {
    it('unit is zh', () => {
      assert.strictEqual(formatNumber(1000, 'zh'), '1千')
      assert.strictEqual(formatNumber(1000000, 'zh'), '1百万')
      assert.strictEqual(formatNumber(100000000, 'zh'), '1亿')
      assert.ok(isNaN(formatNumber(NaN, 'zh')))
      assert.ok(isNaN(formatNumber(undefined, 'zh')))
      assert.strictEqual(formatNumber(null, 'zh'), 0)
      assert.strictEqual(formatNumber('', 'zh'), 0)
    })
  })
})
