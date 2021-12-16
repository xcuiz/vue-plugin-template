/*
 * @Author: your name
 * @Date: 2020-09-02 14:33:53
 * @LastEditTime: 2020-09-02 14:34:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/mixins/filter.js
 */
export default {
  filters: {
    // 表格 无值返回 ‘-’
    formateTableData(val) {
      return typeof val === "number" ? val : val || "-";
    },
  },
};
