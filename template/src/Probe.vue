<!--
 * @Author: yincheng
 * @Date: 2021-04-01 10:11:31
 * @LastEditors: yincheng
 * @LastEditTime: 2021-07-22 16:01:35
-->
<!--
 * @Author: your name
 * @Date: 2020-08-27 15:20:25
 * @LastEditTime: 2021-06-21 16:32:14
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/Probe.vue
-->
<template>
  <div></div>
</template>
<script>
import { PORTAL_LOGIN_URL } from "@/portal.config";
// import { Message } from 'element-ui'
import Cookies from "js-cookie";
export default {
  name: "Probe",
  watch: {
    // 检测是否需要重新登录
    "$store.state.base.isReLogin": {
      async handler(val) {
        if (val) {
          setTimeout(() => {
            // 销毁vue实例
            // this.$root.$destroy();
            // 跳转到登录
            // location.href = this.$router.resolve({ name: "login" }).href;
            const moduleId = Cookies.get("moduleId");
            let url = PORTAL_LOGIN_URL;
            // 不存在moduleId时，不使用redirectUrl跳转回来
            if (moduleId) {
              url =
                url +
                `?redirectUrl=${encodeURIComponent(window.location.href)}`;
            }
            window.location.href = url;
          }, 1000);

          // Message.error({
          //   message: '登录信息已失效，请重新登录',
          //   duration: 1000,
          //   onClose: () => {
          //     // 销毁vue实例
          //     this.$root.$destroy()
          //     // 跳转到登录
          //     location.href = this.$router.resolve({ name: 'login' }).href
          //   }
          // })
        }
      },
      immediate: true,
    },
  },
};
</script>
