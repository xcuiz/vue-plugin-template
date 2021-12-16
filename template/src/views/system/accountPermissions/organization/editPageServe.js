/*
 * @Author: your name
 * @Date: 2020-04-23 11:00:32
 * @LastEditTime: 2020-04-24 17:37:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/system/manageBaseUser/editPageServe.js
 */
export default {
  methods: {
    /**
     * 获取当前表单的数据
     * @param {String} val 请求的id值
     */
    async getData(val) {
      const res = await this.$request({
        method: "get",
        url: `/gov/api/sys/org/detail/${val}`,
        tag: "init",
      });
      this.formData = Object.assign(this.formData, res);
    },
    /**
     * 初始化密码
     */
    async createPassword() {
      const res = await this.$request({
        method: "post",
        url: "/gov/api/sys/user/createPassword",
        tag: "init",
      });
      this.formData.passwordNew = res;
      this.$refs.form.validateField("passwordNew");
    },
    /**
     * 新增组织，成功则关闭弹窗
     */
    async addOrganization() {
      await this.$request({
        method: "post",
        url: "/gov/api/sys/org/save",
        data: this.formData,
        tag: "init",
      });
      // 请求列表数据，并关闭当前页面
      this.$emit("handleGetTableData");
      this.closeDialog();
    },
    /**
     * 编辑组织
     * @param {sting} val id值
     */
    async editOrganization(val) {
      await this.$request({
        method: "put",
        url: `/gov/api/sys/org/${val}`,
        data: this.formData,
        tag: "init",
      });
      // 请求列表数据，并关闭当前页面
      this.$emit("handleGetTableData");
      this.closeDialog();
    },
    /**
     * 获取部门
     * @param {sting} val id值
     */
    async getDepts() {
      const res = await this.$request({
        method: "get",
        url: `/gov/api/sys/org/dept`,
      });
      return res;
    },
  },
};
