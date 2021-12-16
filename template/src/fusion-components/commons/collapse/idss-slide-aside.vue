<template>
  <div class="idss-slide-aside" :style="{'min-height': minHeight, 'height': height}">
    <main
      class="idss-slide-aside__main"
      :class="{'is-left': left, 'is-active': isActive, 'is-stretch': stretch}"
      :style="mainStyleObj">
      <slot></slot>
    </main>
    <aside
      class="idss-slide-aside__aside"
      :class="{'is-left': left, 'is-active': isActive, 'is-stretch': stretch}"
      :style="asideStyleObj">
      <span v-if="handle" class="handle" @click="isActive = !isActive">
        <idss-icon-svg name="arrow-left"></idss-icon-svg>
      </span>
      <slot name="aside"></slot>
    </aside>
  </div>
</template>
<script>
import { IdssIconSvg } from './../index.js'
export default {
  name: 'idss-slide-aside',
  components: {
    IdssIconSvg
  },
  props: {
    /* 是否显示侧边栏 */
    value: {
      type: Boolean,
      default: false
    },
    /* 是否拉伸 */
    stretch: {
      type: Boolean,
      default: false
    },
    /* 侧边栏方向 */
    left: {
      type: Boolean,
      default: false
    },
    /* 侧边栏宽度 */
    width: {
      type: String,
      default: '30%'
    },
    /* 最小高度 */
    minHeight: {
      type: String,
      default: '300px'
    },
    /* 高度 */
    height: String,
    mainStyle: Object,
    asideStyle: Object,
    /* 是否显示手柄 */
    handle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isActive: this.value,
      marginLeft: 0,
      marginRight: 0,
      classesObj: {
        'is-left': this.left,
        'is-active': this.isActive,
        'is-stretch': this.stretch
      },
      asideStyleObj: {
        'width': this.width,
        ...this.asideStyle
      }
    }
  },
  computed: {
    mainStyleObj () {
      return {
        'marginLeft': this.marginLeft,
        'marginRight': this.marginRight,
        ...this.mainStyle
      }
    }
  },
  watch: {
    value: function (newValue) {
      this.isActive = newValue
    },
    isActive: {
      immediate: true,
      handler: function () {
        this.slide()
        this.$emit('input', this.isActive)
      }
    }
  },
  methods: {
    slide () {
      this.marginRight = this.isActive ? this.width : 0
      if (this.left) { // 左侧滑出
        this.marginRight = 0
        this.marginLeft = this.isActive ? this.width : 0
      }
    }
  }
}
</script>
<style scoped lang="postcss">
.idss-slide-aside {
  position: relative;
  overflow: hidden;

  /* 主区域 */
  &__main {
    padding-right: 20px;
    transition: margin 250ms ease-out;
    will-change: margin;

    &.is-active {
      padding-right: 10px;
    }

    &.is-stretch {
      height: 100%;
    }

    &.is-left {
      padding-right: 0;
      padding-left: 20px;

      &.is-active {
        padding-left: 10px;
      }
    }
  }

  /* 收起区域：默认右侧收起 */
  &__aside {
    position: absolute;
    top: 0;
    right: -1px;
    min-height: 300px;
    background-color: var(--color-bg-5,#fff);
    border-radius: 2px;
    transform: translateX(100%);
    transition: transform 250ms ease-out;

    /* 激活的状态 */
    &.is-active {
      transform: translateX(0);
      box-shadow: 1px 2px 5px var(--light-gray-5,#ccc);

      & > .handle {
        left: 10px;
        & svg {
          transform: rotate(180deg);
        }
      }
    }

    /* 拉伸 */
    &.is-stretch {
      /* height: 100%; */
      bottom: 10px;
    }

    /* 手柄 */
    & > .handle {
      position: absolute;
      top: 0;
      left: 0;
      height: 30px;
      background-color: var(--color-bg-5,#fff);
      cursor: pointer;
      padding: 5px 2px;
      transform: translateX(-100%);
      border-radius: 2px;

      & svg {
        width: 14px;
        height: 14px;
        vertical-align: -3px;
      }
    }

    /* 左侧收起的状态 */
    &.is-left {
      left: -1px;
      transform: translateX(-100%);

      & > .handle {
        right: 0;
        left: auto;
        transform: translateX(100%) rotate(180deg);
      }

      &.is-active {
        transform: translateX(0);
        & > .handle {
          left: auto;
          right: 10px;
        }
      }
    }
  }
}
</style>
