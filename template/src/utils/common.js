/*
 * @Author: your name
 * @Date: 2020-04-14 16:47:05
 * @LastEditTime: 2021-09-10 14:17:17
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/utils/common.js
 */

/**
 * 异步效验表单
 * @param {string} form 表单名称
 */
export const getFormPromise = (form) => {
  return new Promise((resolve) => {
    form.validate((res) => {
      resolve(res);
    });
  });
};
/**
 *
 * @param {Object} obj 判断对象是否为空
 * @returns {Boolean} true 对象为空 false 对象不为空
 */
export const isEmptyObject = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export const strToArr = (str = "", separator = ",") => {
  return str?.split(separator).filter(Boolean) || [];
};

/**
 * 千分位分隔符
 * @param {string | number} val 字符串或者数字
 */
export const thousandSplit = (val = "") => {
  if (val) {
    let v = "";
    if (typeof val === "string") {
      v = val;
    } else if (typeof val === "number") {
      v = val.toString();
    }

    return v.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  }

  return val + "";
};

const addZero = (number) => {
  var m = number;
  if (number.toString().length == 1) {
    m = "0" + number;
  }
  return m;
};

const getDate = (day, hms = "00:00:00") => {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds);
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = addZero(tMonth + 1);
  tDate = addZero(tDate);
  return tYear + "-" + tMonth + "-" + tDate + ` ${hms}`;
};

/**
 * 获取最近几天
 * @param {number} day
 * @returns
 */
export const getDayArea = (day) => {
  return [getDate(day), getDate(0, "23:59:59")];
};

export const eachArr = (data, cb, params) => {
  if (!(data instanceof Array)) {
    return;
  }
  if (typeof cb !== "function") {
    return;
  }
  const parent = params?.parent;
  data.forEach((item) => {
    item.parent = parent;
    cb(item);
    eachArr(item.children, cb, {
      parent: item,
    });
  });
};
