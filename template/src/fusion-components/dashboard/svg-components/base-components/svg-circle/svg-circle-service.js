export default {
  props: {
    // @propCnName 基色
    color: {
      type: String,
      default: '#156ae7'
    }
  },
  data () {
    return {
      key: Date.now()
    }
  },
  computed: {
    colorList: function () {
      return this.generate(this.color)
    }
  }
}
