const Example = () => import("@/views/example/index.vue");

const routes = [
  {
    path: "/",
    name: "Example",
    component: Example,
  },
]

export default routes
