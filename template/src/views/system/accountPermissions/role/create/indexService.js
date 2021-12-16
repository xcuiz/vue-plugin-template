/*
 * @Author: your name
 * @Date: 2020-06-28 16:38:43
 * @LastEditTime: 2020-11-14 14:49:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/system/accountPermissions/role/create/indexServe.js
 */

export default {
  created() {
    this.getRoleList();
    this.getFunctionList();
    this.getAllChOrEs("es");
    this.getAllChOrEs("ch");
  },
  methods: {
    // 查询角色详情
    async getDetail(id) {
      try {
        const res = await this.$request({
          url: `/gov/api/sys/roles/${id}`,
          tag: "init",
        });
        // 通过isInvalid字段判断 数仓限制、索引限制是否有效，过滤无效字段
        Object.assign(res, {
          chCondition: res.chCondition.filter((t) => !t.isInvalid),
          esCondition: res.esCondition.filter((t) => !t.isInvalid),
        });
        res && (this.formData = res);
      } catch (error) {
        this.errorStatus = true;
      }
    },
    // 查询角色下拉列表
    async getRoleList() {
      try {
        const res = await this.$request({
          url: `/gov/api/sys/roles/queryAllRole`,
          method: "post",
          data: {
            roleName: "",
          },
        });
        this.setCurrentSource("step1", res || []);
        // res && (this.formData = res)
      } catch (error) {
        // this.setCurrentSource('step1', [])
        this.errorStatus = true;
      }
    },
    // 查询所有功能
    async getFunctionList() {
      try {
        const res = await this.$request({
          url: `/gov/api/sys/roles/queryAllFunction`,
        });
        this.setCurrentSource("step2", res || []);
      } catch (error) {
        this.errorStatus = true;
        this.setCurrentSource("step1", []);
      }
    },
    /**
     *查询所有数仓集/索引集
     * @param {String} type 查询类型：es,ch
     */
    async getAllChOrEs(type) {
      try {
        const res = await this.$request({
          url: `/gov/api/sys/roles/queryAllChOrEs`,
          method: "post",
          data: {
            tableName: "",
            type: type,
          },
        });
        this.setCurrentSource(type === "es" ? "step5" : "step3", res || []);
      } catch (error) {
        this.errorStatus = true;
        this.setCurrentSource(type === "es" ? "step5" : "step3", []);
      }
    },
    /**
     *保存
     * @param {Object} param 保存的数据
     */
    async save(param) {
      try {
        await this.$request({
          url: `/gov/api/sys/roles/save`,
          method: "post",
          data: param,
          tag: "init",
        });
        // 刷新表单
        this.$emit("refresh");
        // 关闭弹窗
        this.closeDialog();
      } catch (error) {
        //
      }
    },
  },
};
