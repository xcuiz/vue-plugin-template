<template>
  <!-- 插槽内容 start -->
  <div class="custom-list">
    <slot name="content">
      <!-- title插槽内容 end -->
      <slot name="title">
        <span
          class="custom-li-title"
          :style="titleStyle">{{dataItem.title}}</span>
      </slot>
      <!-- title插槽内容 end -->
      <ul class="custom-list-ul">
        <li
          class="custom-list-li"
          :style="isArrayStyle?itemStyle[ind]&&itemStyle[ind].groupStyle:itemStyle&&itemStyle.groupStyle"
          v-for="(val,ind) in dataItem.itemList"
          :key='ind'>
          <span
            :style="isArrayStyle?itemStyle[ind]&&itemStyle[ind].textStyle:itemStyle&&itemStyle.textStyle"
            class="custom-li-name">{{val.name}}</span>
          <span
            :style="isArrayStyle?itemStyle[ind]&&itemStyle[ind].valueStyle:itemStyle&&itemStyle.valueStyle"
            class="custom-li-value">{{val.value}}</span>
        </li>
      </ul>
    </slot>
  </div>
</template>
<script>
/**
 * @name 列表项
 * @props {Object} dataItem $$_数据项
 * @props {Object} titleStyle 标题的样式配置
 * @props {Object, Array} itemStyle 数值的样式配置
 * @slot content 整条列的内容
 * @slot title 左边标题的内容
 */
export default {
  name: 'idss-list-item',
  props: {
    // list 标题的样式
    titleStyle: {
      type: Object,
      default: () => ({})
    },
    // list 右侧的样式
    itemStyle: {
      type: [Array, Object]
    },
    dataItem: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  computed: {
    isArrayStyle () { // 判断传的样式是否是数组
      return Array.isArray(this.itemStyle)
    }
  },
  data () {
    return {

    }
  },
  methods: {

  },
  created () {
  }
}
</script>
<style lang="postcss" scoped>
.custom-list {
  width: 100%;
  height: 40px;
  border: 1px solid rgba(105, 175, 255, 0.3);
  border-radius: 5px;
  font-size: 16px;
  background-color: rgba(105, 175, 255, 0.1);
  display: flex;

  .custom-li-title {
    width: 20%;
    min-width: 100px;
    line-height: 40px;
    height: 100%;
    padding: 0 5px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    border-radius: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background: linear-gradient(to top, #084cc2, #3d8df5);
  }
  .custom-list-ul {
    padding: 0;
    margin: 0;
    list-style: none;
    height: 100%;
    width: 80%;
    width: calc(100% - 21%);
    display: flex;
    justify-content: space-around;
    align-items: center;
    .custom-list-li {
      width: 33%;
      display: flex;
    }
    .custom-li-name {
      line-height: 40px;
      height: 40px;
      color: #a8c4d9;
      display: inline-block;
      width: 20%;
      min-width: 40px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .custom-li-value {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      width: 20%;
      width: calc(100% - 46%);
      min-width: calc(100% - 40px);
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #0099ff;
      font-size: 20px;
      font-weight: 650;
      font-family: "ArialMT", "Arial";
    }
  }
}
</style>
