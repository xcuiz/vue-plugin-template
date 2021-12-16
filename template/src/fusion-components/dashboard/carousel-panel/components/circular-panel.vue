<template>
  <div class="panel" :class="{ transparent: isTransparent }">
    <div class="title">
      <span class="order">
        <span class="order-number">{{ data.order }}</span>
        <img class="order-img" :src="orderSrc" />
      </span>
      <idss-tooltip :content="data.domain" placement="top">
        <span class="title-txt" v-if="data.domain">{{ data.domain }}</span>
      </idss-tooltip>
      <span class="ip" v-if="data.name">{{ data.name }}</span>
    </div>
    <div class="sub-title">
      <div class="describe">被攻击次数</div>
      <div class="number">{{ data.total }}</div>
    </div>
    <div class="main-content">
      <slot></slot>
    </div>
    <img class="panel-bg" :src="panelSrc"/>
  </div>
</template>
<script>
import panelImg from '../assets/images/circular-panel.png'
import orderSrc from '../assets/images/number.png'
import { IdssTooltip } from './../../../commons'
export default {
  name: 'circular-panel',
  components: { IdssTooltip },
  props: {
    panelSrc: {
      type: String,
      default: panelImg
    },
    data: {
      type: Object,
      default () {
        return {
          order: 1,
          title: '',
          dstip: '',
          total: 0
        }
      }
    }
  },
  data () {
    return {
      orderSrc: orderSrc,
      isTransparent: true
    }
  },
  methods: {
    /**
     * 设置透明度
     * @param { Boolean } hasOpacity 是否有透明度
     */
    setTransparent (hasOpacity) {
      this.isTransparent = hasOpacity
    }
  }
}
</script>
<style scoped lang="postcss">
@keyframes animate-transparent {
  0% {
    background: linear-gradient(rgba(44, 123, 198, 1), rgba(9, 31, 83, 1));
  }
  25% {
    background: linear-gradient(rgba(44, 123, 198, 1), rgba(9, 31, 83, 0.75));
  }
  50% {
    background: linear-gradient(rgba(44, 123, 198, 1), rgba(9, 31, 83, 0.5));
  }
  75% {
    background: linear-gradient(rgba(44, 123, 198, 1), rgba(9, 31, 83, 0.25));
  }
  100% {
    background: linear-gradient(rgba(44, 123, 198, 1), rgba(9, 31, 83, 0.15));
  }
}
div.transparent {
  animation-name: animate-transparent;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  background: linear-gradient(rgba(44, 123, 198, 0.15), rgba(9, 31, 83, 0.15));
}
.panel {
  position: relative;
  margin: auto;
  /* width: 256px;
  height: 347px; */
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(44, 123, 198, 1), rgba(9, 31, 83, 1));
  .title {
    position: relative;
    text-align: left;
    height: 50px;
    z-index: 10;
    color: #fff;
    .order-number {
      display: inline-block;
      width: 26px;
      height: 26px;
      line-height: 26px;
      color: #000000;
      font-size: 18px;
      position: absolute;
      text-align: center;
      font-weight: bolder;
    }
    .order-img {
      display: inline-block;
      width: 26px;
      height: 26px;
    }
    .order {
      position: absolute;
      top: 12px;
      left: 14px;
      display: inline-block;
    }
    .title-txt {
      display: inline-block;
      font-size: 18px;
      padding-left: 47px;
      padding-right: 6px;
      line-height: 50px;
      vertical-align: text-bottom;
      white-space: nowrap;
      width: 210px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ip {
      position: absolute;
      left: 47px;
      top: 34px;
    }
  }
  .sub-title {
    text-align: center;
    z-index: 10;
    font-size: 18px;
    color: #fff;
    margin-top: 16px;
    .number {
      font-size: 40px;
      font-weight: bolder;
    }
  }
  .main-content {
    position: absolute;
    top: 150px;
    bottom: 0;
    width: 100%;
    z-index: 10;
    font-size: 14px;
    color: #fff;
  }
  .panel-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }
}
</style>
