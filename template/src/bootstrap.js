import Vue from "vue";
import App from "./App.vue";
{{#router}}
import router from "./router";
{{/router}}
{{#vuex}}
import store from "./store";
{{/vuex}}

Vue.config.productionTip = false;

const vue = new Vue({
  el: "#app",
  render: (h) => h(App),
  {{#router}}
  router,
  {{/router}}
  {{#vuex}}
  store,
  {{/vuex}}
});

export default vue;
