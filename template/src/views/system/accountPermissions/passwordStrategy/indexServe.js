/*
 * @Author: your name
 * @Date: 2020-04-01 18:09:57
 * @LastEditTime: 2020-05-06 14:15:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/manage/data-access/list/indexServe.js
 */
const API = {
  SAVE: {
    url: "/gov/api/sys/password/save",
    method: "POST",
  },
  QUERY: {
    url: "/gov/api/sys/password/query",
    method: "GET",
  },
};
export default {
  methods: {
    async save(data) {
      let result = await this.$request({
        ...API.SAVE,
        data,
      });
      this.form = Object.assign(this.form, result);
    },
    async query() {
      let result = await this.$request({
        ...API.QUERY,
      });
      this.form = Object.assign(this.form, result);
      return result;
    },
  },
};
