import Vue from 'vue';{{/if_eq}}
import Router from 'vue-router';{{/if_eq}}

const IndexPage = (resolve)=>{require(['../page/IndexPage.vue'], resolve)};

Vue.use(Router);{{/if_eq}}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: IndexPage,{{/if_eq}}
    },{{/if_eq}}
  ],{{/if_eq}}
});{{/if_eq}}
