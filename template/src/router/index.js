import Vue from "vue";
import Router from "vue-router";
{{#if_eq appType "sub"}}
const { getPublicPath } = require("@/publicPath");
{{/if_eq}}
import routes from './routes'

{{#if_eq appType "main"}}
let allRoutes = [routes]

let remote = []
try {
  remote = require('{{remoteName}}/router/routes').default

  allRoutes.push(remote)
} catch(e) {
  console.error(e)
}
{{if_eq}}

Vue.use(Router);

const router = new Router({
  {{#if_eq appType "sub"}}
  base: getPublicPath(),
  {{/if_eq}}
  mode: "history",
  routes: {{#if_eq appType "main"}}allRoutes{{if_eq}}{{#if_eq appType "sub"}}routes{{if_eq}}
});

export default router
