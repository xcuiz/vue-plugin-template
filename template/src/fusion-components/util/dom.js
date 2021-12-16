const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/**
 * 获取当前元素的样式
 * @param {object<node>} dom dom元素
 * @param {string} attr dom样式名
 */
export function getDomStyle (dom, attr = '') {
  // 判断dom是否为dom节点元素
  if (!(dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string')) {
    return
  }
  // 将属性转成小驼峰
  attr = attr.replace(/-(\w)/g, (all, letter) => {
    return letter.toUpperCase()
  })
  let res
  // 主流浏览器
  if (getComputedStyle) {
    res = getComputedStyle(dom, null)
    attr && (res = getComputedStyle(dom, null)[attr])
    return res
  } else if (dom.currentStyle) {
    if (attr === 'float') {
      res = dom.currentStyle.getAttribute('styleFloat')
      return res
      // 取高宽使用 getBoundingClientRect
    } else if ((attr === 'width' || attr === 'height') && (dom.currentStyle[attr] === 'auto')) {
      res = dom.getBoundingClientRect()
      return res[attr] + 'px'
    }
    res = attr ? dom.currentStyle.getAttribute(attr) : dom.currentStyle
    return res
  }
}

/**
 * 提取html内容 如：span style=\"00DB00\">192.168.200.90</span>
 * @param content
 * @returns {*}
 */
export function extractHtmlContent (content) {
  let extractReg = /<.*?>(.+)<\/.*?>/
  let extractAry = extractReg.exec(content)
  // 匹配不成功 192.168.200.90
  if (!extractAry) {
    return content
  }
  return extractAry[1]
}

/**
 * 添加js 事件
 * @param {objct<dom>} element 需要绑定事件的元素
 * @param {string} event 添加事件的事件类型
 * @param {function} handler 事件函数
 */
export function onEvent (element, event, handler) {
  if (!element || !event || !handler) return
  // 绑定事件对象
  if (!element.eventList) {
    element.eventList = {}
  }
  // 添加事件队列
  if (!element.eventList[event]) {
    element.eventList[event] = []
  }
  // 将当前绑定的事件添加到事件队列
  element.eventList[event].push(handler)
  if (element && event && handler) {
    if (document.addEventListener) {
      element.addEventListener(event, handler, false)
    } else {
      element.attachEvent('on' + event, handler)
    }
  }
}

/**
 * 解绑事件
 * @param {objct<dom>} element 需要绑定事件的元素
 * @param {string} event 添加事件的事件类型
 * @param {function} handler 事件函数
 */
export function offEvent (element, event, handler) {
  // 暂无绑定事件时，不需要清除事件
  if (!element || !event || !element.eventList || !element.eventList[event]) return
  // 初始化需要解绑的事件队列
  let events = []
  // 传递事件函数时，在元素的事件队列中清除该事件函数
  if (handler) {
    const index = element.eventList[event].indexOf(handler)
    if (index > -1) {
      events = element.eventList[event].splice(index, 1)
    }
  } else {
    // 无函数传递时，清除所有事件队列
    events = element.eventList[event].splice(0)
  }
  // 遍历队列 解绑事件
  events.forEach(fn => {
    if (document.addEventListener) {
      element.removeEventListener(event, fn, false)
    } else {
      element.detachEvent('on' + event, fn)
    }
  })
  // 清空队列
  events = undefined
}
