/*
 * @Author: your name
 * @Date: 2020-03-19 20:41:47
 * @LastEditTime: 2020-04-07 14:02:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/store/modules/dashboard.js
 */
import { INSIGHT } from "../type";

const state = () => ({
  // 已选择的过滤器("包括"没有进行任何操作的过滤器)
  selectedFilters: [],
  // 可以被保存的过滤器("不包括"没有进行任何操作的过滤器)
  canBeSavedFilters: [],
  // 选中的列
  selectedColumns: [],
  // timeInfo: {
  //   startTime: '',
  //   endTime: '',
  //   quickTime: '7day'
  // },
  // 时间信息
  timeInfo: null,
  // 搜索信息
  searchInfo: null,
  // 侧边栏下拉框值
  asideValue: "",
  // 侧边栏current
  asideCurrent: -1,
  // 侧边栏聚合信息
  aggInfo: null,
});
const mutations = {
  /* 操作 selectedFilters */
  // 添加过滤器至selectedFilters中
  [INSIGHT.PUSH_TO_SELECTED_FILTERS](state, filter) {
    state.selectedFilters.push(filter);
  },
  // 清空selectedFilters
  [INSIGHT.CLEAR_SELECTED_FILTERS](state) {
    state.selectedFilters = [];
  },
  // 删除selectedFilters中的某元素
  [INSIGHT.DELETE_SELECTED_FILTERS_ITEM](state, index) {
    state.selectedFilters.splice(index, 1);
  },
  // 设置selectedFilters
  [INSIGHT.SET_SELECTED_FILTERS](state, list) {
    state.selectedFilters = list;
  },
  /* 操作 canBeSavedFilters */
  // 清空canBeSavedFilters
  [INSIGHT.CLEAR_CAN_BE_SAVED_FILTERS](state) {
    state.canBeSavedFilters = [];
  },
  // 删除canBeSavedFilters中的某元素
  [INSIGHT.DELETE_CAN_BE_SAVED_FILTERS_ITEM](state, index) {
    state.canBeSavedFilters.splice(index, 1);
  },
  // 添加过滤器至canBeSavedFilters中
  [INSIGHT.PUSH_TO_CAN_BE_SAVED_FILTERS](state, filter) {
    state.canBeSavedFilters.push(filter);
  },
  // 替换selectedFilters中的某一元素
  [INSIGHT.REPLACE_SELECTED_FILTERS_ITEM](state, { index, newFilter }) {
    state.selectedFilters.splice(index, 1, newFilter);
  },
  // 替换canBeSavedFilters中的某一元素
  [INSIGHT.REPLACE_CAN_BE_SAVED_FILTERS_ITEM](state, { index, newFilter }) {
    state.canBeSavedFilters.splice(index, 1, newFilter);
  },
  // 设置canBeSavedFilters
  [INSIGHT.SET_CAN_BE_SAVED_FILTERS](state, list) {
    state.canBeSavedFilters = list;
  },
  // 设置已选择的列
  [INSIGHT.SET_SELECTED_COLUMNS](state, list) {
    state.selectedColumns = list;
  },
  // 将from位置插入到to位置
  [INSIGHT.INSERT_TO_SELECTED_COLUMNS](state, { from, to }) {
    let tmp = state.selectedColumns[from];
    if (from > to) {
      state.selectedColumns.splice(from, 1);
      state.selectedColumns.splice(to, 0, tmp);
    } else if (from < to) {
      state.selectedColumns.splice(from, 1);
      state.selectedColumns.splice(to, 0, tmp);
    }
  },
  // 设置时间信息
  [INSIGHT.SET_TIME_INFO](state, timeInfo) {
    state.timeInfo = timeInfo;
  },
  // 设置搜索信息
  [INSIGHT.SET_SEARCH_INFO](state, searchInfo) {
    state.searchInfo = searchInfo;
  },
  // 设置侧边栏下拉框的value
  [INSIGHT.SET_ASIDE_VALUE](state, value) {
    state.asideValue = value;
  },
  // 设置侧边栏具体聚合信息的current
  [INSIGHT.SET_ASIDE_CURRENT](state, current) {
    state.asideCurrent = current;
  },
  // 设置侧边栏聚合信息
  [INSIGHT.SET_AGG_INFO](state, aggInfo) {
    state.aggInfo = aggInfo;
  },
  // 重置所有的状态
  [INSIGHT.RESET_ALL_STATE](state) {
    state.selectedFilters = [];
    state.canBeSavedFilters = [];
    state.selectedColumns = [];
    state.timeInfo = null;
    state.searchInfo = null;
    state.asideValue = "";
    state.asideCurrent = -1;
    state.aggInfo = null;
  },
};

const getters = {
  selectedFilters(state) {
    return state.selectedFilters;
  },
  canBeSavedFilters(state) {
    return state.canBeSavedFilters;
  },
  selectedColumns(state) {
    return state.selectedColumns;
  },
  timeInfo(state) {
    return state.timeInfo;
  },
  searchInfo(state) {
    return state.searchInfo;
  },
  asideValue(state) {
    return state.asideValue;
  },
  asideCurrent(state) {
    return state.asideCurrent;
  },
  aggInfo(state) {
    return state.aggInfo;
  },
};
const actions = {};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
