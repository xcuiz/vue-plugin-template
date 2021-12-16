export default {
  methods: {
    async getList(id) {
      let res = await this.$request({
        method: "GET",
        url: "/gov/api/base/sync/record/" + id,
      });
      this.tableData = Object.assign(this.tableData, res);
    },
  },
};
