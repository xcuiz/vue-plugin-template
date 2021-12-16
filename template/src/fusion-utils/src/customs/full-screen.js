export const fullScreen = {
  /**
   * 进入全屏
   * @param {*} elem
   */
  full (elem) {
    if (!(elem instanceof Element)) {
      throw new Error('elem 必须是一个Element元素。')
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    }
  },
  /**
   * 退出全屏
   */
  exit () {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  },
  /**
   * 根据当前状态切换全屏模式
   * @param {*} elem
   */
  toggle (elem) {
    this.isFullScreen() ? this.exit() : this.full(elem)
  },
  /**
   * 获取是否在全屏状态
   * true  全屏
   * false 非全屏
   *
   * @FIXME 注意：在调用 full() 后，立即获取全屏状态的话 会获得错误的结果。 无法使用 this.$nextTick 或者 setTimeout(fu, 0) 处理
   */
  isFullScreen () {
    return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
  }
}
