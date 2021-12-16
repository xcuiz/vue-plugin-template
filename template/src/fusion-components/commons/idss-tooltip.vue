<template>
  <el-tooltip v-bind="$attrs" :disabled="disabled">
    <template v-for="(item, name) in $slots">
      <template :slot="name">
        <slot :name="name"></slot>
      </template>
    </template>
  </el-tooltip>
</template>
<script>
export default {
  name: 'idss-tooltip',
  props: {
    // 超过显示宽度时是否支持tooltip显示（需要获取元素宽度，故不支持行内样式）
    overWidthDisplay: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      disabled: false
    }
  },
  methods: {
    show () {
      // 父级disabled设置
      const propsDisabled = typeof this.$attrs.disabled === 'boolean' ? this.$attrs.disabled : false
      // 获取显示宽度
      const rWidth = this.$slots.default[0].elm.offsetWidth
      // 获取实际宽度
      const vWidth = this.$slots.default[0].elm.scrollWidth
      // 判断slot实际宽度大于显示宽度 tooltip显示
      if (!propsDisabled && this.overWidthDisplay) {
        if (rWidth < vWidth) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      } else {
        this.disabled = propsDisabled
      }
    }
  },
  mounted () {
    this.$el.addEventListener('mouseenter', this.show)
  },
  destroyed () {
    this.$el.removeEventListener('mouseenter', this.show)
  }
}
</script>
