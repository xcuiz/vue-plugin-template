/*
 * @Author: your name
 * @Date: 2020-03-19 20:41:47
 * @LastEditTime: 2020-10-20 14:17:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/store/type.js
 */
/**
 * 此文件存放mutations的类型常量
 * 约定types以"$$"结尾的，需要持久化到localStorage
 * Created by ligang on 2018/6/1.
 */

// 业务系统字典表
export const BASE = {
  IS_RE_LOGIN: "isReLogin",
  TOKEN: "token$$",
  AUTH_TYPE: "authType$$",
  USER_INFO: "userInfo$$",
  GLOBAL_CONFIG: "globalConfig$$",
  THEME: "theme$$",
  LICENSE_EXPIRE: "licenseExpire",
  PROJECT_ICON: "projectIcon$$",
};
// 涉及全局的变量
export const GLOBAL = {
  GLOBAL_TIME: "globalTime",
  HIDE_WELCOME: "hide-welcome",
};

// 新大盘
export const DASHBOARD = {
  DICTIONARY: "dictionary",
};

// 数据管理字典项
export const MANAGE = {
  FILED_DICTS: "filed-dicts", // 字典列表
  SET_LOG_FIELDS_TEMP_DICTS: "set_log_fields_temp_dicts",
  ALL_LOG_FIELDS_DICTS: "all_log_fields_dicts", // 包含日志+用户的log字段值
  LOG_FIELDS_DICTS: "log_fields_dicts", // 日志接口,字典项
  LOG_FIELDS_TEMP_DICTS: "log_fields_temp_dicts", // 记录用户输入temp数据
  DEL_LOG_FIELDS_TEMP_DICTS: "del_log_fields_temp_dicts",
  LOG_ICOPERATOR_DICTS: "log_icoperator_dicts", // 逻辑运算符 字典项
  FIELD_TYPE_DICTS: "field_type_dicts", // 数据类型--输出配置-索引-类型
  DATE_TYPE_DICTS: "date-type-dicts", // 时间字段
  MASK_STRATEGY_DICTS: "maskStrategyDicts", // 数据转换-数据脱敏策略
  IP_REGION_DICTS: "ipReginDicts", // ip解析扩展 下拉框数据
  INDEX_FIELDS_DICTS: "indexFieldsDicts", // 输出配置-索引-匹配对象
  INDEX_TYPE_DICTS: "indexTypeDicts", // 输出配置-索引-数据类型
  SEVERAL_ORDER_DICTS: "severalOrderDicts", // 输出配置-实时数仓-排序
  SEVERAL_TABLE_FIELDS_DICTS: "severalTableFieldsDicts", // 输出配置-实时数仓-匹配对象
  SEVERAL_TYPE_DICTS: "severalTypeDicts", // 输出配置-实时数仓-数据类型,
  OUTPUT_CONFIG_TYPE: "outputConfigType", // 输出配置-类型- CH-实时数仓 ES-索引库
  LOGMOUDLE_TYPE_DICTS: "LOGMOUDLE_TYPE", // logmodule类型
};

export const SYSTEM = {
  ROLE_DICTS: "roleDicts", // 用户列表
  LOGMOUDLE_DICTS: "logmoduleDicts", // logmodule类型
  CACHE_REPORT_LIST: "cacheReportList", // 是否缓存报表列表页
  GET_MESSAGE_NUM: "getMessageNum", // 消息数量
  SET_MESSAGE_NUM: "setMessageNum", // 设置消息数量
};

export const INSIGHT = {
  PUSH_TO_SELECTED_FILTERS: "PUSH_TO_SELECTED_FILTERS",
  CLEAR_SELECTED_FILTERS: "CLEAR_SELECTED_FILTERS",
  DELETE_SELECTED_FILTERS_ITEM: "DELETE_SELECTED_FILTERS_ITEM",
  SET_SELECTED_FILTERS: "SET_SELECTED_FILTERS",
  REPLACE_SELECTED_FILTERS_ITEM: "REPLACE_SELECTED_FILTERS_ITEM",
  CLEAR_CAN_BE_SAVED_FILTERS: "CLEAR_CAN_BE_SAVED_FILTERS",
  DELETE_CAN_BE_SAVED_FILTERS_ITEM: "DELETE_CAN_BE_SAVED_FILTERS_ITEM",
  PUSH_TO_CAN_BE_SAVED_FILTERS: "PUSH_TO_CAN_BE_SAVED_FILTERS",
  REPLACE_CAN_BE_SAVED_FILTERS_ITEM: "REPLACE_CAN_BE_SAVED_FILTERS_ITEM",
  SET_CAN_BE_SAVED_FILTERS: "SET_CAN_BE_SAVED_FILTERS",
  SET_SELECTED_COLUMNS: "SET_SELECTED_COLUMNS",
  SET_TIME_INFO: "SET_TIME_INFO",
  RESET_ALL_STATE: "RESET_ALL_STATE",
  SET_ASIDE_VALUE: "SET_ASIDE_VALUE",
  SET_ASIDE_CURRENT: "SET_ASIDE_CURRENT",
  SET_AGG_INFO: "SET_AGG_INFO",
  SET_SEARCH_INFO: "SET_SEARCH_INFO",
  INSERT_TO_SELECTED_COLUMNS: "INSERT_TO_SELECTED_COLUMNS",
};

export const EXPLORE = {
  SET_SELECTED_FIELD_LIST: "SET_SELECTED_FIELD_LIST",
  SET_OPTION_FIELD_LIST: "SET_OPTION_FIELD_LIST",
  SET_REAL_TOTAL: "SET_REAL_TOTAL",
  SET_SEARCH_DATA: "SET_SEARCH_DATA",
  SET_RESIZE_CHART_DATA: "SET_RESIZE_CHART_DATA",
  RESET_ALL_STATE: "RESET_ALL_STATE",
  SET_TIMER: "SET_TIMER",
  CLEAR_INTERVAL_TIMER: "CLEAR_INTERVAL_TIMER",
  SET_TIMER_SIGNAL: "SET_TIMER_SIGNAL",
  SET_CHART_ITEM: "SET_CHART_ITEM",
  SET_TIME_UNIT_SOURCE: "SET_TIME_UNIT_SOURCE",
};

export const DAG = {};
