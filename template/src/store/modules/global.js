/*
 * @Author: your name
 * @Date: 2020-07-20 16:52:40
 * @LastEditTime: 2020-07-20 18:08:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/store/modules/global.js
 */
import { GLOBAL } from "@/store/type";

export default {
  namespaced: true,
  state() {
    return {
      globalTime: "", // 全局时间范围选择的值
      showWelcome: true,
    };
  },
  mutations: {
    [GLOBAL.GLOBAL_TIME](state, payload) {
      state.globalTime = payload;
    },
    [GLOBAL.HIDE_WELCOME](state) {
      state.showWelcome = false;
    },
  },
  actions: {
    async [GLOBAL.GLOBAL_TIME]({ commit }) {
      commit(GLOBAL.GLOBAL_TIME, commit);
    },
  },
  getters: {
    showWelcome(state) {
      return state.showWelcome;
    },
  },
};
