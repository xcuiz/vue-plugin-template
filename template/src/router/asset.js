export default [
  {
    name: "asset",
    icon: "explore",
  },
  {
    name: "scan-task-list",
    path: "data-source-detect/scan-task/list",
    icon: "shujuziyuan",
    meta: {
      title: "数据资源发现",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源发现",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/scan-task/list.vue"),
  },
  {
    name: "scan-task-detail",
    path: "data-source-detect/scan-task/detail/:taskId",
    props: true,
    meta: {
      title: "扫描任务结果",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源发现",
          path: "scan-task-list",
        },
        {
          name: "扫描任务结果",
        },
      ],
      hidden: true,
      manageFree: true,
    },
    component: () =>
      import("@/views/asset/data-source-detect/scan-task/detail.vue"),
  },
  {
    name: "source-detect-task",
    path: "source-detect-task",
  },
  {
    name: "source-detect-task-list",
    path: "list",
    icon: "saomiao",
    meta: {
      title: "敏感识别任务",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "敏感识别任务",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/source-detect-task/list.vue"),
  },
  {
    name: "source-detect-task-report",
    path: "report/:taskId",
    props: true,
    meta: {
      title: "敏感发现",
      hidden: true,
      manageFree: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "敏感发现",
        },
        {
          name: "敏感识别任务",
          path: "source-detect-task-list",
        },
        {
          name: "敏感发现任务报告",
        },
      ],
    },
    component: () =>
      import("@/views/asset/data-source-detect/source-detect-task/report.vue"),
  },
  {
    name: "source-detect-asset-report",
    path: "asset-report/:taskId/:storageMode/:assetId",
    props: true,
    meta: {
      title: "敏感资产报告",
      hidden: true,
      manageFree: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "敏感发现",
        },
        {
          name: "敏感识别任务",
          path: "source-detect-task-list",
        },
        {
          name: "敏感资产报告",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source-detect/source-detect-task/asset-report.vue"
      ),
  },
  {
    name: "source-detect-task-progress",
    path: "task-progress/:taskId",
    props: true,
    meta: {
      title: "敏感资产报告",
      hidden: true,
      manageFree: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "敏感发现",
        },
        {
          name: "敏感识别任务",
          path: "source-detect-task-list",
        },
        {
          name: "任务进度",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source-detect/source-detect-task/task-progress.vue"
      ),
  },
  {
    name: "data-source",
    path: "data-source",
  },
  {
    name: "source-detect-template",
    path: "source-detect-template",
    icon: "template",
    meta: {
      title: "扫描模版管理",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "扫描模版",
        },
        {
          name: "扫描模版管理",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source-detect/source-detect-template/ip-address/list.vue"
      ),
  },
  {
    name: "data-source-etl",
    path: "data-source-etl",
  },
  {
    name: "collection-manage",
    path: "collection-manage/list",
    icon: "nddata",
    meta: {
      title: "同步任务",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "同步任务",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/collection-manage/list.vue"
      ),
  },
  {
    name: "add-collection",
    path: "collection-manage/add",
    props: { type: "add" },
    meta: {
      title: "新建同步任务",
      hidden: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "同步任务",
          path: "collection-manage",
        },
        {
          name: "新建同步任务",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/collection-manage/form.vue"
      ),
  },
  {
    name: "edit-collection",
    path: "collection-manage/:id/edit",
    props: (route) => ({ id: route.params.id, type: "edit" }),
    meta: {
      title: "编辑同步任务",
      hidden: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "同步任务",
          path: "collection-manage",
        },
        {
          name: "编辑同步任务",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/collection-manage/form.vue"
      ),
  },
  {
    name: "collection-script",
    path: "collection-script/list",
    icon: "script",
    meta: {
      title: "同步脚本",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "同步脚本",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/collection-script/list.vue"
      ),
  },
  {
    name: "add-collection-script",
    path: "collection-script/add",
    props: { type: "add" },
    meta: {
      title: "同步脚本",
      hidden: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "同步脚本",
          path: "collection-script",
        },
        {
          name: "新建采集脚本",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/collection-script/form.vue"
      ),
  },
  {
    name: "edit-collection-script",
    path: "collection-script/:id/edit",
    props: (route) => ({ id: route.params.id, type: "edit" }),
    meta: {
      title: "同步脚本",
      hidden: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "同步脚本",
          path: "collection-script",
        },
        {
          name: "新建采集脚本",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/collection-script/form.vue"
      ),
  },
  {
    name: "data-sync-sql",
    path: "data-sync-sql/list",
    icon: "ETL-SQL",
    meta: {
      title: "资源同步",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "资源同步",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/data-sync-sql/list.vue"
      ),
  },
  {
    name: "collection-sql-record",
    path: "data-sync-sql/:id/record",
    props: true,
    meta: {
      title: "运行记录",
      hidden: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源同步",
        },
        {
          name: "同步任务",
          path: "data-sync-sql",
        },
        {
          name: "运行记录",
        },
      ],
    },
    component: () =>
      import(
        "@/views/asset/data-source/data-source-etl/data-sync-sql/record.vue"
      ),
  },
  {
    name: "sensitive",
  },
  {
    name: "data-resource-manage",
    path: "data-resource-manage",
  },
  {
    name: "data-resource",
    path: "data-resource/list",
    icon: "shujuziyuanlist",
    meta: {
      title: "数据资源清单管理",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "资源管理",
        },
        {
          name: "数据资源清单管理",
        },
      ],
    },
    component: () => import("@/views/sensitive/data-resource-manage/list.vue"),
  },
  {
    name: "data-resource-detail",
    path: "data-resource-detail/:id",
    props: true,
    meta: {
      title: "数据资源清单管理详情",
      manageFree: true,
      hidden: true,
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "资源管理",
        },
        {
          name: "数据资源清单管理",
          path: "data-resource",
        },
        {
          name: "数据资源清单详情",
        },
      ],
    },
    component: () =>
      import("@/views/sensitive/data-resource-manage/detail.vue"),
  },
  {
    name: "claim-resource",
    path: "claim-resource/list",
    icon: "renlinglist",
    meta: {
      title: "数据资源管理",
      breadcrumb: [
        {
          name: "检测识别",
        },
        {
          name: "数据资源认领",
        },
        {
          name: "资源认领",
        },
      ],
    },
    component: () => import("@/views/sensitive/resource-claim/list.vue"),
  },
];
