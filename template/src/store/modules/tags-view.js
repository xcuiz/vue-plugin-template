/**
 * Created by ligang on 2018/6/1.
 */
export default {
  // namespaced: true,
  state() {
    return {
      visitedViews: [], // Tags列表
      cachedViews: [], // 缓存的views
      // @Deprecated 使用全局配置中的信息 20190904
      maxCacheLimit: 10, // 缓存最大数量
    };
  },
  actions: {
    // 增加新的Tags
    addVisitedViews({ commit }, view) {
      commit("ADD_VISITED_VIEWS", view);
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit("DEL_VISITED_VIEWS", view);
        resolve([...state.visitedViews]);
      });
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit("DEL_OTHERS_VIEWS", view);
        resolve([...state.visitedViews]);
      });
    },
    /**
     * 删除所有视图
     */
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit("DEL_ALL_VIEWS");
        resolve([...state.visitedViews]);
      });
    },
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (view.meta.outOfViews) return;
      // 是否已存在
      if (
        state.visitedViews.some(
          (v) => v._r === view.query._r && v.name === view.name
        )
      )
        return;
      state.visitedViews.push({
        _r: view.query._r,
        name: view.name,
        path: view.path,
        query: view.query,
        params: view.params,
        title: view.meta.title || "no-name",
      });
      // 是否缓存
      if (!view.meta.noCache) {
        state.cachedViews.push({
          _r: view.query._r,
          name: view.name,
          fullPath: view.fullPath, // 添加 fullPath
        });
      }
    },
    UPDATE_VISITED_VIEWS: (state, view) => {
      // 更新 visitedViews， 找当前 name 与 _r 的 view 在数组中的位置
      const visiteVal = state.visitedViews.find(
        (val) => val._r === view.query._r && val.name === view.name
      );
      if (visiteVal) {
        visiteVal.path = view.path;
        visiteVal.params = view.params;
      }

      // 更新 cachedViews，涉及到 app-main.vue 中的 keep alive 缓存页面
      const catchVal = state.cachedViews.find(
        (val) => val._r === view.query._r && val.name === view.name
      );
      // 路由 meta 配置中的 noCache 字段，会导致 cachedViews 比 visitedViews 要少，所以可能出现 catchVal === undefined 情况
      if (catchVal) {
        catchVal.fullPath = view.fullPath;
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v._r === view._r && v.name === view.name) {
          state.visitedViews.splice(i, 1);
          break;
        }
      }
      for (const i of state.cachedViews) {
        if (i._r === view._r && i.name === view.name) {
          const index = state.cachedViews.indexOf(i);
          state.cachedViews.splice(index, 1);
          break;
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (let i = 0; i < state.visitedViews.length; i++) {
        const v = state.visitedViews[i];
        if (v._r !== view.query._r || v.name !== view.name) {
          state.visitedViews.splice(i, 1);
          i--;
        }
      }
      for (let i = 0; i < state.cachedViews.length; i++) {
        const v = state.cachedViews[i];
        if (v._r !== view.query._r || v.name !== view.name) {
          state.cachedViews.splice(i, 1);
          i--;
        }
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = [];
      state.cachedViews = [];
    },
  },
};
