/**
 * 作为通用暂无数据的基础util引入
 */
import Vue from 'vue'
// 获取vue原型上 empty config配置
const emptyConfig = Vue.prototype.$COMPONENTS_CONFIG && Vue.prototype.$COMPONENTS_CONFIG.empty
  ? Vue.prototype.$COMPONENTS_CONFIG.empty
  : {}
export default {
  props: {
    // @propCnName 暂无数据默认展示文本
    emptyText: {
      type: String,
      default: () => emptyConfig.text ? emptyConfig.text : '暂无数据'
    },
    // @propCnName 暂无数据默认展示图标
    emptyIcon: {
      type: String,
      // 读取vue全局empty配置
      default: () => emptyConfig.icon ? emptyConfig.icon : 'zanwushuju'
    },
    // @propCnName 暂无数据自定义样式
    emptyCustomClass: {
      type: String,
      default: ''
    }
  },
  methods: {
    createEmptyDom () {
      const _this = this
      // 判断empty slot是否存在
      let emptySlot = this.$slots.empty
      // 处理empty slot 为空的情况
      if (emptySlot && Array.isArray(emptySlot)) {
        emptySlot = emptySlot[0]
      }
      return new Vue({
        el: this.$refs.empty,
        render () {
          return <div class={[_this.emptyCustomClass, 'idss-empty']}>
            {emptySlot}
            {!emptySlot && _this.emptyIcon ? <idss-icon-svg name={_this.emptyIcon}></idss-icon-svg> : ''}
            {!emptySlot && _this.emptyText ? <span>{_this.emptyText}</span> : ''}
          </div>
        }
      }).$mount()
    }
  }
}
