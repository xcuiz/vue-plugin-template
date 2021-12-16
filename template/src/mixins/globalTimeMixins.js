/*
 * @Author: your name
 * @Date: 2020-07-20 17:55:50
 * @LastEditTime: 2020-07-20 18:24:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/mixins/globalTimeMixins.js
 */
import { mapState } from "vuex";
// 全局时间
export default {
  computed: {
    ...mapState("global", {
      globalTime: (state) => state.globalTime,
    }),
  },
  watch: {
    // 监听时间变化，变化时
    globalTime() {
      this.globalTimeChange && this.globalTimeChange();
    },
  },
};
