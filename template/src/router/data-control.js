export default [
  {
    name: "data-control",
    icon: "datamonitoring",
  },
  {
    name: "full-control",
  },
  {
    name: "data-list",
    path: "data-list",
    meta: {
      title: "全量资产清单",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "全量资产清单",
        },
        {
          name: "全量字段",
        },
      ],
    },
    component: () =>
      import("@/views/data-control/sensitive-control/data-list/index.vue"),
  },
  {
    name: "increased-file-full",
    path: "increased-file-full",
    meta: {
      title: "全量资产清单",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "全量资产清单",
        },
        {
          name: "全量文件",
        },
      ],
    },
    component: () =>
      import(
        "@/views/data-control/sensitive-control/increased-file-full/index.vue"
      ),
  },
  {
    name: "sensitive-control",
  },
  {
    name: "increased-db",
    path: "increased-db",
    icon: "nddata",
    meta: {
      title: "涉敏库",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "涉敏资产清单",
        },
        {
          name: "涉敏库",
        },
      ],
    },
    component: () =>
      import("@/views/data-control/sensitive-control/increased-db/index.vue"),
  },
  {
    name: "increased-table",
    path: "increased-table",
    icon: "ndfile",
    meta: {
      title: "涉敏表",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "涉敏资产清单",
        },
        {
          name: "涉敏表",
        },
      ],
    },
    component: () =>
      import(
        "@/views/data-control/sensitive-control/increased-table/index.vue"
      ),
  },
  {
    name: "increased-field",
    path: "increased-field",
    icon: "zdsensitive",
    meta: {
      title: "涉敏字段",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "涉敏资产清单",
        },
        {
          name: "涉敏字段",
        },
      ],
    },
    component: () =>
      import(
        "@/views/data-control/sensitive-control/increased-field/index.vue"
      ),
  },
  {
    name: "increased-dir",
    path: "increased-dir",
    icon: "mlsensitive",
    meta: {
      title: "涉敏目录",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "涉敏资产清单",
        },
        {
          name: "涉敏目录",
        },
      ],
    },
    component: () =>
      import("@/views/data-control/sensitive-control/increased-dir/index.vue"),
  },
  {
    name: "increased-file",
    path: "increased-file",
    icon: "filesensitive",
    meta: {
      title: "涉敏文件",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "涉敏资产清单",
        },
        {
          name: "涉敏文件",
        },
      ],
    },
    component: () =>
      import("@/views/data-control/sensitive-control/increased-file/index.vue"),
  },
  {
    name: "report-config",
    path: "report",
    meta: {
      title: "监控报表配置",
      breadcrumb: [
        {
          name: "数据资产清单",
        },
        {
          name: "监控报表配置",
        },
      ],
    },
    component: () => import("@/views/data-control/report/index.vue"),
  },
];
