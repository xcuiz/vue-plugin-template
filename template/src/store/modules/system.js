/*
 * @Author: your name
 * @Date: 2020-04-23 11:46:27
 * @LastEditTime: 2020-04-23 12:01:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/store/modules/system.js
 */
import { SYSTEM } from "../type";
import { request } from "@/plugin/request";
export default {
  namespaced: true,
  state: {
    roleDicts: [],
    logModulesDicts: [],
    cachedViews: [],
    message: {
      threate: null,
      abnormal: null,
      total: null,
    },
  },
  getters: {},
  mutations: {
    [SYSTEM.ROLE_DICTS](state, result) {
      state.roleDicts = Object.freeze(result);
    },
    [SYSTEM.LOGMOUDLE_DICTS](state, result) {
      state.logModulesDicts = Object.freeze(result);
    },
    [SYSTEM.CACHE_REPORT_LIST](state, result) {
      const REPORT_MANAGE = "report-manage";
      const index = state.cachedViews.indexOf(REPORT_MANAGE);
      if (result) {
        if (index === -1) {
          state.cachedViews.push(REPORT_MANAGE);
        }
      } else {
        if (index !== -1) {
          state.cachedViews.splice(index, 1);
        }
      }
    },
    [SYSTEM.SET_MESSAGE_NUM](state, result) {
      state.message = result;
    },
  },
  actions: {
    async [SYSTEM.ROLE_DICTS]({ commit }) {
      const content = await request({
        method: "get",
        url: "/gov/api/sys/roles",
      });
      commit(SYSTEM.ROLE_DICTS, content);
    },

    async [SYSTEM.LOGMOUDLE_DICTS]({ commit }) {
      const content = await request({
        method: "get",
        url: "/gov/api/etl/logmoudle",
      });
      commit(SYSTEM.LOGMOUDLE_DICTS, content);
    },

    async [SYSTEM.GET_MESSAGE_NUM]({ commit }) {
      const content = await request({
        method: "post",
        url: "/gov/api/sys/message/agg",
      });
      let result = { total: 0 };
      content.forEach(({ messageType, count }) => {
        result[messageType] = count;
        result.total += count;
      });
      commit(SYSTEM.SET_MESSAGE_NUM, result);
    },
  },
};
