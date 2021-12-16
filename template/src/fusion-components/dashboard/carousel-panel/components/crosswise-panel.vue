<template>
  <div class="panel" @click="clickEvent">
    <div class="title">
      <span class="order">{{data.order}}</span>
      <img class="order-img" :src="require(`../assets/images/number.png`)" />
      <span class="title-txt">{{data.title}}</span>
    </div>
    <div class="sub-title">
      <div class="number">被攻击 {{data.total}} 次</div>
    </div>
    <div class="main-content">
      <idss-honeycomb-chart :data="data"></idss-honeycomb-chart>
    </div>
  </div>
</template>
<script>
import { IdssHoneycombChart } from './../../index.js'
export default {
  name: 'crosswise-panel',
  components: { IdssHoneycombChart },
  props: {
    data: {
      type: Object,
      default () {
        return {
          order: 0,
          title: '',
          total: 0,
          data: []
        }
      }
    }
  },
  methods: {
    clickEvent () {
      this.$emit('clickChild', this.data)
    }
  }
}
</script>
<style scoped lang="postcss">
.panel {
  cursor: pointer;
  height: 100%;
  width: 100%;
  position: relative;
  margin: auto;
  text-align: center;
  .title {
    position: absolute;
    z-index: 20;
    left: 40px;
    top: 34px;
    color: #fff;
    .order {
      font-size: 18px;
      font-weight: bold;
      color: #000000;
    }
    .title-txt {
      font-size: 18px;
      padding: 0 14px;
    }
    .order-img {
      position: absolute;
      left: -8px;
      top: -1px;
      z-index: -1;
    }
  }
  .sub-title {
    position: absolute;
    top: 70px;
    z-index: 20;
    left: 66px;
    font-size: 18px;
    color: #fff;
    text-align: left;
  }
  .main-content {
    position: absolute;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    font-size: 14px;
    border-radius: 5px;
    border: 2px solid #5b8ecf;
    color: #fff;
    background: linear-gradient(to top, rgb(15, 42, 96, .8), rgba(43, 112, 178, .8));
  }
}
</style>
