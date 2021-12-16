<template>
  <!-- 自定义框  -->
  <div
    class="custom-box-page"
    :class="layout==='reverse'?'reverse':'normal'">
    <!-- top内容 start -->
    <div
      class="top-content topOne"
      :style="isArrayStyle?curStyle.topStyle:boxStyle">
      <slot name="top">
        <div class="top-content-left">
          <span class="top-content-left-img">
            <idss-icon-svg
              :name="info.topInfo&&info.topInfo.icon||'register'"
              :style="info.topInfo&&info.topInfo.iconStyle"></idss-icon-svg>
          </span>
        </div>
        <div class="top-content-right">
          <div
            class="custom-txt wodeHide"
            :style="info.topInfo&&info.topInfo.textStyle">{{(info.topInfo&&info.topInfo.title)||'--'}}</div>
          <div
            class="custom-val wodeHide"
            :style="info.topInfo&&info.topInfo.valueStyle">{{(info.topInfo&&info.topInfo.value)||'--'}}</div>
        </div>
      </slot>
    </div>
    <!-- top内容 end -->
    <div class="bottom-content topOne-content">
      <!-- left内容 start -->
      <div
        class="bottom-content-default bottom-left"
        :style="isArrayStyle?curStyle.leftStyle:boxStyle">
        <span
          class="triange leftTriange"
          :style="leftTriange.bottomTriange">
          <span
            class="triange leftTriangeInner"
            :style="leftTriange.topTriange"></span>
        </span>
        <slot name="left">
          <div
            class="wodeHide"
            :style="info.leftInfo&&info.leftInfo.textStyle">
            <idss-icon-svg
              :style="info.leftInfo&&info.leftInfo.iconStyle"
              :name="(info.leftInfo&&info.leftInfo.icon)||'united'"></idss-icon-svg>
            {{(info.leftInfo&&info.leftInfo.title)||'--'}}
          </div>
          <div
            class="custom-linked wodeHide"
            :style="info.leftInfo&&info.leftInfo.valueStyle">{{(info.leftInfo&&info.leftInfo.value)||'--'}}</div>
        </slot>
      </div>
      <!-- left内容 end -->
      <!-- right start -->
      <div
        class="bottom-content-default bottom-right"
        :style="isArrayStyle?curStyle.rightStyle:boxStyle">
        <span
          class="triange rightTriange"
          :style="rightTriange.bottomTriange">
          <span
            class="triange rightTriangeInner"
            :style="rightTriange.topTriange"></span>
        </span>
        <slot name="right">
          <div
            class="wodeHide"
            :style="info.rightInfo&&info.rightInfo.textStyle">
            <idss-icon-svg
              :style="info.rightInfo&&info.rightInfo.iconStyle"
              :name="(info.rightInfo&&info.rightInfo.icon)||'ununited'"></idss-icon-svg>
            {{(info.rightInfo&&info.rightInfo.title)||'--'}}
          </div>
          <div
            class="custom-linking"
            :style="info.rightInfo&&info.rightInfo.valueStyle">{{(info.rightInfo&&info.rightInfo.value)||'--'}}</div>
        </slot>
      </div>
      <!-- right内容 end -->
    </div>
  </div>
</template>
<script>
/**
 * @name 带三角的框
 * @props {Object} info $$_数据项
 * @props {String} layout 布局
 * @props {Object, Array} boxStyle box的样式配置
 * @slot top 上面区域的内容
 * @slot left 左边区域的内容
 * @slot right 右边区域的内容
 */
import { IdssIconSvg } from './../commons'
export default {
  name: 'idss-triangle-box',
  components: { IdssIconSvg },
  props: {
    info: { // 页面info
      type: Object,
      default: () => ({
        topInfo: {
          title: 'top的名称',
          icon: 'register',
          value: '000'
        },
        leftInfo: {
          title: 'lefe的名称',
          icon: 'united',
          value: '000'
        },
        rightInfo: {
          title: 'right的名称',
          icon: 'ununited',
          value: '000'
        }
      })
    },
    layout: {
      type: String,
      default: '' // 控制组件布局 默认是上面一个下面两个reverse是颠倒一下
    },
    // 三个box的样式
    boxStyle: {
      type: [Array, Object],
      default: () => ({
        boxShadow: '0 0 3px 3px #2c528a'
      })
    }
  },
  computed: {
    isArrayStyle () { // 判断传的样式是否是数组
      return Array.isArray(this.boxStyle)
    },
    curStyle () {
      let data = this.boxStyle
      if (this.isArrayStyle) {
        return {
          topStyle: data[0],
          rightStyle: data[1],
          leftStyle: data[2]
        }
      } else {
        return data
      }
    },
    leftTriange () { // 左边三角形的样式处理
      let data = this.boxStyle
      if (this.isArrayStyle && data[2]) { // boxStyle是数组并且有设置left的样式
        let curItem = data[2]
        return {
          bottomTriange: this.setBottomColor(curItem),
          topTriange: this.setTopColor(curItem)
        }
      } else {
        return {
          bottomTriange: this.setBottomColor(data),
          topTriange: this.setTopColor(data)
        }
      }
    },
    rightTriange () { // 右边三角形的样式处理
      let data = this.boxStyle
      if (this.isArrayStyle && data[1]) { // boxStyle是数组并且有设置right的样式
        let curItem = data[1]
        return {
          bottomTriange: this.setBottomColor(curItem),
          topTriange: this.setTopColor(curItem)
        }
      } else {
        return {
          bottomTriange: this.setBottomColor(data),
          topTriange: this.setTopColor(data)
        }
      }
    }

  },
  created () {
  },
  methods: {
    setBottomColor (params) { // 设置大三角的颜色
      if (!params || !Object.keys(params).length) return
      let iscolor = ''
      if (params['boxShadow']) { // 如果设置了shadow 如果设置了shadow和border都设置了则取shadow的色值
        let isValue = params['boxShadow'].match(/(^|\s)((?:[^\d.-]\S+))(\s|$)/)// 捕获字符串里除了以数字、负号、点 开头的组
        iscolor = isValue ? isValue[2] : '#2c528a'   // box-shadow不设置颜色的时候取他的默认值 #2c528a
      } else if (params['border']) { // 如果设置了background
        iscolor = params['border'].split(' ')[2]
      } else {
        iscolor = 'rgba(255,255,255,0)' // 都没有设置的时候取默认值
      }
      let str = 'rgba(255,255,255,0)' + iscolor + ' rgba(255,255,255,0) rgba(255,255,255,0)'
      return {
        borderColor: str
      }
    },
    setTopColor (params) { // 设置小三角的颜色
      if (!params || !Object.keys(params).length) return
      let str = ''
      if (params['background']) { // 如果设置了background
        str = 'rgba(255,255,255,0)' + `${params['background']} ` + 'rgba(255,255,255,0) ' + 'rgba(255,255,255,0)'
      }
      return {
        borderColor: str
      }
    }
  }

}
</script>
<style lang="postcss" scoped>
.custom-box-page {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #a8c4d9;
  .top-content {
    display: flex;
    width: 70%;
    min-width: 300px;
    padding: 10px;
    border-radius: 5px;
    background: rgba(9, 23, 56, 0.7);
    .top-content-left {
      width: 46%;
      .top-content-left-img {
        display: inline-block;
        float: right;
        font-size: 42px;
        vertical-align: middle;
        .idss-svg-icon {
          fill: #57a5e5;
        }
      }
    }
    .top-content-right {
      width: 70%;
      padding-left: 10px;
      .custom-txt {
        width: 82%;
        text-align: left;
        font-size: 16px;
      }
    }
    .custom-title {
      font-size: 16px;
    }
    .custom-val {
      font-size: 26px;
      color: #57a5e5;
      font-family: "ArialMT", "Arial";
      text-align: left;
      width: 82%;
    }
  }
  .bottom-content {
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    float: left;
    .bottom-content-default {
      width: 40%;
      min-width: 130px;
      border-radius: 5px;
      background: rgba(9, 23, 56, 0.7);
      text-align: center;
      padding: 10px;
      position: relative;
      float: left;
    }
    .triange {
      display: inline-block;
      position: absolute;
      width: 0;
      height: 0;
      content: "";
      border-width: 15px;
      border-style: solid;
    }
    .bottom-left {
      .idss-svg-icon {
        fill: #44c7a7;
        transform: rotate(-53deg);
        font-size: 20px;
        width: 38px;
        vertical-align: text-top;
      }
      .custom-linked {
        font-size: 20px;
        color: #44c7a7;
        font-family: "ArialMT", "Arial";
      }
    }
    .bottom-right {
      float: right;
      .idss-svg-icon {
        fill: #dd8802;
        font-size: 20px;
        width: 38px;
        vertical-align: text-top;
      }
      .custom-linking {
        font-size: 20px;
        color: #dd8802;
        font-family: "ArialMT", "Arial";
      }
    }
  }
  .wodeHide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.normal {
  .topOne {
    margin: 0 auto 30px auto;
  }
  /* 不翻转 layout */
  .topOne-content {
    .leftTriange {
      right: 30%;
      top: -16px;
      transform: rotate(-132deg);
      border-color: transparent #2c528a transparent transparent;
    }
    .leftTriangeInner {
      left: 5px;
      z-index: 6;
      position: absolute;
      border-width: 19px 15px 0 0;
      top: -12px;
      border-color: transparent rgba(9, 23, 56, 0.7) transparent transparent;
      transform: rotate(-221deg);
    }
    .rightTriange {
      left: 30%;
      top: -16px;
      border-color: transparent #2c528a transparent transparent;
      transform: rotate(-49deg);
    }
    .rightTriangeInner {
      left: 3px;
      z-index: 6;
      position: absolute;
      border-width: 15px 19px 0 0;
      top: -5px;
      border-color: transparent rgba(9, 23, 56, 0.7) transparent transparent;
      transform: rotate(-229deg);
    }
  }
  /* layout css end */
}
/* 翻转 */

.reverse {
  display: flex;
  flex-direction: column-reverse;
  /* flex-direction: column; */
  .topOne {
    position: relative;
    margin: 30px auto 30px;
  }
  .topOne-content {
    .leftTriange {
      border-width: 0 15px 19px;
      right: 30%;
      bottom: -22px;
      transform: rotate(-2deg);
      border-color: transparent #2c528a transparent transparent;
    }
    .leftTriangeInner {
      left: -17px;
      z-index: 6;
      position: absolute;
      border-width: 0 15px 15px;
      top: -3px;
      border-color: transparent rgba(9, 23, 56, 0.7) transparent transparent;
      transform: rotate(0deg);
    }
    .rightTriange {
      left: 26%;
      bottom: -19px;
      transform: rotate(41deg);
      border-width: 15px 11px;
      border-color: transparent #2c528a transparent transparent;
    }
    .rightTriangeInner {
      left: -13px;
      z-index: 6;
      position: absolute;
      border-width: 12px 11px;
      top: -15px;
      border-color: transparent rgba(9, 23, 56, 0.7) transparent transparent;
      transform: rotate(0deg);
    }
  }
}
</style>
