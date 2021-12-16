const BASE_URL = "/gov/api/sys/download-task";
const API = {
  DOWNLOAD_QUERY: {
    url: `${BASE_URL}/list/query`,
    method: "post",
    tag: "table-list",
  },
  DOWNLOAD_DELETE: {
    url: `${BASE_URL}/delete`,
    method: "post",
    tag: "table-list",
  },
};

export default {
  methods: {
    async getTableListData() {
      let result = await this.requestTable({
        ...API.DOWNLOAD_QUERY,
        currentObj: this.tableListData,
        params: { ...this.formData, ...this.globalTime },
      });
      this.tableListData = Object.assign({}, result);
      this.tableListData.data.map((item) => this.$set(item, "flag", false));
    },
    // 删除
    async deleteTableListData(ids = []) {
      await this.$request({
        ...API.DOWNLOAD_DELETE,
        data: { ids },
      });
      this.showMessage("删除成功！");
    },
  },
};
