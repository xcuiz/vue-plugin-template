/**
 * 数组洗牌函数
 * @param array
 * @returns {*}
 */
export const shuffle = function (ary) {
  let array = JSON.parse(JSON.stringify(ary))
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    // eslint-disable-next-line
    { ([array[i], array[j]] = [array[j], array[i]]) }
  }
  return array
}
