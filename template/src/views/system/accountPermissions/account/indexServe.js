/*
 * @Author: your name
 * @Date: 2020-04-01 18:09:57
 * @LastEditTime: 2020-09-10 09:50:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/manage/data-access/list/indexServe.js
 */
const API = {
  LIST: {
    url: "/gov/api/sys/user/query",
    method: "post",
    tag: "getData",
  },
  // 接入方式下拉框数据源
  GET_ROLES: {
    url: "/gov/api/sys/roles",
    method: "GET",
  },
  // 删除操作
  DELETE_SOURCE: {
    url: "/gov/api/sys/user/delete",
    method: "post",
  },
  IMPORT_FILE: {
    url: "/gov/api/sys/user/import",
    method: "post",
  },
};
export default {
  methods: {
    // 查询table数据
    async getList() {
      let result = await this.$request({
        ...API.LIST,
        data: {
          ...this.filterFormData,
        },
      });
      this.tableData = Object.assign(this.tableData, result);
    },
    deleteUsers(ids) {
      this.$confirm("删除后数据无法恢复，确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 删除操作
          await this.$request({
            ...API.DELETE_SOURCE,
            data: {
              idList: ids || [],
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
    /**
     * 导入账号
     */
    async importFile(data) {
      // debugger
      let result = await this.$request({
        ...API.IMPORT_FILE,
        data: data,
      });
      return result;
    },
  },
};
