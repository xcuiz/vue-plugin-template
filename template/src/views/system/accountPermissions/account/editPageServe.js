/*
 * @Author: your name
 * @Date: 2020-04-23 11:00:32
 * @LastEditTime: 2020-08-14 10:05:48
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
        url: `/gov/api/sys/user/${val}`,
        tag: "init",
      });
      this.formData = Object.assign(this.formData, res);
      this.reqFunctions(res.roleId);
      this.$refs.tree.setCheckedKeys([this.formData.defaultRouterId]);
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
    async addUser() {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...params } = this.formData;
      await this.$request({
        method: "post",
        url: "/gov/api/sys/user/save",
        data: params,
        tag: "init",
      })
        .then(() => {
          // 请求列表数据，并关闭当前页面
          this.$emit("handleGetTableData");
          this.closeDialog();
        })
        .catch(() => {
          this.formData.passwordNew = this.formData.confirmPassword;
          // yongli-2020/08/05 新增需求
          // this.formData.isNeedUpdatePassword = true
        });
    },
    /**
     * 编辑组织
     * @param {sting} val id值
     */
    async editOrganization(val) {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...params } = this.formData;
      await this.$request({
        method: "put",
        url: `/gov/api/sys/user/${val}`,
        data: params,
        tag: "init",
      });
      // 请求列表数据，并关闭当前页面
      this.$emit("handleGetTableData");
      this.closeDialog();
    },
    /**
     * 查询所有组织机构
     * @param {String} val 请求的id值
     */
    async queryAllOrg() {
      const res = await this.$request({
        method: "get",
        url: `/gov/api/sys/org/queryAllOrg`,
        tag: "init",
      });
      return res;
    },
    /**
     * 获取应用列表
     * @param {String} val 请求的id值
     */
    async getFunctionList() {
      const res = await this.$request({
        method: "get",
        url: `/gov/api/sys/roles/queryAllFunction`,
        tag: "init",
      });
      return res;
    },
    /**
     * 根据角色id查询功能-批量
     */
    async queryFunctionByIds(data) {
      const res = await this.$request({
        method: "post",
        url: `/gov/api/sys/roles/queryFunctionByIds`,
        data,
      });
      return res;
    },
  },
};
