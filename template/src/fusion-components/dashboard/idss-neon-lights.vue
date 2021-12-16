<template>
  <div class="idss-neon-lights">
    <div
      class="box  box-before"
      :style='boxBeforeStyle'>.</div>
    <div
      class="box box-after"
      :style='boxAfterStyle'>.</div>
  </div>
</template>
<script>
import tinycolor from 'tinycolor2'
/**
 * @cnName 霓虹背景
 */
export default {
  name: 'idss-neon-lights',
  props: {
    shadowBoxStyle: {
      /**
       * @propDesc 小球的样式
       */
      type: Object,
      default: function () {
        return {
          boxBeforeStyle: {},
          boxAfterStyle: {}
        }
      }
    },
    ballCount: { // @propDesc 小球的个数
      type: Number,
      default: 500
    },
    opacity: { // @propDesc 颜色透明度
      type: Number,
      default: 0.8
    },
    blurRadius: { // @propDesc  小球shadow的blur
      type: String,
      default: '4px'
    },
    colorList: { // @propDesc  小球的颜色值
      type: Array,
      default: () => (['rgb(255, 20, 0)', 'rgb(175, 0, 255)', 'rgb(210, 255, 0)', 'rgb(0, 255, 10)', 'rgb(255, 0, 113)', 'rgb(0, 255, 39)', 'rgb(255, 0, 165)', 'rgb(0, 129, 255)', 'rgb(46, 255, 0)', 'rgb(0, 222, 255)', 'rgb(0, 42, 255)', 'rgb(0, 169, 255)', 'rgb(236, 255, 0)', 'rgb(58, 0, 255)', 'rgb(0, 98, 255)', 'rgb(255, 0, 136)', 'rgb(196, 0, 255)', 'rgb(255, 188, 0)', 'rgb(255, 224, 0)', 'rgb(118, 0, 255)', 'rgb(0, 142, 255)', 'rgb(0, 7, 255)', 'rgb(92, 0, 255)', 'rgb(255, 0, 38)', 'rgb(72, 0, 255)', 'rgb(0, 255, 143)', 'rgb(46, 0, 255)', 'rgb(255, 0, 186)', 'rgb(98, 255, 0)', 'rgb(0, 255, 36)', 'rgb(255, 0, 230)', 'rgb(69, 255, 0)', 'rgb(255, 0, 114)', 'rgb(122, 255, 0)', 'rgb(247, 0, 255)', 'rgb(0, 255, 131)', 'rgb(31, 255, 0)', 'rgb(0, 255, 75)', 'rgb(0, 27, 255)', 'rgb(0, 25, 255)', 'rgb(0, 173, 255)'])
    }
  },
  data () {
    return {
      boxBeforeStyle: {},
      boxAfterStyle: {}

    }
  },
  methods: {
    setTextShaow () {
      let shadowStyle = ''
      for (let i = 0; i <= this.ballCount; i++) {
        shadowStyle += `${this.randNumber(-this.maxWidth / 2, this.maxWidth / 2)}px ${this.randNumber(-this.maxWidth / 2, this.maxWidth / 2)}px ${this.blurRadius} ${this.getRandomColor(i)} ${i === this.ballCount ? '' : ','}`
      }
      this.boxBeforeStyle = Object.assign({ 'text-shadow': shadowStyle }, this.shadowBoxStyle.boxBeforeStyle)
      this.boxAfterStyle = Object.assign({ 'text-shadow': shadowStyle }, this.shadowBoxStyle.boxAfterStyle)
    },
    /**
     * 获取两个数之间的随机数
     *  @param {number} Min 最小值
     *  @param {number} Max 最大值
     */
    randNumber (Min, Max) {
      let range = Max - Min
      let rand = Math.random()
      return Min + range * rand
    },
    /**
     * 生成随机颜色和设置透明度
     * @param {number} index 当前索引
     */
    getRandomColor (index) {
      let color = this.colorList[index % this.colorList.length]
      color = tinycolor(color)
      color.setAlpha(this.opacity)
      return color.toRgbString()
    }

  },
  mounted () {
    const { width, height } = this.$el.getBoundingClientRect()
    this.maxWidth = Math.max(width, height) / 25
    this.setTextShaow()
  }
}
</script>
<style scoped >
.idss-neon-lights {
  line-height: 0;
  color: transparent;
  position: relative;
  overflow: hidden;
  .box {
    position: absolute;
    mix-blend-mode: screen;
    left: 50%;
    top: 50%;
  }
  .box-before {
    animation: 44s -27s moveBeforAn infinite ease-in alternate;
  }
  .box-after {
    animation: 44s -27s moveAfterAn infinite ease-in alternate;
  }
  @keyframes moveBeforAn {
    from {
      transform: rotate(0deg) scale(12);
    }
    to {
      transform: rotate(360deg) scale(25);
    }
  }
  @keyframes moveAfterAn {
    from {
      transform: rotate(360deg) scale(25);
    }
    to {
      transform: rotate(0deg) scale(12);
    }
  }
}
</style>
