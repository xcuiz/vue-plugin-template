<template>
  <canvas :id="curdomId"></canvas>
</template>
<script>
/**
 * @cnName 原子连线背景
 */
export default {
  name: 'idss-atom-line',
  data () {
    return {
      curdomId: `canvas${+new Date()}`// 生成唯一id
    }
  },
  props: {
    /**
     * @propDesc 圆点个数
     */
    dotsNum: {
      type: Number,
      default: 30
    },
    /**
     * @propDesc 是否暂停
     */
    paused: {
      type: Boolean,
      default: false
    },
    /**
     * @propDesc 是否有颜色
     */
    isColor: {
      type: Boolean,
      default: false
    },
    /**
     * @propDesc 圆点颜色
     */
    roundColor: {
      type: String,
      default: '#87CEFA'
    },
    /**
     * @propDesc 连接线颜色
     */
    lineColor: {
      type: String,
      default: '#6495ED'
    },
    /**
     * @propDesc 圆点最大半径
     */
    dotsMaxR: {
      type: Number,
      default: 5
    },
    /**
     * @propDesc 移动速度
     */
    moveSpeed: {
      type: Number,
      default: 50
    },
    /**
     * @propDesc 彩线透明度
     */
    opacity: {
      type: Number,
      default: 0.3
    }
  },
  watch: {
    paused () {
      this.drawAtomLine()// 初始化方法
    }
  },
  methods: {
    drawAtomLine () {
      const canvas = document.getElementById(this.curdomId)
      const ctx = canvas.getContext('2d')
      const rndCl = () => Math.floor(Math.random() * 225)
      const { width, height } = this.$el.getBoundingClientRect() // 获取父级div的宽高
      var baseList = []
      canvas.width = width
      canvas.height = height
      // 绘制圆
      const drawRounds = (obj, index) => {
        let { x, y, r, color } = obj
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        if (this.isColor) {
          ctx.fillStyle = color
        } else {
          ctx.fillStyle = this.roundColor
        }
        ctx.fill()
        ctx.closePath()
      }
      // 判断移动方向
      const controlDirection = (obj) => {
        if (obj.x >= (width - obj.r)) {
          obj.controlX = 'left'
        } else if (obj.x <= parseInt(obj.r / 2)) {
          obj.controlX = 'right'
        }
        if (obj.y >= (height - obj.r)) {
          obj.controlY = 'bottom'
        } else if (obj.y <= parseInt(obj.r / 2)) {
          obj.controlY = 'top'
        }
        return obj
      }
      // 划线
      const drawLine = (list) => {
        list.forEach((item, index) => {
          ctx.beginPath()
          ctx.moveTo(item.x1, item.y1)
          ctx.lineTo(item.x2, item.y2)
          ctx.LineWeight = 0.05
          if (this.isColor) {
            ctx.strokeStyle = item.color
          } else {
            ctx.strokeStyle = this.lineColor
          }
          ctx.stroke()
          ctx.closePath()
        })
      }
      // 绘制
      const draw = (list) => {
        let dotsArr = []
        let lineArr = []
        let myTimer
        list.forEach((item, index) => {
          let xy = controlDirection(item)
          let obj = roundMove(xy)
          dotsArr.push(obj)
        })
        dotsArr.forEach((item1, index1) => {
          dotsArr.forEach((item2, index2) => {
            if (item1 !== item2) {
              let x = item1.x - item2.x
              let y = item1.y - item2.y
              if (Math.abs(x) < 150 && Math.abs(y) < 150) {
                let obj = {
                  x1: item1.x,
                  y1: item1.y,
                  x2: item2.x,
                  y2: item2.y,
                  color: item1.color
                }
                lineArr.push(obj)
              }
            }
          })
        })
        drawLine(lineArr)
        dotsArr.forEach((item, index) => {
          drawRounds(item, index)
        })
        baseList = dotsArr
        clearTimeout(myTimer) // 开启定时器前先清除定时器
        myTimer = setTimeout(() => {
          if (!this.paused) { // 暂停停止绘图
            reDraw()
          }
        }, this.moveSpeed)// 移动速度
      }
      const reDraw = () => {
        ctx.clearRect(0, 0, width, height)
        draw(baseList)
      }
      // 移动
      const roundMove = (obj) => {
        switch (obj.controlX) {
          case 'right':
            obj.x++
            break
          case 'left':
            obj.x--
            break
          default:
        }
        switch (obj.controlY) {
          case 'top':
            obj.y++
            break
          case 'bottom':
            obj.y--
            break
          default:
        }
        return obj
      }
      // 创造圆点
      const creatDots = () => {
        let arr = []
        for (let i = 0; i < this.dotsNum; i++) {
          let obj = {}
          obj.x = parseInt(Math.random() * width)
          obj.y = parseInt(Math.random() * height)
          obj.r = parseInt(Math.random() * this.dotsMaxR)// 圆的半径
          obj.controlX = parseInt(Math.random() * 10) > 5 ? 'left' : 'right'
          obj.controlY = parseInt(Math.random() * 10) > 5 ? 'bottom' : 'top'
          obj.color = `rgba(${rndCl()},${rndCl()},${rndCl()},${this.opacity})`
          arr.push(obj)
        }
        return arr
      }
      draw(creatDots())
    }
  },
  mounted () {
    this.drawAtomLine()// 初始化方法
  }
}
</script>
<style>
#canvas {
  overflow: hidden;
}
</style>
