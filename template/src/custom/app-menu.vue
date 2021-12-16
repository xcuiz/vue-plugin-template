<template>
  <div class="app-menu-container">
    <el-menu
      :default-active="currentMenu"
      :collapse="!isMenuOpen"
      mode="horizontal"
      menu-trigger="hover"
      :show-timeout="50"
      :hide-timeout="0"
      @select="select"
    >
      <app-menu-template :menus="menus" :is-root="true"></app-menu-template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "AppMenu",
  props: {
    isMenuOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      currentMenu: "",
    };
  },
  computed: {
    menus() {
      let menus = JSON.parse(
        JSON.stringify(this.$store.state.permission.menuList)
      );
      // 3级路由不展示
      menus.map((item) => {
        if (item.children) {
          item.children.map((itemI) => {
            if (itemI.children) itemI.children = null;
          });
        }
      });
      return menus;
    },
  },
  watch: {
    $route: {
      deep: true,
      handler: function (val) {
        this.currentMenu = val.name;
        // 如果当前路由已经超过2级，则，默认选中对应的2级路由
        if (val.matched.length > 2) {
          this.currentMenu = val.matched[1].name;
        }
      },
      immediate: true,
    },
  },
  methods: {
    select(name) {
      // @FIXME 修复路由超出最大数量之后，被选中菜单仍然高亮的bug，使用特殊方式，让currentMenu触发element的watch更新activeIndex方法
      this.currentMenu = name;
      // 判断当前tag数量满足最大条件
      // if (this.$store.state.tagsView.visitedViews.length >= this.$store.getters['base/globalConfig$$']('TAGS_VIEW_MAX_CACHE_LIMIT')) {
      //   this.$nextTick(() => {
      //     this.currentMenu = this.$route.name
      //   })
      // }
      // catch 防止跳转到同一个路由时在控制台显示错误信息
      const cb = this.$router.push({ name: name });

      // 对于支持Promise的环境,vue-router的push函数返回一个Promise
      if (cb instanceof Promise) {
        cb.catch((e) => e);
      }
    },
  },
};
</script>

<style scoped lang="postcss">
.app-menu-container {
  width: auto;
  height: 46px;
  display: inline-block;
  --app-menu-z-index: var(--zindex-menu);
  /* --app-menu-container-bg: linear-gradient(
    180deg,
    var(--guan-8),
    var(--guan-7)
  ); */
  /* --app-menu-container-border: var(--guan-7) solid var(--line-size-default); */
  /* 菜单全局变量 */
  --app-menu-shadow: inset 0 1px 0 var(--guan-6);
  --app-menu-color: var(--light-gray-1); /* 文字、图标颜色一样 */
  --app-menu-color-hover: var(--color-font-5); /* 文字、图标颜色一样 */
  --app-menu-text-hover-shadow: 0px 1px 2px var(--guan-highlight-8);
  --app-menu-font-size: var(--font-size-4);
  /* 一级菜单 */
  --app-menu-item-height: 46px;
  /* --app-menu-item-bg: var(--guan-6-a20); */
  /* --app-menu-item-bg-hover: linear-gradient(
    0deg,
    var(--guan-highlight-7),
    var(--guan-highlight-6)
  ); */
  --app-menu-item-bg-hover: var(--guan-highlight-6);
  /* --app-menu-item-border: var(--guan-6-a40) solid var(--line-size-default); */
  /* 子菜单 */
  --app-menu-item-sub-height: 32px;
  --app-menu-item-sub-bg: var(--guan-10-a80);
  --app-menu-item-sub-bg-hover: var(--guan-highlight-6-a40);
  /* --app-menu-item-sub-border: var(--guan-10-a80) solid var(--line-size-default);
  --app-menu-item-sub-border-hover: var(--guan-highlight-6-a40) solid
    var(--line-size-default); */
  --app-menu-item-tooltip-color: var(--guan-highlight-3);
  z-index: var(--app-menu-z-index);
  & .el-menu {
    height: inherit;
    border-right: var(--app-menu-container-border);
    /* background: var(--app-menu-container-bg); */
    &.el-menu--collapse {
      width: 62px; /* 收起状态 */
    }
    &:not(.el-menu--collapse) {
      /* width: 180px; 展开状态 */
    }
    div {
      outline: none;
      display: flex;
      align-items: center;
      height: 46px;
    }
    &.el-menu--horizontal {
      border-bottom: none;
    }
  }
}
</style>
