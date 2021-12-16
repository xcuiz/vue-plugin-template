<!--
 * @Author: your name
 * @Date: 2020-06-17 16:26:12
 * @LastEditTime: 2020-07-24 16:18:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/custom/slide-menu.vue
-->
<template>
  <el-container class="slide-menu-container">
    <el-aside class="slide-menu-content" width="auto">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group> -->
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
          <idss-icon-svg :name="item.icon || 'caozuo-xiangqingchakan'" />

          <!-- {{!isCollapse? item.meta.title : item.meta.shortTitle}} -->
          <span slot="title">{{ item.meta && item.meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main id="main-router-view">
      <router-view></router-view>
    </el-main>
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
        // debugger
        let parentPathName = "";
        let matched = this.$route.matched.filter((item) => item.name);
        // let breadcrumb = this.$route.meta && this.$route.meta.breadcrumb
        // lastMenuTag区分三级菜单or四级菜单
        let lastMenuTag = this.$route.meta.lastMenuTag;
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
        // 四级菜单 默认展示自身 如需配置，引入 app-last-menu
        let list = lastMenuTag
          ? [this.$route]
          : tempList.filter((item) => !item.meta || !item.meta.hidden);
        // list.map(item => {
        //   // title备份，默认展示2个字title，点击展开则展示全部
        //   let title = item.meta.title
        //   item.meta.shortTitle = title.length > 2 ? title.slice(0, 2) : title
        // })
        this.slideMenuList = list;
      },
      immediate: true,
    },
  },
  methods: {
    handleClick(name) {
      if (name === this.$route.name) {
        // return this.$router.push({ path: this.$route.fullPath })
        return;
      }
      this.$router.push({ name: name });
    },
  },
};
</script>

<style lang="postcss" scoped>
.slide-menu-container {
  height: 100%;

  .slide-menu-content {
    background-color: #e0e4ea;

    .el-menu-vertical-content {
      padding: 0 !important;

      /* .el-menu-item {
          font-size: var(--font-size-default);
          height: 38px;
          line-height: 38px;
          text-align: center;
          padding: 0 !important;
        } */
      /* &.el-menu--collapse { */
      /* width: 46px; */

      .el-menu-item {
        width: 46px;
        padding: 0 !important;
        font-size: var(--font-size-default);
        height: 52px;
        line-height: 52px;
        text-align: center;
        /* i {
            color: #7b8ca1;
          } */

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

      /* } */
    }
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    /* width: 200px;
      min-height: 400px; */
  }

  .el-main {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    /*滚动条滑块*/
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
      /*background: red;*/
    }

    /*滚动条轨道*/
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      background: rgba(255, 255, 255, 0);
    }
  }
}
</style>
