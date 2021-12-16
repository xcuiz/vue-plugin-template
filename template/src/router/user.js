/*
 * @Author: your name
 * @Date: 2020-07-29 14:42:34
 * @LastEditTime: 2020-08-04 14:40:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/router/user.js
 */
/**
 * Created by ligang on 2018/6/7.
 */
export default [
  // 菜单中不展示用户菜单
  {
    name: "user-manage",
    meta: {
      hidden: true,
      manageFree: true,
    },
  },
  {
    path: "msg",
    name: "user-msg",
    component: () => import("@/views/user/msg.vue"),
    meta: { title: "消息中心" },
  },
  {
    path: "download-center",
    name: "user-download-center",
    component: () => import("@/views/user/download-center.vue"),
    meta: { title: "下载中心", noCache: true },
  },
  {
    path: "/user/user-info",
    name: "user-info",
    component: () => import("@/views/user/pages/userInfo/index.vue"),
    meta: {
      manageFree: true,
      title: "账号信息",
      hidden: true,
      breadcrumb: [
        {
          name: "账号信息",
        },
      ],
    },
  },
];
