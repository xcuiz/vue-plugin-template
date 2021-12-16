/*
 * @Author: yincheng
 * @Date: 2021-06-22 14:43:54
 * @LastEditors: yincheng
 * @LastEditTime: 2021-07-15 15:11:10
 */
import { ENABLE_AUTH } from "@/constants";
export default {
  name: "auth",
  hooks: {
    inserted(el, binding, vnode) {
      if (!ENABLE_AUTH) {
        return;
      }
      const _el = el;
      const { context } = vnode;
      const { value } = binding;
      if (!value) {
        return;
      }
      const routeName = context.$route.name;
      const resources = context.$store.state.permission.resources;
      const hasResource = resources?.[routeName]?.[value];
      if (!hasResource) {
        _el.parentElement && _el.parentElement.removeChild(_el);
      }
    },
  },
};
