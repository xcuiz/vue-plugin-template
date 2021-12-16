/*
 * @Author: yincheng
 * @Date: 2021-03-24 18:06:27
 * @LastEditors: yincheng
 * @LastEditTime: 2021-08-10 16:19:29
 */
export default [
  {
    name: "compliance",
    icon: "socialfill",
  },
  {
    name: "app-monitor",
    path: "app-monitor",
    meta: {
      title: "APP合规检查",
      breadcrumb: [
        {
          name: "合规检测",
        },
        {
          name: "APP合规检查",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/app-monitor/index.vue"),
  },
  {
    name: "app-monitor-detail",
    path: "app-monitor-detail",
    meta: {
      title: "APP合规检查详情",
      hidden: true,
      breadcrumb: [
        {
          name: "合规检测",
        },
        {
          name: "APP合规检查",
          path: "app-monitor",
        },
        {
          name: "详情",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/app-monitor/MonitorDetail.vue"),
  },
  {
    name: "report",
    path: "report",
    meta: {
      title: "合规分析稽核报表",
      breadcrumb: [
        {
          name: "合规检测",
        },
        {
          name: "合规分析稽核报表",
        },
      ],
    },
    component: () => import("@/views/asset/data-source-detect/report"),
  },
  {
    name: "add-report",
    path: "report/add",
    props: { type: "add" },
    meta: {
      title: "新增报表配置",
      hidden: true,
      breadcrumb: [
        {
          name: "合规检测",
        },
        {
          name: "合规分析稽核报表",
          path: "report",
        },
        {
          name: "新增报表配置",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/report/detail.vue"),
  },
  {
    name: "edit-report",
    path: "report/:id/edit",
    props: (route) => ({ id: route.params.id, type: "edit" }),
    meta: {
      title: "编辑报表配置",
      hidden: true,
      breadcrumb: [
        {
          name: "合规检测",
        },
        {
          name: "合规分析稽核报表",
          path: "report",
        },
        {
          name: "编辑报表配置",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/report/detail.vue"),
  },
];
