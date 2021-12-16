import Vue from "vue";
import $ from "jquery";
import ElementUI from "element-ui";
// vue 方法扩展
import vueExtend from "@/fusion-components/plugins/vue-extend";
import { setTicket } from "./util/ticket";
// import 'lib-flexible' // 响应式改变根元素的字体大小
// 样式控制
// PLAN: A
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/base.css";
import "@/styles/main.css";
import "@/styles/rule.var.css";
import "@/styles/zindex.css";
import "@/styles/element_cover.css";
// svg 图标引用
import "@/assets/icons";
// eslint-disable-next-line
import _ from 'lodash'
import App from "./App.vue";
import Probe from "./Probe.vue";
import router from "@/router";
import store from "@/store";

// @FIXME 自定义组件
import "@/custom";

// 组件库，包括过滤器和指令
import FusionComponents from "@/fusion-components";
// 图表
import FusionCharts from "@/fusion-charts";

// @FIXME: 建议放到指定模块，按需引入
// import Flowgrid from '@/fusion-components/flowgrid'

// plugins
import requestPlugin from "@/plugin/request.js";
import format from "@/plugin/format.js";
import websocket from "@/fusion-components/plugins/socket.js";

// 指令directive
import "@/fusion-components/directives/index.js";

// @FIXME permission 指令暂时先注册原有的
import permission from "./directive/permission";
import auth from "./directive/authority";

// 引入ans  测试作用

// import 'ans-ui/lib/ans-ui.min.css'
// import ans from 'ans-ui/lib/ans-ui.min'

import "@/styles/tooltip.css";
import "bootstrap/dist/js/bootstrap.min.js";
Vue.use(FusionCharts);
Vue.use(FusionComponents);

// 动态加载 css 变量
const themeKey =
  window.localStorage.getItem("base/theme$$") ||
  process.env.CURRENT_THEME_TYPE ||
  "default";
// 2020年1月3日 升级后的 eslint-loader 在 import 中 使用 字符串模板 会报 TypeError: Cannot read property 'range' of null。改为普通写法
// eslint-disable-next-line
import('@/styles/themes/' + themeKey + '/common.css')

Vue.directive(permission.name, permission.hooks);
Vue.directive(auth.name, auth.hooks);

Vue.config.productionTip = false;
// Vue.use(Flowgrid)
// Vue.use(ans)
Vue.use(ElementUI);
Vue.use(requestPlugin);
Vue.use(websocket);
Vue.use(vueExtend);
Vue.use(format);
// 获取前端全局配置
// store.dispatch("base/globalConfig$$");
setTicket();

// eslint-disable-next-line
var vue = new Vue({
  el: "#app",
  router,
  store,
  components: { App, Probe },
  beforeDestroy() {
    this.$socketClose(); // 断开 soket
    // window.localStorage.clear(); // 清楚localStorage
  },
  mounted() {
    // dolphinScheduler 项目 -流程图-右键-菜单栏 全局关闭事件
    document.addEventListener("click", () => {
      $("#contextmenu").css("visibility", "hidden");
    });
  },
  created() {
    this.initApp();
  },
  methods: {
    // dolphinScheduler 项目  dom节点全局tooltip-涉及 bootstrap
    // 设计流程图的都可通过该属性展示title
    // 标签任意皆可
    // 用法 <span title='111' data-toggle="tooltip" data-html="true" data-container="body"></span>
    initApp() {
      let bootstrapTooltip = $.fn.tooltip.noConflict();
      $.fn.tooltip = bootstrapTooltip;
      $("body").tooltip({
        selector: '[data-toggle="tooltip"]',
        trigger: "hover",
      });
    },
  },
  /*
    这里注册 Probe 组件便于全局监听变化（menu以及vuex部分请求需要同app同级别 ）
    如：监听store值的变化
  */
  template: '<div style="height: 100%;"><App/><Probe/></div>',
});
export default vue;
