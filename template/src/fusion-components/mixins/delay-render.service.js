/**
 * 延迟渲染mixins
 */
export default function (maxCount = 0) {
  return {
    data () {
      return {
        // 展示权重，默认为0
        displayPriority: 0,
        running: true
      }
    },
    mounted () {
      this._startLoop()
    },

    methods: {
      /**
       * 开始逐帧渲染处理
       */
      _startLoop () {
        // 最大渲染数为0时，停止助阵逐帧渲染
        if (maxCount === 0) return
        this.running = true
        const step = () => {
          this.displayPriority++
          if (this.running && this.displayPriority <= maxCount) {
            requestAnimationFrame(step)
          }
        }
        requestAnimationFrame(step)
      },

      /**
       * 停止逐帧渲染
       */
      _stopLoop () {
        this.running = false
      },

      /**
       * 延迟渲染
       * @param {number} priority 当前元素所属权重系数
       */
      delayRender (priority) {
        return this.displayPriority >= priority
      }
    },
    activated () {
      // 激活状态开始渲染
      !this.running && this._startLoop()
    },
    deactivated () {
      // 停止渲染监听
      this._stopLoop()
    },
    beforeDestroy () {
      // 停止渲染监听
      this._stopLoop()
    }
  }
}
