<template>
  <span class="paragraph">{{time}}</span>
</template>
<script>
import { formatDate } from 'fusion-utils'

/**
 * @name 电子时钟
 * @type basis
 */
export default {
  name: 'idss-clock',
  props: {
    valueFormat: {// 默认时间格式为'yyyy-MM-dd hh:mm'
      type: String,
      default: 'yyyy-MM-dd hh:mm'
    },
    interval: {// 默认刷新时间60m
      type: Number,
      default: 60
    }
  },
  data () {
    return {
      time: ''
    }
  },
  methods: {
    parseTime () {
      this.time = formatDate.call(new Date(), this.valueFormat)
    }
  },
  created () {
    this.parseTime()
    this.timer = setInterval(_ => { // 每隔一秒调用一次显示实时时间
      this.parseTime()
    }, 1000 * this.interval)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style scoped>
/* 引入字体 */
/* @font-face {
  font-family: "DS-DIGI";
  src: url("/fonts/DS-DIGI.TTF");
} */
.paragraph {
  font-family: "DS-DIGI";
  font-size: 32px;
  color: rgb(77, 165, 248);
}
</style>
