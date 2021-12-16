/*
 * @Author: your name
 * @Date: 2020-08-19 16:03:10
 * @LastEditTime: 2020-09-03 16:43:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/utils/sso.js
 */
import { request } from "@/plugin/request";
import store from "@/store";
import router from "@/router";
// 截取浏览器参数
export const getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 获取token
export const getToken = (code) => {
  return new Promise(async (resolve) => {
    const res = await request({
      url: `/gov/api/sys/auth/token`,
      data: {
        code: code,
      },
    });
    let { authToken, authType } = res;
    // 存储临时token，如果登陆成功，token再次赋值被替换
    store.commit("base/token$$", authToken);
    store.commit("base/authType$$", authType);
    resolve({
      authToken,
      authType,
    });
  });
};
// 单点登陆
// TODO---有效期逻辑
export const validHasPermission = ({ code }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `/gov/api/sys/auth/ssoLogin`,
        method: "post",
        data: {
          code,
        },
      });
      let { token, authType } = res;
      // 存储 token
      store.commit("base/token$$", token);
      store.commit("base/authType$$", authType);
      // 请求用户名称
      store.dispatch("base/userInfo$$");
      // 存储证书有效期
      // store.commit('base/licenseExpire', false)
      return resolve();
    } catch (error) {
      if (error.errorCode === "001") {
        return router.push({
          name: "licence",
        });
      }
      reject(error);
    }
  });
  // return
};
// 登陆成功逻辑处理
