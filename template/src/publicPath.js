/*
 * @Author: yincheng
 * @Date: 2021-11-04 17:53:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-08 11:36:54
 */
const getPublicPath = () =>
  process.env.NODE_ENV === "production" ? "" : "/data-gov-web";

module.exports = {
  getPublicPath,
};
