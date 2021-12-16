<template>
  <div class="app-header-container">
    <!-- <div> -->
    <router-link to="/index">
      <div class="logo-container idss-layout--marginL">
        <!-- <img class="logo" :src="logo" alt="" /> -->
        <idss-icon-svg class="logo" name="ChinaMobile-2"></idss-icon-svg>
        <!-- <span class="title">{{ projectIcon$$.title }}</span> -->
        <span class="title">浙江移动数据治理中心</span>
      </div>

      <!-- <img class="logo idss-layout--marginL" :src="logo"  /> -->
    </router-link>
    <!-- <span class="title">UEBA分析平台</span> -->
    <!-- </div> -->
    <!---->
    <!-- <img :src="projectIcon$$" alt=""> -->
    <div class="idss-header-right">
      <app-menu :is-menu-open="isMenuOpen"></app-menu>
      <!-- 全局时间控件 -->
      <!-- 暂时屏蔽 -->
      <app-time-select v-if="false"></app-time-select>
      <!-- 消息提醒 -->
    </div>
    <!-- 消息提示弹窗 -->
    <msg-notify
      @unreadMsgCount="(count) => (unreadMsgCount = count)"
    ></msg-notify>
    <!-- 用户信息 -->
    <!-- <idss-user-info :visible.sync="infoDialogVisible"></idss-user-info> -->
    <!-- 修改密码 -->
    <change-pass-dialog
      v-if="changePassVisible"
      :visible.sync="changePassVisible"
    ></change-pass-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import MsgNotify from "@/views/user/msg-components/msg-notify";
// import IdssUserInfo from '@/views/user/user-info.vue'
import userMixins from "@/mixins/userMixins";
// import BusFactory, { EventName } from '@/fusion-components/util/bus.js'

export default {
  name: "AppHeader",
  components: {
    MsgNotify,
    ChangePassDialog: () =>
      import("@/views/user/components/ChangePassDialog.vue"),
    // IdssUserInfo
  },
  mixins: [userMixins],
  data() {
    return {
      unreadMsgCount: 0,
      changePassVisible: false,
      // infoDialogVisible: false,
      passwordCollapse: false,
      isMenuOpen: true,
      timer: null,
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo$$", "projectIcon$$"]),
    ...mapState("system", ["message"]),
  },
  mounted() {
    // this.getMessageNum();
    // this.timer = setInterval(() => {
    //   this.getMessageNum();
    // }, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions("system", ["getMessageNum"]),
    /**
     * 退出系统
     */
    handleLogout() {
      this.$confirm("确认要退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.logout();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
  // created() {
  //   bus = BusFactory(this)
  //   bus.$on(EventName.MENU_TOGGLE_STATUS, (isMenuOpen) => {
  //     this.isMenuOpen = isMenuOpen
  //   })
  // }
};
</script>

<style lang="postcss">
.el-dropdown-menu.user-account-dropdown-menu.el-popper {
  z-index: var(--app-menu-z-index);
  --app-menu-item-sub-height: 32px;
  --app-menu-item-sub-bg: var(--guan-10-a80);
  --app-menu-item-sub-bg-hover: var(--guan-highlight-6-a40);

  background-color: var(--app-menu-item-sub-bg);
  &.el-popper[x-placement^="bottom"] {
    margin-top: 6px;
    border-radius: 0;
    border: 0;
  }
  &[x-placement^="bottom"] {
    .popper__arrow {
      display: none;
      &::after {
        display: none;
      }
    }
  }

  .el-dropdown-menu__item {
    height: var(--app-menu-item-sub-height);
    color: #fff;
    &:not(.is-disabled):hover {
      background-color: var(--app-menu-item-sub-bg-hover);
      color: #fff;
    }
    &.selected {
      background-color: var(--app-menu-item-sub-bg-hover);
    }
    a {
      color: #fff;
    }
  }
}
</style>
<style scoped lang="postcss">
/* @import 'common.css'; */
.app-header-container {
  --header-bg: linear-gradient(135deg, var(--guan-8), var(--guan-7));
  --header-border: solid var(--line-size-default);
  --header-border-image: linear-gradient(var(--guan-8), var(--guan-7)) 30;
  --header-z-index: var(--zindex-header);
  --header-title-font-size: var(--font-size-1);
  --header-title-color: var(--light-gray-1);
  --header-title-shadow: 0px 1px 2px var(--guan-highlight-8);
  --header-icon-color: var(--light-gray-1-a60);
  --header-icon-color-hover: var(--light-gray-1);
  --header-icon-item-border: var(--guan-8) solid var(--line-size-default);
  --header-icon-item-shadow: inset 1px 0 0 var(--guan-6);

  border: 0px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: var(--header-z-index);
  height: inherit;
  width: 100%;
  background: var(--guan-dark-6);
  /* border: var(--header-border); */
  border-image: var(--header-border-image);
  .logo-container {
    display: table-cell;
    vertical-align: middle;
    min-width: 304px;
    .logo {
      width: 102px;
      height: 28px;
      margin: 0 6px 0 16px;
      vertical-align: inherit;
      color: #fff;
      fill: #fff;
    }
    .title {
      position: relative;
      display: inline-block;
      height: var(--header-height);
      line-height: var(--header-height);
      vertical-align: middle;
      box-sizing: border-box;
      /* font-size: var(--header-text-size);
      color: var(--header-text-color); */
      color: var(--header-title-color);
      -webkit-background-clip: text;
      text-shadow: var(--header-title-shadow);
      /* font-size: var(--font-size-2); */
      font-weight: 700;
      font-size: 18px;
    }
  }
  .idss-header-right {
    display: flex;
    color: #ffffff;
    align-items: center;
    & .idss-layout--marginR {
      padding: 0px 15px 0 24px;
      cursor: pointer;
      span {
        margin-right: 10px;
        color: var(--white);
      }
      i {
        color: var(--white);
      }
    }
  }
  .info {
    &:after {
      clear: both;
    }
    li {
      &:hover {
        .idss-svg-icon {
          fill: var(--header-icon-color-hover);
        }
      }
      width: 50px;
      height: 50px;
      float: left;
      border: 0;
      border-left: var(--header-icon-item-border);
      box-shadow: var(--header-icon-item-shadow);
      box-sizing: border-box;
      cursor: pointer;
      .el-dropdown {
        width: 100%;
        height: 100%;
      }
      .el-dropdown-link {
        width: 100%;
        height: 100%;
        position: relative;
        display: block;
      }
      .el-badge {
        position: absolute;
        top: 30%;
        right: 30%;
      }
      .idss-svg-icon {
        width: 100%;
        height: 100%;
        padding: 32%;
        fill: var(--header-icon-color);
      }
    }
  }
}
.idss-svg-icon.icon {
  fill: #fff;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
</style>
