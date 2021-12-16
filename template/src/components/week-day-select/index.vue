<!--
 * @Author: yincheng
 * @Date: 2021-04-23 15:53:39
 * @LastEditors: yincheng
 * @LastEditTime: 2021-04-28 11:12:12
-->
<template>
  <el-select v-bind="$attrs" v-on="$listeners">
    <el-option
      v-for="option in WEEK_DAYS"
      :key="option.code"
      :value="option.code"
      :label="option.name"
    ></el-option>
  </el-select>
</template>
<script>
import { WEEK_DAYS } from "@/constants";
export default {
  data() {
    return {
      WEEK_DAYS,
    };
  },
};
</script>
