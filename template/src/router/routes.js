const Example = () => import("@/views/example/index.vue");
{{#if_eq appType "sub"}}
const Sub = () => import("@/views/sub/index.vue");
{{/if_eq}}

const routes = [
  {
    path: "/",
    name: "Example",
    component: Example,
  },
  {{#if_eq appType "sub"}}
  {
    path: "/sub",
    name: "Sub",
    component: Sub,
  },
  {{/if_eq}}
]

export default routes
