/*
 * @Author: yincheng
 * @Date: 2021-04-28 13:55:13
 * @LastEditors: yincheng
 * @LastEditTime: 2021-06-23 11:05:09
 */
import qs from "query-string";
import Cookies from "js-cookie";

export const setTicket = () => {
  const { token, username, userId, appAcctId, moduleId } = qs.parse(
    window.location.search
  );
  if (token) {
    Cookies.set("ticket", token);
    Cookies.set("username", username);
    Cookies.set("userId", userId);
    Cookies.set("moduleUserId", userId);

    if (appAcctId) {
      Cookies.set("appAcctId", appAcctId);
    }
    if (moduleId) {
      Cookies.set("moduleId", moduleId);
    }

    // 保存 ticket 到 cookie 后，移除 url 中的参数
    const url = location.href.replace(location.search, "");

    history.replaceState(
      {
        url,
        title: "",
      },
      "",
      url
    );
  }
};
