/*
 * @Author: your name
 * @Date: 2020-04-14 16:47:05
 * @LastEditTime: 2020-11-27 17:18:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/store/modules/base.js
 */
/**
 * Created by ligang on 2018/6/1.
 */
import { BASE } from "@/store/type";
import { request } from "@/plugin/request";
import Message from "element-ui/packages/message/index.js";

const API = {
  USER_INFO: {
    url: "/gov/api/sys/user/myself",
    method: "get",
  },
};

export default {
  namespaced: true,
  state() {
    return {
      isReLogin: false,
      token: "",
      authType: "",
      userInfo: {},
      globalConfig: {},
      theme: "",
      licenseExpire: false,
      projectIcon: {
        logo: require("@/assets/images/logo.svg"),
        title: "",
      },
    };
  },
  mutations: {
    [BASE.IS_RE_LOGIN](state, payload) {
      state.isReLogin = payload;
    },
    [BASE.TOKEN](state, payload) {
      state.token = payload;
    },
    [BASE.AUTH_TYPE](state, payload) {
      state.authType = payload;
    },
    [BASE.USER_INFO](state, payload) {
      state.userInfo = payload;
    },
    [BASE.GLOBAL_CONFIG](state, payload) {
      state.globalConfig = payload;
    },
    [BASE.THEME](state, payload) {
      state.theme = payload;
    },
    [BASE.LICENSE_EXPIRE](state, payload) {
      state.licenseExpire = payload;
    },
    [BASE.PROJECT_ICON](state, payload) {
      const { title, logo, favicon } = payload;
      var link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = favicon;
      document.getElementsByTagName("head")[0].appendChild(link);
      document.title = title;
      state.projectIcon = {
        title,
        logo,
        favicon,
      };
    },
  },
  getters: {
    [BASE.TOKEN](state) {
      return state.token || window.localStorage.getItem(`base/${BASE.TOKEN}`);
    },
    [BASE.AUTH_TYPE](state) {
      return (
        state.authType || window.localStorage.getItem(`base/${BASE.AUTH_TYPE}`)
      );
    },
    [BASE.GLOBAL_CONFIG](state) {
      return function (key) {
        let globalConfigInfo =
          JSON.stringify(state.globalConfig) !== "{}"
            ? state.globalConfig
            : JSON.parse(
                window.localStorage.getItem(`base/${BASE.GLOBAL_CONFIG}`)
              ) || state.globalConfig;
        return key ? globalConfigInfo[key] : globalConfigInfo;
      };
    },
    [BASE.USER_INFO](state) {
      return JSON.stringify(state.userInfo) !== "{}"
        ? state.userInfo
        : JSON.parse(window.localStorage.getItem(`base/${BASE.USER_INFO}`)) ||
            state.userInfo;
    },
    [BASE.THEME](state) {
      return state.theme || window.localStorage.getItem(`base/${BASE.THEME}`);
    },
    [BASE.LICENSE_EXPIRE](state) {
      return state.licenseExpire;
    },
    [BASE.PROJECT_ICON](state) {
      return JSON.stringify(state.projectIcon) !== "{}"
        ? state.projectIcon
        : JSON.parse(window.localStorage.getItem(`base/${BASE.PROJECT_ICON}`));
    },
  },
  actions: {
    async [BASE.USER_INFO]({ commit }) {
      try {
        const content = await request({
          ...API.USER_INFO,
        });
        commit(BASE.USER_INFO, content);
      } catch {
        Message({
          type: "error",
          message: "用户信息获取失败",
        });
      }
    },
    /**
     * 获取前端默认配置
     * @param commit
     * @returns {Promise.<void>}
     */
    async [BASE.GLOBAL_CONFIG]({ state, commit }) {
      if (JSON.stringify(state.globalConfig) !== "{}") {
        return state.globalConfig;
      }
      const response = await request(
        {
          url: "/config.js",
          method: "get",
        },
        {
          responseType: "text",
        }
      );
      // eslint-disable-next-line
      commit(BASE.GLOBAL_CONFIG, window.eval(response.data))
    },
    /**
     * 修改项目icon及项目名称
     */
    async [BASE.PROJECT_ICON]({ commit }) {
      try {
        const { title, logo, favicon } = await request({
          url: `/gov/api/sys/logo/detail`,
        });
        commit(BASE.PROJECT_ICON, {
          title,
          logo,
          favicon,
        });
      } catch (error) {
        //
      }
    },
  },
};
