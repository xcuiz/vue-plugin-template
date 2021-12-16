import stepsViewLayout from '../layout/steps-view-layout.vue'
export default {
  components: {
    stepsViewLayout
  },
  props: {
    config: {
      type: Object,
      default () {
        return {
          iconNames: [] // 自定义 slot='icon' 的样式
        }
      }
    }
  },
  computed: {
    isIconSlot () {
      return Array.isArray(this.config.iconNames) && this.config.iconNames.length
    }
  }
}
