/**
 * 节流函数生成器
 * 对于调用频繁的地方，可保障在设置时间间隔后执行一次，或每相隔固定时间执行一次
 * 使用方法:   window.onresize = throttle(arguments)
 * @param fn 设置此生成器的阈值
 * @param delay 执行的时间间隔
 * @param mustRundelay 必须执行的时间间隔
 * @returns {Function}
 **/
export const throttle = function (fn, delay = 14, mustRunDelay = 14) {
  let timer = null
  let timestamp

  return function () {
    let context = this
    let args = arguments
    let now = +new Date()
    clearTimeout(timer)  // 清除定时器
    if (!timestamp) {
      timestamp = now
    }
    if (now - timestamp >= mustRunDelay) {
      fn.apply(context, args)
      timestamp = now
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}

/**
 * 动画节流函数生成器
 **/
export const throttleAnimation = function () {
  // 在musemove类似的事件中，回调触发频率太高，会导致同一帧多次调用 requestAnimationFrame API
  // 所以增加标示，使用一次
  let flag = false
  const selfRaf = _getRaf()
  return function (fn) {
    if (flag) {
      return
    }
    flag = true
    selfRaf(_ => {
      flag = false
      fn()
    })
  }
}

const _getRaf = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
    setTimeout(fn, 1000 / 60)
  }
}
