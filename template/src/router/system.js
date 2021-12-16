/*
 * @Author: your name
 * @Date: 2020-04-21 11:42:17
 * @LastEditTime: 2021-04-30 14:25:54
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/router/system.js
 */
export default [
  {
    name: "system",
    icon: "system",
  },
  {
    name: "sys-log",
    meta: {
      hidden: true,
      title: "操作日志",
    },
  },
  {
    name: "operation-audit",
    icon: "systemlog1",
    component: () => import("@/views/system/operationAudit/index.vue"),
    meta: {
      hidden: false,
      manageFree: true,
      title: "操作审计",
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "操作日志",
        },
        {
          name: "操作审计",
        },
      ],
    },
  },
  {
    name: "notice",
    path: "/notice",
    icon: "news",
    meta: {
      hidden: true,
      manageFree: true,
    },
  },
  {
    name: "notice-list",
    path: "list",
    component: () => import("@/views/notice/list.vue"),
    meta: {
      hidden: true,
      manageFree: true,
      title: "消息中心",
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "消息中心",
        },
      ],
    },
  },
  {
    name: "data-source-detect",
    path: "data-source-detect/list",
    meta: {
      title: "探针管理",
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "探针管理",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/source-detect-probe/list.vue"),
  },
  {
    name: "data-source-detect-detail",
    path: "data-source-detect/:id",
    meta: {
      title: "扫描探针详情",
      hidden: true,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "探针管理",
          path: "data-source-detect",
        },
        {
          name: "扫描探针详情",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/source-detect-probe/detail.vue"),
  },
  {
    name: "data-source-detect",
    path: "data-source-detect/list",
    meta: {
      title: "探针管理",
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "探针管理",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/source-detect-probe/list.vue"),
  },
  {
    name: "data-source-detect-detail",
    path: "data-source-detect/:id",
    meta: {
      title: "扫描探针详情",
      hidden: true,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "探针管理",
          path: "data-source-detect",
        },
        {
          name: "扫描探针详情",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/source-detect-probe/detail.vue"),
  },
  {
    name: "application-manage",
    path: "application-manage",
    meta: {
      title: "应用系统管理",
      hidden: false,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "应用系统管理",
        },
      ],
    },
    component: () => import("@/views/system/applicationManage/index.vue"),
  },
  {
    name: "network-resourse",
    path: "network-resourse",
  },
  {
    name: "network-manage",
    path: "network-manage",
    icon: "network",
    meta: {
      title: "网络域管理",
      hidden: false,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "网络资源管理",
        },
        {
          name: "网络域管理",
        },
      ],
    },
    component: () => import("@/views/system/networkManage/index.vue"),
  },
  {
    name: "port-group-manage",
    path: "port-group-manage",
    icon: "portgroup",
    meta: {
      title: "端口组管理",
      hidden: false,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "网络资源管理",
        },
        {
          name: "端口组管理",
        },
      ],
    },
    component: () => import("@/views/system/port-group/index.vue"),
  },
  {
    name: "location-manage",
    path: "location-manage",
    meta: {
      title: "物理位置管理",
      hidden: false,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "物理位置管理",
        },
      ],
    },
    component: () => import("@/views/system/locationManage/index.vue"),
  },
  {
    name: "dept-manage",
    path: "dept-manage",
    meta: {
      title: "部门管理",
      hidden: false,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "部门管理",
        },
      ],
    },
    component: () => import("@/views/system/deptManage/index.vue"),
  },
  {
    name: "dictionary-manage",
    path: "dictionary-manage",
    meta: {
      title: "字典管理",
      hidden: false,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "字典管理",
        },
      ],
    },
    component: () => import("@/views/system/dictionaryManage/index.vue"),
  },
  {
    name: "pool-manage",
    path: "pool-manage",
    meta: {
      title: "资源池管理",
      hidden: false,
      breadcrumb: [
        {
          name: "系统管理",
        },
        {
          name: "资源池管理",
        },
      ],
    },
    component: () => import("@/views/system/poolManage/index.vue"),
  },
];
