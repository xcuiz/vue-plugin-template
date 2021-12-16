export default [
  {
    name: "class-grade",
    icon: "leiji",
  },
  {
    name: "data-class-manage",
    path: "data-class-manage",
    meta: {
      title: "敏感分类管理",
      breadcrumb: [
        {
          name: "分类分级",
        },
        {
          name: "敏感分类管理",
        },
      ],
    },
    component: () => import("@/views/class-grade/class/index.vue"),
  },
  {
    name: "data-level",
    path: "data-level",
    meta: {
      title: "敏感级别管理",
      breadcrumb: [
        {
          name: "分类分级",
        },
        {
          name: "敏感级别管理",
        },
      ],
    },
    component: () => import("@/views/class-grade/level/index.vue"),
  },
  {
    name: "sensitive-manage",
  },
  {
    name: "sensitive-feat",
    path: "sensitive-feat",
    icon: "mgsensitive",
    meta: {
      title: "敏感特征",
      breadcrumb: [
        {
          name: "分类分级",
        },
        {
          name: "敏感特征管理",
        },
        {
          name: "敏感特征",
        },
      ],
    },
    component: () => import("@/views/class-grade/sensitive-feat/index.vue"),
  },
  {
    name: "sensitive-template",
    path: "sensitive-template",
    icon: "tztemplate",
    meta: {
      title: "特征模板",
      breadcrumb: [
        {
          name: "分类分级",
        },
        {
          name: "敏感特征管理",
        },
        {
          name: "特征模板",
        },
      ],
    },
    component: () => import("@/views/class-grade/sensitive-template/index.vue"),
  },
  {
    name: "sensitive-strategy",
    path: "sensitive-strategy",
    meta: {
      title: "敏感策略管理",
      breadcrumb: [
        {
          name: "分类分级",
        },
        {
          name: "敏感策略管理",
        },
      ],
    },
    component: () => import("@/views/class-grade/strategy/index.vue"),
  },
  {
    name: "sensitive-element",
    path: "sensitive-element",
    meta: {
      title: "敏感元素管理",
      breadcrumb: [
        {
          name: "分类分级",
        },
        {
          name: "敏感元素管理",
        },
      ],
    },
    component: () => import("@/views/class-grade/element/index.vue"),
  },
];
