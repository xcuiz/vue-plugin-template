/**
 * Created by ligang on 2018/6/1.
 */
import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import myPlugins from "./plugins";
import modules from "./modules";

Vue.use(Vuex);
// 不要在发布环境下启用严格模式！
const debug = process.env.NODE_ENV !== "production";

const plugins = [...myPlugins];

debug && plugins.push(createLogger());

const store = new Vuex.Store({
  modules: {
    ...modules,
  },
  strict: debug,
  plugins,
});

if (module.hot) {
  // 使 modules 下的模块成为可热重载模块
  module.hot.accept(["./modules"], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 .default
    const modules = require("./modules").default;

    // 加载新模块
    store.hotUpdate({
      modules: {
        ...modules,
      },
    });
  });
}
export default store;
