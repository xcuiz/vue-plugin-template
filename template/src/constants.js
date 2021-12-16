/*
 * @Author: yincheng
 * @Date: 2021-04-23 15:53:39
 * @LastEditors: yincheng
 * @LastEditTime: 2021-07-19 16:32:39
 */
// ipv4地址校验正则
// export const IP_RE = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
// ipv4 & ipv6校验正则
export const IP_RE = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
export const PORT_RE = /([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
// eslint-disable-next-line no-useless-escape
export const STR_RE = /^[\u4e00-\u9fa5_a-zA-Z0-9\-]+$/;
export const WEEK_DAYS = [
  {
    code: "MON",
    number: 1,
    name: "星期一",
  },
  {
    code: "TUE",
    number: 2,
    name: "星期二",
  },
  {
    code: "WED",
    number: 3,
    name: "星期三",
  },
  {
    code: "THU",
    number: 4,
    name: "星期四",
  },
  {
    code: "FRI",
    number: 5,
    name: "星期五",
  },
  {
    code: "SAT",
    number: 6,
    name: "星期六",
  },
  {
    code: "SUN",
    number: 0,
    name: "星期日",
  },
];
export const DAYS_OF_MONTH = {
  1: 31,
  2: 29,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

export const JOB_STATUS = {
  WAITING: "0",
  RUNNING: "1",
  DISABLED: "2",
  STOPED: "3",
  PAUSED: "4",
};

export const TASK_STATUS = {
  WAITING: 1,
  RUNNING: 2,
  PAUSED: 3,
  COMPLETED: 4,
  STOPED: 5,
  END: 6,
};

// 字段移除算子的下拉框需要过滤不显示以下字段：
// generic_device_ip（数据源ip）、generic_create_time、generic_into_time、
// generic_datasource_type
export const DisabledFieldInRemoveModule = [
  "generic_device_ip",
  "generic_create_time",
  "generic_into_time",
  "generic_datasource_type",
];

// 针对所有表，generic_device_ip（数据源ip）、generic_into_time、generic_datasource_type:
// 必落库，不可选择匹配对象；
export const NotModifyFieldInOutput = [
  "generic_device_ip",
  "generic_into_time",
  "generic_datasource_type",
];

// 临时关闭权限验证，后续版本需要放开此功能
export const ENABLE_AUTH = true;
