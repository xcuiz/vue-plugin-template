import Vue from 'vue';
import Router from 'vue-router';

const Example = () => import('@/views/example/index.vue')

Vue.use(Router);

export default new Router({
  routes: [
    path: '/',
    name: 'Example',
    component: Example
  ]
});
