/*
 * @Author: your name
 * @Date: 2020-04-01 18:09:57
 * @LastEditTime: 2020-07-02 16:07:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/manage/data-access/list/indexServe.js
 */
const BASE_URL = "/gov/api/sys";
const API = {
  LIST: {
    url: BASE_URL + "/roles/page",
    method: "post",
    tag: "getData",
  },
  // 删除操作
  DELETE_SOURCE: {
    url: BASE_URL + "/roles/delete",
    method: "post",
  },
};
export default {
  methods: {
    // 查询table数据
    async getList() {
      const { orderField, orderType } = this.tableData;
      let result = await this.$request({
        ...API.LIST,
        data: {
          ...this.filterFormData,
          orderField,
          orderType,
        },
      });
      this.tableData = Object.assign(this.tableData, result);
    },

    /**
     * 删除选中的项
     */
    handleDelete() {
      let arr = [...this.tableData.multipleSelection];
      if (!arr.length) {
        return this.$message.error("请选择有效的对象");
      }
      // 获取id，逗号拼接
      let idList = arr.map((item) => item.roleId);
      this.$confirm("删除角色将不可恢复，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 删除操作
          await this.$request({
            ...API.DELETE_SOURCE,
            data: {
              idList: idList,
            },
          });
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
