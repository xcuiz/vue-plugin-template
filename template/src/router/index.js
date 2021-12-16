import Vue from "vue";
// 在 vue-router 基础上增加扩展方法
import Router from "@/fusion-components/plugins/router-extend";

import { request } from "@/plugin/request";
import store from "@/store";
import { getQueryString, validHasPermission, getToken } from "@/utils/sso.js";
import { eachArr } from "@/utils/common";
import user from "@/router/user.js";
import system from "@/router/system.js";
import home from "@/router/home.js";
import asset from "@/router/asset.js";
import ClassGrade from "@/router/class-grade.js";
import Records from "@/router/records.js";
import DataControl from "@/router/data-control.js";
import Compliance from "@/router/compliance.js";
import Message from "element-ui/packages/message/index.js";
import layout from "@/components/layout/layout.vue";
import slideMenu from "@/custom/slide-menu.vue";
import { PORTAL_LOGIN_URL } from "@/portal.config";
import Cookies from "js-cookie";
import { ENABLE_AUTH } from "@/constants";
const { getPublicPath } = require("@/publicPath");
Vue.use(Router);
// 判断路由是否请求
let isRouterPush = false;
let routers = [
  user,
  system,
  home,
  asset,
  ClassGrade,
  Compliance,
  Records,
  DataControl,
];

/**
 * 动态设置icon图标及title
 */
// function getSystemIcon() {
//   store.dispatch("base/projectIcon$$");
// }
/**
 * 数组扁平化处理函数
 */

function arrayToFlat(arr) {
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? arrayToFlat(next) : next);
  }, []);
}
let orgData = arrayToFlat(routers);

const formatMenus = (data = []) => {
  return data.map((item) => {
    const { code, menuName, hidden, children } = item;
    return {
      name: code,
      meta: {
        title: menuName,
        hidden: hidden,
      },
      children: Array.isArray(children) ? formatMenus(children) : [],
    };
  });
};

let effectiveArr = [];

/**
 * 将层级路由变为以为数组形式，便于keep-alive处理
 */

const router = new Router({
  base: getPublicPath(),
  mode: "hash",
  // 路由跳转后将top值设置为0
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      redirect: "index",
    },
    // {
    //   path: '/index',
    //   name: 'index',
    //   component: () => import('@/views/home/home.vue')
    // },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/login.vue"),
      meta: {
        noRequireAuth: true,
      },
    },
    {
      path: "/password-reset",
      name: "password-reset",
      component: () => import("@/views/login/password-reset.vue"),
      meta: {
        noRequireAuth: true,
      },
    },
    // 授权管理页面
    {
      path: "/licence",
      name: "licence",
      component: () => import("@/views/system/configManage/licenseConfig.vue"),
      meta: {
        noRequireAuth: true,
      },
    },
    {
      path: "/redirect", // 其他系统通过此路由免密进入系统路由
      name: "redirect",
      component: () => import("@/views/redirect/redirect.vue"),
      meta: {
        noRequireAuth: true,
      },
    },
  ],
});

/**
 * 主要用来拦截路由的钩子
 * @param to Route: 即将要进入的目标 路由对象 动态路由获取不到to.name值
 * TODO: 全部的静态路由，menu获取后替换掉
 * @param from: Route: 当前导航正要离开的路由
 * @param next: Function: 一定要调用该方法来 resolve 这个钩子
 */
router.beforeEach(async (to, from, next) => {
  // 动态设置系统icon及title
  // getSystemIcon();
  // debugger
  // 1.不需要权限的路由直接放行
  // 2.没有token或者token过期的情况，直接拒到登录页
  // 判断页面url是否含有code，code为单点登录标识
  let code = getQueryString("sso_token_key") || getQueryString("param");
  // const isPortal = Boolean(Cookies.get('ticket'))
  const isPortal = true;
  // return
  if (to.name === "login") {
    const moduleId = Cookies.get("moduleId");
    let url = PORTAL_LOGIN_URL;
    // 不存在moduleId时，不使用redirectUrl跳转回来
    if (moduleId) {
      url = url + `?redirectUrl=${encodeURIComponent(window.location.href)}`;
    }
    window.location.href = url;
  }
  if (isPortal) {
    // nothing
  } else if (to.meta.noRequireAuth) {
    return next();
  } else if (!store.getters["base/token$$"] && !code) {
    // debugger
    return next({
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    });
    // code存在，切路由还未请求时候，触发单点登录， isRouterPush避免死循环
  } else if (code && !isRouterPush) {
    // debugger
    try {
      // 清除之前用户的登陆路由信息
      store.commit("permission/SET_PERMISSION");
      store.commit("permission/SET_MENU_LIST", []);
      await getToken(code);
      await validHasPermission({ code });
    } catch (error) {
      // 单点登录失败，则如今登陆页面
      return next({
        name: "login",
        query: {
          redirect: to.fullPath,
        },
      });
    }
  }
  // 路由权限，首次进入会根据路由权限添加路由树
  if (
    !store.state.permission.menuList ||
    !store.state.permission.menuList.length
  ) {
    isRouterPush = true;
    let routersPermission = [];
    let permission = {};
    let resources = {};
    try {
      // 请求权限
      // LOGIN COMMENTS
      let menus = require("../../mock/sys/menus.json").content.routers;
      if (ENABLE_AUTH) {
        const { menuInfo } = await request({
          url: "/gov/api/auth/userInfo",
        });
        menus = formatMenus(menuInfo);
        eachArr(menuInfo, (item) => {
          const { code, functionType, parent } = item;
          if (functionType === "menu") {
            if (!resources[code]) {
              resources[code] = {};
            }
          } else if (functionType === "button") {
            const parentCode = parent?.code;
            if (resources[parentCode]) {
              resources[parentCode][code] = true;
            }
          }
        });
      }
      if (menus) {
        routersPermission = menus || [];
        permission = menus.permission || {};
      }
    } catch (e) {
      isRouterPush = false;
      Message({
        type: "error",
        message: "菜单权限获取失败，建议稍后尝试重新登录。",
      });
      // 避免和probe.vue逻辑重复，重复跳转到login页面
      if (e.errorCode === "401") {
        //
      }
      return next({
        name: "login",
        query: {
          redirect: to.fullPath,
        },
      });
    }

    store.commit("permission/SET_PERMISSION", permission);
    store.commit("permission/SET_RESOURCE", resources);
    // 根据权限合并生成新的路由树
    let newRouters = mergeRouter(orgData, routersPermission);
    // 根据路由配置生成菜单，路由发生变化后请放开此行注释，具体操作请查看 README !!!
    // require("./generateMenus.js").default(newRouters);

    /**
     * 获取当前后端有效的菜单权限路由
     * [{children:[{}]}] ========> [{},{}]
     */
    const getEffectiveMenuArr = function (data) {
      if (data) {
        if (Array.isArray(data) && data.length) {
          data.map((item) => item && getEffectiveMenuArr(item));
        } else if (typeof data === "object") {
          if (
            data.hasOwnProperty("children") &&
            data.children &&
            data.children.length
          ) {
            getEffectiveMenuArr(data.children);
          } else {
            // 匹配掉 hidden和权限控制的的路由
            if (data.meta && (!data.meta.hidden || !data.meta.manageFree)) {
              effectiveArr.push(data);
            }
          }
        }
      }
    };
    getEffectiveMenuArr(JSON.parse(JSON.stringify(newRouters)));
    // debugger
    // 如果有3级目录，在2级目录redirect 三级的第一项
    // 后续优化代码
    // TODO
    newRouters.map((item) => {
      item.children &&
        item.children.length &&
        item.children.map((itemI) => {
          itemI.children &&
            itemI.children.length &&
            (itemI.redirect = { name: itemI.children[0].name });
        });
    });
    router.addRoutes(newRouters);
    // 更新菜单中依赖的数据
    store.commit("permission/SET_MENU_LIST", newRouters);
    // // 404 页面
    // zipRouterAry.push({
    //   path: '*',
    //   name: 'permission-404',
    //   component: () => import('@/views/permission/404.vue'),
    //   meta: {
    //     noRequireAuth: true,
    //     title: '没有权限'
    //   }
    // })
    // router.addRoutes(newRouters)

    if (!routersPermission.length) {
      isRouterPush = false;
      return next({
        // name: 'permission-404'
        name: "login",
      });
    }
    // debugger
    // 如果是根路径，默认跳到路由中的第一个
    // 跳转到默认应用
    // 刷新页面 to.name 为null
    // Todo -此处判断证书是否有效，判断页面跳转路径 store.getter['base/licenseExpire']
    // this.$router.push({
    //   name: 'licence'
    // })
    // debugger

    // 路由树存在 如果即将跳转的页面在路由树中存在，则跳转到该页面，如果不存在，则跳转到路由第一项
    // 路由树不存在---》不处理
    // to.name存在于路由中场景
    if (
      to.name &&
      effectiveArr.length &&
      effectiveArr.some(({ name }) => name === to.name)
    ) {
      // debugger
      // 使用path的话 当第一个路由的路径是/:id这种形式时 第一次进入页面时会直接在浏览器url上显示出 /:id，这里所以使用name
      return next({
        name: to.name === "index" ? "index" : to.name,
        query: to.query,
      });
      // to.name不存在于路由中场景
    } else if (to.name && effectiveArr.length) {
      return next({
        name: effectiveArr[0].name,
        query: to.query,
      });
      // 首页不存在与路由中的场景
    } else if (to.path === "/index" && effectiveArr.length) {
      return next({
        name: effectiveArr[0].name,
        query: to.query,
      });
    }
    // 主要为 to.name为空
    next(to);
  }
  // 首页不存在与路由中的场景
  if (
    to.path === "/index" &&
    effectiveArr.length &&
    !effectiveArr.some(({ name }) => name === "index")
  ) {
    return next({
      name: effectiveArr[0].name,
      query: to.query,
    });
  }

  // 判断外部链接
  if (to.meta.external) {
    const url = store.state.base.globalConfig[to.meta.external];
    if (url) {
      window.open(url);
    } else {
      Message({
        type: "error",
        message: "暂无该链接的配置（请在前端config.js文件中进行配置）。",
      });
    }
    // 中断路由
    return next(false);
  }
  next();
});

/**
 * 根据后台路由权限树，从原有的路由树中摘下对应的配置。
 * 会对每个路由的 meta 与 权限中的 meta 进行合并(权限中的优先级高)
 * @param {*} originRoutes
 * @param {*} configRoutes
 */

function mergeRouter(originRoutes, configRoutes, handler) {
  let _index = handler || 0;
  let arr = [];
  for (const cval of configRoutes) {
    // 给父级赋值
    let obj = {};
    obj.name = cval.name;
    obj.meta = cval.meta;
    for (const oval of originRoutes) {
      if (oval.name === cval.name) {
        obj = Object.assign(obj, cval, oval);
        obj.meta = Object.assign({}, oval.meta, cval.meta, {
          hidden: oval.meta && oval.meta.hidden,
        }); // meta以originRoutes配置为主
        obj.path = oval.path
          ? oval.path
          : (_index === 0 ? "/" : "") + cval.name;
      }
      if (!obj.component) {
        switch (_index) {
          case 0:
            obj.component = layout;
            break;
          case 1:
            obj.component = slideMenu;
            break;
          default:
            obj.component = slideMenu;
        }
      }
    }
    if (!!cval.children && cval.children.length > 0) {
      obj.children = mergeRouter(originRoutes, cval.children, _index + 1);
    }
    if (obj.path) {
      arr.push(obj);
    }
  }
  return arr;
}

export default router;
