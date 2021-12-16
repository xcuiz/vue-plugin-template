<template>
  <div :class="slideClass">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'idss-swiper-slide',
  data () {
    return {
      slideClass: 'swiper-slide'
    }
  },
  mounted () {
    if (this.$parent && this.$parent.options && this.$parent.options.slideClass) {
      this.slideClass = this.$parent.options.slideClass
    }
  },
  methods: {
  }
}
</script>
