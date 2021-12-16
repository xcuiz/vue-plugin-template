import service from '../tmpl-service.js'
import { IdssTooltip } from './../../../index.js'
export default {
  mixins: [service],
  components: { IdssTooltip },
  props: {
    // @propIsApi
    data: {
      type: Object,
      default () {
        return {
          title: '',
          value: ''
        }
      }
    },
    active: {
      type: Boolean,
      default: false
    },
    arrow: {
      type: String,
      default: ''
    },
    // 标题样式
    titleStyle: {
      type: Object,
      default: () => ({})
    },
    // value样式
    valueStyle: {
      type: Object,
      default: () => ({})
    },
    // 描述样式
    descStyle: {
      type: Object,
      default: () => ({})
    },
    // 是否展示外边框
    isHiddenBorder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className () {
      return [
        this.active ? 'active' : '',
        this.arrow ? `arrow-${this.arrow}` : '',
        this.isHiddenBorder ? 'no-border' : ''
      ].join(' ')
    }
  }
}
