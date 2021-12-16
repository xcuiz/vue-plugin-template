/*
 * @Author: your name
 * @Date: 2021-03-10 14:58:56
 * @LastEditTime: 2021-04-06 09:41:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\router\records.js
 */
export default [
  {
    name: "put-records",
    icon: "beian",
  },
  {
    name: "data-asset-records",
  },
  {
    name: "record-list",
    path: "record-list",
    icon: "beian",
    meta: {
      title: "敏感数据资产备案",
      breadcrumb: [
        {
          name: "数据备案",
        },
        {
          name: "敏感数据资产备案",
        },
      ],
    },
    component: () =>
      import("@/views/put-records/data-asset-records/record-list.vue"),
  },
  {
    name: "claim-list",
    path: "claim-list",
    icon: "renling",
    meta: {
      title: "敏感数据资产认领",
      breadcrumb: [
        {
          name: "数据备案",
        },
        {
          name: "敏感数据资产认领",
        },
      ],
    },
    component: () =>
      import("@/views/put-records/data-asset-records/claim-list.vue"),
  },
  {
    name: "data-asset-record-detail",
    path: "data-asset-records/detail",
    meta: {
      title: "敏感数据资产备案",
      manageFree: true,
      hidden: true,
      breadcrumb: [
        {
          name: "数据备案",
        },
        {
          name: "敏感数据资产备案",
          path: "record-list",
        },
        {
          name: "敏感数据资产备案详情",
        },
      ],
    },
    component: () =>
      import("@/views/put-records/data-asset-records/info-detail.vue"),
  },
  {
    name: "data-asset-claim-detail",
    path: "data-asset-claim/detail",
    meta: {
      title: "敏感数据资产备案",
      manageFree: true,
      hidden: true,
      breadcrumb: [
        {
          name: "数据备案",
        },
        {
          name: "敏感数据资产认领",
          path: "claim-list",
        },
        {
          name: "敏感数据资产认领详情",
        },
      ],
    },
    component: () =>
      import("@/views/put-records/data-asset-records/info-detail.vue"),
  },
  {
    name: "white-scene",
  },
  {
    name: "sensitive-data-exception",
    path: "sensitive-data-exception",
    meta: {
      title: "涉敏字段",
      breadcrumb: [
        {
          name: "数据备案",
        },
        {
          name: "涉敏资产例外场景",
        },
        {
          name: "涉敏字段",
        },
      ],
    },
    component: () =>
      import("@/views/put-records/sensitive-data-exception/list.vue"),
  },
  {
    name: "increased-file-white",
    path: "increased-file-white",
    meta: {
      title: "涉敏文件",
      breadcrumb: [
        {
          name: "数据备案",
        },
        {
          name: "涉敏资产例外场景",
        },
        {
          name: "涉敏文件",
        },
      ],
    },
    component: () =>
      import(
        "@/views/put-records/sensitive-data-exception/increased-file-white.vue"
      ),
  },
];
