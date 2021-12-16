/**
 * 可拖拽指令
 * 1. 初始化位置，统一转为 top、left
 * 2. 默认位置，当前元素的x和y（resize进行碰撞检测）
 * 3. 点击元素大小发生变化（外部处理）
 * 4. mousedown、mouseup、click冲突，通过 dragging 属性标识
 * 5. disabled属性，标志是否禁用拖拽 默认启用
 * Created by ligang on 2018/7/25.
 */
import { throttle } from '../util/base'
import { Bus } from 'vue-happy-bus'
const EventName = {
  WINDOW_RESIZE: 'window-resize',
  // 拖拽指令监听拖拽元素大小变化
  DRAG_RESIZE: 'drag-resize'
}

export default {
  name: 'isDrag',
  inserted (el, binding, vNode) {
    // bottom right 转换为 top left, disabled为是否可以禁用，默认为启用
    let { top, right, bottom, left, disabled = false } = binding.value
    // 设置绝对定位 z-index为99
    el.setAttribute('style', `${el.getAttribute('style') || ''} position: fixed;  z-index: 99;`)
    el.disabled = disabled
    el.throttleFn = () => {}
    el.coords = {
      x: 0,     // 拖拽元素的x坐标
      y: 0,     // 拖拽元素的y坐标
      disX: 0,  // 鼠标点击的位置距离DIV左边的距离
      disY: 0   // 鼠标点击的位置距离DIV顶部的距离
    }
    // [初始位置]将bottom right转换为 top left
    top = top || document.documentElement.clientHeight - el.clientHeight - parseInt(bottom)
    left = left || document.documentElement.clientWidth - el.clientWidth - parseInt(right)
    el.style.top = `${top}px`
    el.style.left = `${left}px`
    el.coords.x = left
    el.coords.y = top
  },

  bind (el, binding, vNode) {
    el.onmousedown = function (e) {
      // 判断当前是否可以拖拽
      if (el.disabled) return
      // 记录点击点距离元素左边缘位置
      let event = e || window.event
      el.coords.disX = event.clientX - el.offsetLeft
      el.coords.disY = event.clientY - el.offsetTop
      el.setAttribute('dragging', 'no')

      document.onmousemove = function (e) {
        let event = e || window.event
        // 拖拽元素，标记dragging为yes，避免mousedown、mouseup和click冲突
        document.body.style['user-select'] = 'none'
        el.setAttribute('dragging', 'yes')

        el.coords.x = event.clientX - el.coords.disX
        el.coords.y = event.clientY - el.coords.disY
        // 检测边缘情况
        el._checkPosition()
      }

      document.onmouseup = function () {
        // 还原不可选择
        document.body.style['user-select'] = 'text'
        // 延迟标记，为click提供触发时间
        // let timer = setTimeout(() => {
        //   el.setAttribute('dragging', 'no')
        //   clearTimeout(timer)
        // }, 50)
        // 移除监听
        document.onmousemove = null
        document.onmouseup = null
      }
    }

    el._checkPosition = function () {
      let { x, y } = el.coords
      let clientWidth = document.documentElement.clientWidth
      let clientHeight = document.documentElement.clientHeight
      let width = el.offsetWidth + 1
      let height = el.offsetHeight + 1

      if (x < 0) {
        x = 0
      } else if (x > clientWidth - width) {
        x = clientWidth - width
      }

      if (y < 0) {
        y = 0
      } else if (y > clientHeight - height) {
        y = clientHeight - height
      }

      el.style.left = `${x}px`
      el.style.top = `${y}px`
    }

    el.throttleFn = throttle(el._checkPosition)
    // 兼容resize事件
    Bus.$on(EventName.WINDOW_RESIZE, el.throttleFn)
    Bus.$on(EventName.DRAG_RESIZE, el.throttleFn)
  },
  // 组件发生变更
  componentUpdated: function (el, binding) {
    el.disabled = binding.value.disabled
  },

  unbind (el, bindding, vNode) {
    el.onmousedown = null
    Bus.$off(EventName.WINDOW_RESIZE, el.throttleFn)
    Bus.$off(EventName.DRAG_RESIZE, el.throttleFn)
  }
}
