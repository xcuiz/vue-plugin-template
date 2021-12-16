import Vue from 'vue';
import Router from 'vue-router';
const { getPublicPath } = require("@/publicPath");

const Example = () => import('@/views/example/index.vue')

Vue.use(Router);

export default new Router({
  base: getPublicPath(),
  mode: "history",
  routes: [{
    path: '/',
    name: 'Example',
    component: Example
  }]
});
