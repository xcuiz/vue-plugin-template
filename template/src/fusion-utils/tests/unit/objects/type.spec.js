import { describe, it } from 'mocha'
import { expect } from 'chai'
import { isObject, isArray, isFunction, isBoolean, isNumber, isString } from '../../../src/objects/type.js'

describe('objects:type', () => {
  // isObject
  describe('#isObject', () => {
    it('isObject is correct', () => {
      expect(isObject(Object.create(null))).to.be.true
      expect(isObject({})).to.be.true
      expect(isObject(1)).to.be.false
    })
  })

  // isArray
  describe('#isArray', () => {
    it('isArray is correct', () => {
      expect(isArray([])).to.be.true
      expect(isArray(new Array())).to.be.true
      expect(isArray(1)).to.be.false
    })
  })

  // isFunction
  describe('#isFunction', () => {
    const _noop = function () { }
    it('isFunction is correct', () => {
      expect(isFunction(() => { })).to.be.true
      expect(isFunction(function () { })).to.be.true
      expect(isFunction(_noop)).to.be.true
      expect(isFunction(new Function())).to.be.true
    })
  })

  // isBoolean
  describe('#isBoolean', () => {
    it('isBoolean is correct', () => {
      expect(isBoolean(true)).to.be.true
      expect(isBoolean(false)).to.be.true
      expect(isBoolean(!'')).to.be.true
      expect(isBoolean(123)).to.be.false
    })
  })

  // isNumber
  describe('#isNumber', () => {
    it('isNumber is correct', () => {
      expect(isNumber(12)).to.be.true
      expect(isNumber(0)).to.be.true
      expect(isNumber(-123)).to.be.true
      expect(isNumber('123')).to.be.false
    })
  })

  // isString
  describe('#isString', () => {
    it('isString is correct', () => {
      expect(isString('')).to.be.true
      expect(isString(new String())).to.be.true
      expect(isString('false')).to.be.true
      expect(isString(false)).to.be.false
      expect(isString([])).to.be.false
    })
  })
})
