/**
 * Created by ligang on 2018/6/12.
 */

import Message from "element-ui/packages/message/index.js";

export {
  isObject,
  isFunction,
  isBoolean,
  isString,
  throttle,
  searchTreeByNode,
  debounce,
  shuffle,
  charCodeLength,
  treeToList,
  computeWid,
  formatDate,
} from "fusion-utils";

/**
 * 获取后台错误提示语
 * @param message
 * 兼容三种message模式
 * 1. 字符串 {message:'XXXX'}
 * 2. 数组模式 {message: [item: 'xxx', message: 'xxxx']}
 * 3. 混合模式 {message: [item: ['name1', 'name2'], message: 'xxxx]}
 * @param {string} customErrorMsg 自定义错误消息
 * @returns {{}}
 */
const getErrorMsgByEnd = function ({ message = [] }, customErrorMsg) {
  try {
    // 后台错误提示语
    let errors = {};
    // 兼容非校验错误处理
    if (!Array.isArray(message)) {
      throw new Error(message);
    }
    message.map((obj) => {
      if (typeof obj.item === "string") {
        Object.assign(errors, { [obj.item]: obj.message });
      } else if (Array.isArray(obj.item)) {
        // 兼容返回item为数组处理
        obj.item.map((filed) => {
          Object.assign(errors, { [filed]: obj.message });
        });
      } else {
        // 其他错误结构抛出异常
        throw new Error("接口校验错误结构返回异常！");
      }
    });
    return errors;
  } catch (err) {
    Message({
      type: "error",
      message: err.message || customErrorMsg,
    });
    return false;
  }
};

/**
 * 文件上传 - 通用方法
 * @param options Object
 * url: 地址，必须
 * uploadFiles: Array, 必须
 * method: 默认：post
 * data: 其他数据参数
 * tag: loading标识
 */
const upload = function (options) {
  let { url, uploadFiles, method = "post", data, tag } = options;
  if (!uploadFiles || !uploadFiles.length) return false;
  const formData = new FormData();
  // 文件序列号
  uploadFiles.forEach(({ raw }) => {
    formData.append("file", raw);
  });
  // 额外数据序列号
  if (typeof data === "object") {
    for (const item in data) {
      formData.append(item, data[item]);
    }
  }
  return this.$request({
    url,
    method: method,
    data: formData,
    tag,
  });
};

// 图表坐标轴为 ‘log’ 类型时的特殊值
const logValueDictionary = [1.001, 1.20001];
// 把值转换成 log 类型取的值
const valueToLog = function (value) {
  return value === 0 || value === 1 ? logValueDictionary[value] : value;
};
// 把log 类型值转换成正常值
const logToValue = function (value) {
  return logValueDictionary.includes(value)
    ? logValueDictionary.indexOf(value)
    : value;
};

export { upload, valueToLog, logToValue, getErrorMsgByEnd };
