import 'echarts/lib/component/geo'
import Container from '../container'
export default {
  extends: Container,
  props: {
    // @propCnName 控制在地图中，label
    label: [Boolean, Object, Function],
    keepAnimate: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    initDefaultOption () {
      return {
        tooltip: {
          trigger: 'item'
        }
      }
    }
  }
}
