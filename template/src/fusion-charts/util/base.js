import Echarts from 'echarts/lib/echarts'
// 共同utils，来自 fusion-utils
export {
  merge,
  isObject,
  isFunction,
  isBoolean,
  isNumber,
  getPropValue,
  formatNumber,
  debounce,
  JSONStringify
} from 'fusion-utils'

/**
 * 数值比例尺
 * @param { config: {current: 当前值，maxNum: 最大值, minNum: 最小值, scale: 比例尺长度，baseSize：比例尺基数 }
 */
const dataScale = function (config) {
  let { current, maxNum, minNum, scale = 20, baseSize = 10 } = config
  if ((maxNum - minNum) < scale) {
    return baseSize + (current - minNum)
  } else {
    return baseSize + Math.floor(current * scale / (maxNum - minNum) * 100) / 100
  }
}

/**
 * 对formatter进行处理
 * @param {string|function} formatter 格式化字符串或者函数
 * @param {ang} argus 形参
 */
const checkFormatter = function (formatter, ...argus) {
  if (typeof formatter === 'string') {
    return formatter
  } else if (typeof formatter === 'function') {
    return formatter.call(this, ...argus)
  }
}

/**
 * 对str按照某个最大宽度进行处理
 * @param {string} words 被处理的文字
 * @param {number} wordsWidth 每组处理的长度,默认80
 * @param {string} fontStyle
 * @param {string} handleType 处理的方式 @FIXME:目前只支持换行和省略两种方式
 * @return string
 */
const handleWords = function ({ words, wordsWidth, fontStyle = 'Microsoft Yahei', handleType = 'newline' } = {}) {
  wordsWidth = typeof wordsWidth === 'number' ? wordsWidth : 80
  switch (handleType) {
    case 'newline':
      // 超出长度切割换行
      let res = []
      while (words) {
        let tempName = Echarts.format.truncateText(words, wordsWidth, fontStyle, '')
        res.push(tempName)
        // 处理非字符串类型，如数值
        words = String.prototype.replace.call(words, tempName, '')
      }
      return res.join('\n')
    case 'ellipsis':
      return Echarts.format.truncateText(words, wordsWidth, fontStyle, '...')
  }
}

/**
 * 事件解析
 * @params {String} 事件
 * 支持事件格式有：
 * @click:one:[serise.line]="clickFn"
 * @click="clickFn"
 * @clickItem:one="clickFn"
 * @clickItem::[serise.line]="clickFn"
 * v-on="{ 'selectLegend.one.serise.line': clickFn }"
 * v-on="{ 'selectLegend.serise.line': clickFn }"
 * v-on="{ 'selectLegend': clickFn }"
 * @return {Object}
 */
const parseListeners = function (fullEventName) {
  const ACTION_MAPING = ['one', 'on']
  const ACTION_DEFAULT = 'on'
  fullEventName = fullEventName.replace(/:/g, '.').replace(/(\[|\])/g, '')
  let eventList = fullEventName.split('.')
  let [eventName, action, ...query] = eventList
  if (action) {
    if (ACTION_MAPING.indexOf(action) === -1) {
      query = [].concat(action, query || []).join('.')
      action = ACTION_DEFAULT
    } else {
      query = [].concat(query || []).join('.')
    }
  } else {
    action = ACTION_DEFAULT
    query = [].concat(query || []).join('.')
  }
  return { fullEventName, eventName, action, query: query || undefined }
}

/**
 * 数组对比
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @return {Array} [arrayAdiff, arrayBdiff, sameArray]
 */
const diffArray = function (arrayA, arrayB) {
  let diffA = []
  let diffB = arrayB.slice(0)
  let same = []
  arrayA.forEach(v => {
    let indexMark = -1
    diffB = diffB.filter((o, oIdx) => {
      if (o === v) {
        indexMark = oIdx
        same.push(o)
      } else {
        return true
      }
    })
    if (indexMark === -1) {
      diffA.push(v)
    }
  })
  return [diffA, diffB, same]
}

export {
  dataScale,
  checkFormatter,
  handleWords,
  parseListeners,
  diffArray
}
