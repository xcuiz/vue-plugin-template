import { isObject } from "@/util/base.js";
/**
 * 校验value值是否为空（undefined 空字符串 空对象 空数组）
 * @param {any} value
 * @param {array} whiteListType 白名单数据类型，该名单中存在数据类型，允许为空
 */
export function checkValueIsEmpty(value, whiteListType = []) {
  if (
    (typeof value === "undefined" &&
      whiteListType.indexOf("undefined") === -1) ||
    (typeof value === "string" &&
      !value &&
      whiteListType.indexOf("string") === -1) ||
    (Array.isArray(value) &&
      !value.length &&
      whiteListType.indexOf("array") === -1) ||
    (isObject(value) &&
      !Object.keys(value).lengthe &&
      whiteListType.indexOf("object") === -1)
  ) {
    return true;
  }
  return false;
}
