import crypto from 'crypto'
import { shuffle } from '../collections/shuffle'
import { isNumber } from '../objects/type.js'

// AES对称加密keys
export const ASE_KEYS = {
  secretKey: 'idssinsightkey01', // key的话是算法原生的key
  iv: '3612213421341234' // iv表示初始化向量
}
const SPECIAL_CHARTS = '!@#$%^&*()_-,='

/**
 * 生成密码（必须包含大小写字母、数字、符号）
 * @param {number} length 生成默认密码长度，默认为8
 */
const generatePwd = function (length = 8, specialChars = SPECIAL_CHARTS) {
  let passAry = []
  // 必须包含大小写字母、数字、符号
  for (let i = 0; i < length - 3; i++) {
    // code为97 - 122 小写字母
    passAry.push(String.fromCharCode(Math.floor(Math.random() * 25 + 97)))
  }
  // code为65-90的大写字母
  passAry.push(String.fromCharCode(Math.floor(Math.random() * 25 + 65)))
  // code为48-57的数字
  passAry.push(String.fromCharCode(Math.floor(Math.random() * 8 + 48)))
  // 特殊字符处理
  passAry.push(specialChars.charAt(Math.floor(Math.random() * specialChars.length)))
  // 随机（洗牌）
  return shuffle(passAry).join('')
}

/**
 * 验证密码格式
 * @param {rule} min/max 密码最小/最大长度
 * @param {string} value
 */
const validatePwd = function (rule, value, callback) {
  const min = isNumber(rule.min) ? rule.min : 8
  const max = isNumber(rule.max) ? rule.max : 32
  // 对字符串进行转译（修复直接字符串正则匹配报错）(符号-不能双斜线补全，存在bug)
  const specialCharsRepair = SPECIAL_CHARTS.split('').map(item => item.padStart(item === '-' ? 2 : 3, '\\')).join('')
  const reg = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[${specialCharsRepair}]).{${min},${max}}$`)
  if (!reg.test(value)) {
    callback(new Error(`密码必须是包含大写字母、小写字母、数字和特殊符号的大于${min}小于${max}的字符串`))
  } else {
    callback()
  }
}

/** *************************** AES对称加密 **************************************************** */
/**
 * aes加密
 * @param {string} data
 * @param {string} secretKey
 * @param {string} secretIV
 */
function aesEncrypt (data, secretKey = ASE_KEYS.secretKey, iv = ASE_KEYS.iv) {
  const cipherEncoding = 'base64'
  const clearEncoding = 'utf8'
  const cipher = crypto.createCipheriv('aes-128-cbc', secretKey, iv)
  return cipher.update(data, clearEncoding, cipherEncoding) +
        cipher.final(cipherEncoding)
}

/**
 * aes解密
 * @param {string} data
 * @param {string} secretKey
 * @param {string} secretIV
 */
function aesDecrypt (data, secretKey = ASE_KEYS.secretKey, iv = ASE_KEYS.iv) {
  const cipherEncoding = 'base64'
  const clearEncoding = 'utf8'
  const cipher = crypto.createDecipheriv('aes-128-cbc', secretKey, iv)
  return cipher.update(data, cipherEncoding, clearEncoding) + cipher.final(clearEncoding)
}

export {
  generatePwd,
  validatePwd,
  aesEncrypt,
  aesDecrypt
}
