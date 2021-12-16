<template>
  <div class="app-navigator" :class="{ 'menu--collapse': !isMenuOpen }">
    <div
      class="feature"
      :class="isMenuOpen ? 'expand' : 'retract'"
      @click="toggleMenuStatus"
    >
      <idss-icon-svg :name="isMenuOpen ? 'pack-up' : 'spread'"></idss-icon-svg>
    </div>
    <div class="tag-view">
      <app-tags-view></app-tags-view>
    </div>
  </div>
</template>

<script>
import BusFactory, { EventName } from "@/fusion-components/util/bus.js";
let bus;
export default {
  name: "AppNavigator",
  data() {
    return {
      isMenuOpen: true,
    };
  },
  created() {
    bus = BusFactory(this);
  },
  methods: {
    toggleMenuStatus() {
      this.isMenuOpen = !this.isMenuOpen;
      bus.$emit(EventName.MENU_TOGGLE_STATUS, this.isMenuOpen);
    },
  },
};
</script>

<style scoped lang="postcss">
.app-navigator {
  --app-navigator-bg: var(--light-gray-2-a90);
  --app-navigator-shadow: var(--shadow-default);
  --app-navigator-z-index: var(--zindex-header);
  --app-navigator-transition: left var(--transition-duration)
    var(--transition-timing-function);
  --app-navigator-feature-border: var(--light-gray-3) solid
    var(--line-size-default);
  --app-navigator-feature-color: var(--guan-gray-7);
  --app-navigator-feature-color-hover: var(--guan-6);

  display: flex;
  position: fixed;
  top: 50px;
  left: 62px;
  right: 0;
  z-index: var(--app-navigator-z-index);
  width: inherit;
  height: inherit;
  padding: 0 20px 0 0;
  background: var(--app-navigator-bg);
  box-shadow: var(--app-navigator-shadow);
  transition: var(--app-navigator-transition);
  will-change: left;

  /* menu展开时 */
  &:not(.menu--collapse) {
    left: 180px;
  }
  .tag-view {
    flex: 1;
  }
  .feature {
    width: 45px;
    height: 45px;
    cursor: pointer;
    border-right: var(--app-navigator-feature-border);
    .idss-svg-icon {
      width: 100%;
      height: 100%;
      padding: 30%;
      box-sizing: border-box;
      fill: var(--app-navigator-feature-color);
    }
    &:hover,
    &.retract {
      .idss-svg-icon {
        fill: var(--app-navigator-feature-color-hover);
      }
    }
  }
}
</style>
