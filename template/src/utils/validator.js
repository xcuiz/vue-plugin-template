/*
 * @Author: your name
 * @Date: 2020-04-14 09:53:20
 * @LastEditTime: 2020-04-14 10:04:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/utils/validtor.js
 */
/**
 * 效验正数
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const checkPositiveNum = (rule, value, callback) => {
  if (value !== "") {
    if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) === false) {
      callback(new Error("请填写大于0的数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
/**
 * 效验特殊字符+空格
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const checkSpecialCharAndSpace = (rule, value, callback) => {
  if (value !== "") {
    if (/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value) === false) {
      callback(new Error("不能包含空格符或者特殊字符"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
