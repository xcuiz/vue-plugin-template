const BASE_URL = "/api";

const API = {
  getRelativetime: BASE_URL + "/explore/dataexplore/relativetime",
  previewtime: BASE_URL + "/explore/dataexplore/previewtime",
};

export default {
  methods: {
    /**
     * 获取相对时间选项
     */
    async getRelativetime() {
      let result = await this.$request({
        method: "GET",
        url: API.getRelativetime,
      });
      return result;
    },
    /**
     * 相对时间预览
     */
    async previewtime(data) {
      let result = await this.$request({
        method: "POST",
        url: API.previewtime,
        data,
      });
      return result;
    },
  },
};
