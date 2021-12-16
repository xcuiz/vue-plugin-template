import { describe, it } from 'mocha'
import assert from 'assert'
import { formatByte, formatPks } from '../../../src/formates/format-byte.js'
describe('functions:formatByte', () => {
  it('#formatByte is current', () => {
    assert.strictEqual(formatByte(1024), '1.00KB')
    assert.strictEqual(formatByte(1024 * 1024), '1.00MB')
    assert.strictEqual(formatByte(1024 * 1024 * 1024), '1.00GB')
    assert.strictEqual(formatByte(1024 * 1024 * 1024 * 1024), '1.00TB')
    assert.ok(isNaN(formatByte(NaN)))
    assert.ok(isNaN(formatByte(undefined)))
    assert.strictEqual(formatByte(null), null)
  })
})

describe('functions:formatPks', () => {
  it('#formatPks is current', () => {
    assert.strictEqual(formatPks(1024), '1.00KB/s')
    assert.ok(isNaN(formatPks(NaN)))
    assert.ok(isNaN(formatPks(undefined)))
    assert.strictEqual(formatByte(''), '')
  })
})
