<!--
 * @Author: your name
 * @Date: 2020-07-29 14:42:34
 * @LastEditTime: 2021-05-24 19:12:13
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/layout/layout.vue
-->
<template>
  <el-container>
    <PortalDragMenu :portal-origin-url="PORTAL_ORIGIN_URL" :ticket="ticket" />
    <el-header>
      <app-header></app-header>
    </el-header>
    <el-container>
      <el-main>
        <breadcrumb class="breadcrumb-container"></breadcrumb>
        <app-main v-if="isSinglePage"></app-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import PortalDragMenu from "portal-bar/lib/portal-bar.core.umd.js";
import Breadcrumb from "@/fusion-components/Breadcrumb";
import { PORTAL_ORIGIN_URL } from "@/portal.config";
import Cookies from "js-cookie";
// import BusFactory, { EventName } from '@/fusion-components/util/bus.js'
// let bus
export default {
  name: "Layout",
  components: {
    Breadcrumb,
    PortalDragMenu,
  },
  data() {
    return {
      isSinglePage: true,
      PORTAL_ORIGIN_URL,
      ticket: Cookies.get("ticket"),
    };
  },
  created() {
    if (this.$slots.default && this.$slots.default.length) {
      this.isSinglePage = false;
    }
  },
  // data () {
  //   return {
  //     isMenuOpen: true
  //   }
  // },
  // created () {
  //   bus = BusFactory(this)
  //   bus.$on(EventName.MENU_TOGGLE_STATUS, (isMenuOpen) => {
  //     this.isMenuOpen = isMenuOpen
  //   })
  // }
};
</script>

<style scoped lang="postcss">
.el-container {
  min-height: 100%;
  .el-header {
    padding: 0;
    height: 46px !important; /* 覆盖el-header动态添加的高度 */
  }
  .el-container {
    .el-aside {
      width: 62px !important; /* 覆盖el-aside动态添加的高度 */
      transition: width var(--transition-duration)
        var(--transition-timing-function);
      will-change: width;
    }
    .el-aside:not(.menu--collapse) {
      width: 180px !important; /* 覆盖el-aside动态添加的高度 */
    }
    .el-main {
      padding: 0;
      display: flex;
      flex-direction: column;
      .navigator {
        height: 45px;
      }
    }
  }
}
</style>
