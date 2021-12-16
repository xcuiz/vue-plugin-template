import Vue from 'vue';
import Router from 'vue-router';

const IndexPage = (resolve)=>{require(['../page/IndexPage.vue'], resolve)};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: IndexPage,
    },
  ],
});
