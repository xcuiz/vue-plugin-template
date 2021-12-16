/*
 * @Author: your name
 * @Date: 2020-10-10 18:17:20
 * @LastEditTime: 2020-10-19 16:39:16
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/router/home.js
 */
/**
 * Created by sundong on 2019/6/25.
 */
export default [
  {
    path: "/index",
    name: "index",
    component: () => import("@/views/home-asset/index.vue"),
    icon: "home",
    meta: {
      // breadcrumb: [{
      //   name: '首页'
      // }],
      title: "首页",
    },
  },
];
