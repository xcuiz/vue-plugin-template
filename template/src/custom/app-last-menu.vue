<!--
 * @Author: your name
 * @Date: 2020-07-14 10:21:06
 * @LastEditTime: 2021-12-16 13:54:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/insight/user/pages/list/pages/index.vue
-->
<template>
  <el-container class="slide-menu-container">
    <el-aside class="slide-menu-content" width="auto">
      <el-menu
        text-color="#7B8CA1"
        active-text-color="#4a90e2"
        background-color="#E0E4EA"
        style="width: 46px"
        :collapse-transition="false"
        :default-active="currentPath"
        class="el-menu-vertical-content"
        :collapse="isCollapse"
      >
        <el-menu-item
          v-for="item in slideMenuList"
          :key="item.name"
          :index="item.name"
          @click.native="handleClick(item.name)"
        >
          <!-- <i class="el-icon-menu"></i> -->
          <idss-icon-svg :name="item.icon || 'home'" />

          <span slot="title">{{ item.meta && item.meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
const recursion = (data, current) => {
  let result = null;
  if (!data) {
    return;
  }
  for (let i in data) {
    if (result !== null) {
      break;
    }
    let item = data[i];
    if (item.name === current) {
      result = item;
      break;
    } else if (item.children && item.children.length > 0) {
      result = recursion(item.children, current);
    }
  }
  return result;
};
export default {
  name: "AppLastMenu",
  data() {
    return {
      isCollapse: true,
      currentPath: "",
      slideMenuList: [],
    };
  },
  computed: {
    ...mapState("permission", ["menuList"]),
  },
  watch: {
    $route: {
      handler() {
        let parentPathName = "";
        let matched = this.$route.matched.filter((item) => item.name);
        // let breadcrumb = this.$route.meta && this.$route.meta.breadcrumb
        // debugger
        if (matched.length >= 3) {
          // 详情页面与列表页面必须同级即都为3级
          // 详情页面面包屑有4级
          // 详情面包屑3级必然有上一级路由的name
          this.currentPath = matched[2].name;
          parentPathName = matched[2].parent ? matched[2].parent.name : "";
        }
        // 1.遍历查找对应二级菜单所对应的三级列表
        // 2. 过滤掉hidden为true的菜单
        let tempList = recursion(this.menuList, parentPathName)
          ? recursion(this.menuList, parentPathName).children
          : [];
        // 根据lastMenuTag区分末级菜单
        let list = tempList.filter(
          (item) => !item.meta || item.meta.lastMenuTag
        );
        this.slideMenuList = list;
      },
      immediate: true,
    },
  },
  methods: {
    handleClick(name) {
      this.$router.push({ name: name });
    },
  },
};
</script>

<style lang="postcss" scoped>
.slide-menu-container {
  position: fixed;
  left: 0;
  top: 78px;
  height: 100%;
  z-index: 1600;
  .slide-menu-content {
    background-color: #e0e4ea;
    .el-menu-vertical-content {
      padding: 0 !important;
      .el-menu-item {
        width: 46px;
        padding: 0 !important;
        font-size: var(--font-size-default);
        height: 52px;
        line-height: 52px;
        text-align: center;
        .idss-svg-icon {
          width: 24px;
          fill: #7b8ca1;
          height: 21px;
          vertical-align: middle;
        }
        >>> .el-tooltip {
          padding: 0 !important;
        }
        > div {
          padding: 0 !important;
        }
        &:hover {
          background: none !important;
          /* i {
            color: #4a90e2;
          } */
          .idss-svg-icon {
            width: 24px;
            fill: #4a90e2;
          }
        }
        &.is-active {
          background: rgba(74, 144, 226, 1) !important;
          .idss-svg-icon {
            width: 24px;
            fill: #fff;
          }
        }
      }
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    /* width: 200px;
    min-height: 400px; */
  }
  .el-main {
    height: 100%;
    overflow: auto;
    padding: 0;
  }
}
</style>
