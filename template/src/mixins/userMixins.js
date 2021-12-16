import { PORTAL_LOGIN_URL } from "@/portal.config";
import Cookies from "js-cookie";
const API = {
  LOGOUT: {
    url: "/gov/api/logout",
    method: "post",
  },
};

export default {
  methods: {
    logout() {
      this.$request({
        ...API.LOGOUT,
      }).then(() => {
        this.$root.$destroy();
        // location.href = this.$router.resolve({ name: "login" }).href; // 调转到登录页
        const moduleId = Cookies.get("moduleId");
        let url = PORTAL_LOGIN_URL;
        // 不存在moduleId时，不使用redirectUrl跳转回来
        if (moduleId) {
          url =
            url + `?redirectUrl=${encodeURIComponent(window.location.href)}`;
        }
        window.location.href = url;
      });
    },
  },
};
