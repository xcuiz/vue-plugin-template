/*
 * @Author: yincheng
 * @Date: 2021-04-23 15:53:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-01 15:10:30
 */
import crypto from "crypto";
import Identicon from "identicon.js";

import { formatDate } from "fusion-utils";
export { formatDate, formatByte, formatPks, isNumber } from "fusion-utils";

const TIME_UNIT = {
  s: "秒",
  m: "分钟",
  h: "小时",
  d: "天",
  w: "周",
  M: "月",
};
/**
 * 日期对象格式化为文本
 * @param time
 * @returns string
 */
export function formatTimeToText(time) {
  let { timeFlag, startTime, endTime, timeInterval, timeUnit } = time;
  if (timeFlag === 2) {
    // 绝对时间
    startTime = formatDate.call(new Date(startTime), "yyyy-MM-dd hh:mm:ss");
    endTime = formatDate.call(new Date(endTime), "yyyy-MM-dd hh:mm:ss");
    return `${startTime} - ${endTime}（绝对时间）`;
  } else if (timeFlag === 3) {
    // 相对时间
    return `最近${timeInterval}${TIME_UNIT[timeUnit]}`;
  } else {
    return "";
  }
}

/**
 * 生成哈希头像
 * @param str
 * @returns {*}
 */
export function strConvertImg(str) {
  if (str === undefined) {
    str = "idss";
  }
  let hash = crypto.createHash("md5");
  hash.update(str);
  let imgData = new Identicon(hash.digest("hex")).toString();
  return "data:image/png;base64," + imgData;
}
/**
 * 把秒转换成时分秒
 * @param {Number} num 秒数
 */
export function formatTime(num) {
  // @FIXME:暂不支持单位自定义
  let time = num / 1000;
  let hourTime = Math.floor(time / 60 / 60); // 小时
  let minuteTime = Math.floor(time / 60) % 60; // 分
  let secondTime = Math.floor(time) % 60; // 秒
  return `${hourTime}小时${minuteTime}分${secondTime}秒`;
}

/**
 * 格式化秒
 * @param result
 * @returns {string}
 */
export function formatSecond(result) {
  result = result || 0;
  const d = Math.floor(result / 3600 / 24);
  const h = Math.floor((result / 3600) % 24);
  const m = Math.floor((result / 60) % 60);
  const s = Math.floor(result % 60);
  result = s + "秒";
  if (m > 0) {
    result = m + "分钟" + result;
  }
  if (h > 0) {
    result = h + "小时" + result;
  }
  if (d > 0) {
    result = d + "天" + result;
  }

  return result;
}
