<!--
 * @Author: your name
 * @Date: 2020-04-10 11:59:20
 * @LastEditTime: 2020-06-18 16:29:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/custom/app-main.vue
 -->
<template>
  <section class="app-main-container">
    <!-- <idss-router-keep-alive :include="cacheViews" :isByName="false" v-if="isRouterAlive"> -->
    <keep-alive :include="cachedViews">
      <router-view ref="router-view" :key="$route.fullPath"></router-view>
    </keep-alive>
    <!-- </idss-router-keep-alive> -->
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AppMain",
  provide() {
    return {
      reload: this.reload, // 注入reload方法，子页面通过inject获取该方法
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  computed: {
    ...mapState("system", ["cachedViews"]),
    // cacheViews () {
    //   const res = []
    //   this.$store.state.tagsView.cachedViews.map(item => {
    //     res.push(item.fullPath)  // 将原来的 item.name 修改 item.fullPath，
    //   })
    //   return res
    // },
    key() {
      return this.$route.fullPath;
    },
  },
  methods: {
    /**
     * 刷新页面
     */
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>
<style scoped lang="postcss">
.app-main-container {
  flex: auto;
  position: relative;
  height: calc(100vh - 78px);
  overflow: auto;
  /* margin: 12px 16px 0 16px; */
  /* background: var(--white); */

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  /*滚动条滑块*/

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
  }

  /*滚动条轨道*/

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: transparent;
  }
}
</style>
