<template>
  <div id="app">
    <router-view></router-view>
    <el-tooltip ref="idss-tooltip" v-bind="tooltipOpt" />
  </div>
</template>

<script>
import { throttle } from "@/util/base";
import BusFactory, { EventName } from "@/fusion-components/util/bus.js";

let bus;
export default {
  name: "App",
  data() {
    return {
      tooltipOpt: {},
    };
  },
  beforeCreate() {
    this.location = location;
  },
  created() {
    bus = BusFactory(this);

    // 对 windows resize 事件内部进行节流控制(再chrome下已对回调函数的调用频率进行了控制)
    let resizeFn = (event) => {
      bus.$emit(EventName.WINDOW_RESIZE, event);
    };
    window.addEventListener("resize", throttle(resizeFn));

    // 监听滚动
    let scrollFn = (event) => {
      bus.$emit(EventName.SCROLL_EVENT, event);
    };
    window.addEventListener("scroll", throttle(scrollFn));

    // 浏览器关闭或刷新时清空uuidList
    window.addEventListener("unload", (e) => {
      e = e || window.event;
      if (!e) return;
      let { name } = this.$route;
      let param =
        name === "analysis-inquire-event-board" ? this.$route.query : undefined; // 为了判断浏览器刷新时，当前保留的tag是否为事件调查看板
      this.$store.dispatch("clearUUid", {
        type: "closeOtherTags",
        data: param,
      });
    });
    // 监听鼠标移出屏幕
    document.addEventListener("mouseleave", (event) => {
      bus.$emit(EventName.MOUSE_LEAVE_BROWSER, event);
    });

    // 获取回退最后历史记录
    // this.historyGoBack()
  },
  methods: {
    /**
     * 路由回滚
     * @FIXME 借助路由队列，通过pushState将路由队列覆盖，然后对路由进行回滚到第一个历史记录，继续覆盖
     * 这种处理存在bug，history.length为2，始终保持原来进入页面的第一个路由
     */
    historyGoBack() {
      // 处理原有路由query对象
      let query = this.paramUrl();
      let pathname = this.location.pathname;
      // 处理默认路由跳转
      if (this.location.pathname === "/") {
        pathname = "situation/synthetical-safety";
        query = { _r: `${+new Date()}` };
      }
      // 在当前路由队列中进行覆盖，目的用于将该路由设置为队列最新，能够跳转到第一个路由
      history.pushState({ search: "test" }, "test");
      // @FIXME 这里不能用 1 - history.length，如果跳转到空白页面，进行路由push有bug
      history.go(2 - history.length);
      this.$router.push({ path: pathname, query: query });
    },

    /**
     * 解析url to param对象
     */
    paramUrl() {
      const query = {};
      if (this.location.search) {
        const a = this.location.search.split("?")[1].split("&");
        a.forEach((item) => {
          const q = item.split("=");
          if (q.length) {
            query[q[0]] = q[1];
          }
        });
      }
      return query;
    },
  },
};
</script>

<style>
#app {
  height: 100%;
  overflow: hidden;
}
</style>
