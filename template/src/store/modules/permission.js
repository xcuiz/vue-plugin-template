/*
 * @Author: yincheng
 * @Date: 2021-01-21 14:19:12
 * @LastEditors: yincheng
 * @LastEditTime: 2021-06-22 15:50:45
 */
export default {
  namespaced: true,
  state() {
    return {
      menuList: [],
      permission: {
        insight: 15,
      },
      resources: {},
    };
  },
  mutations: {
    SET_MENU_LIST(state, data) {
      state.menuList = data || [];
    },
    SET_PERMISSION(state, data) {
      state.permission = data || {};
    },
    SET_RESOURCE(state, data) {
      state.resources = data || {};
    },
  },
};
