import service from '../tmpl-service.js'
import { formatNumber } from '../../../../filters'
export default {
  mixins: [service],
  filters: {
    formatNumber
  },
  props: {
    data: {
      type: Object,
      default () {
        return {
          name: '',
          unit: '',
          value: '',
          percent: '',
          percentName: ''
        }
      }
    },
    // 百分比进度宽度
    width: {
      type: Number,
      default: 70
    },
    // 百分比边框宽度
    strokeWidth: {
      type: Number,
      default: 3
    },
    strokeColor: {
      type: String,
      defaut: ''
    },
    // 描述样式
    descStyle: {
      type: Object,
      default: () => ({})
    },
    // 标题样式
    nameStyle: {
      type: Object,
      default: () => ({})
    },
    // 值样式
    valueStyle: {
      type: Object,
      default: () => ({})
    },
    // 是否展示外边框
    isHiddenBorder: {
      type: Boolean,
      default: false
    }
  }
}
