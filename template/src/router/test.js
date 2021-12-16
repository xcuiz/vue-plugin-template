export default [
  {
    path: "test1",
    name: "test-one",
    component: () => import("@/views/test/test-one.vue"),
    meta: { title: "测试页面一" },
  },
  {
    path: "test2",
    name: "test-tow",
    component: () => import("@/views/test/test-tow.vue"),
    meta: { title: "测试页面二" },
  },
  {
    path: "test3",
    name: "test-three",
    component: () => import("@/views/test/test-demo/test-three.vue"),
    meta: { title: "测试页面三" },
  },
  {
    path: "test4",
    name: "test-four",
    component: () => import("@/views/test/test-demo/test-four.vue"),
    meta: { title: "测试页面四" },
  },
];
