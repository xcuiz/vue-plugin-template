<!--
 * @Author: yincheng
 * @Date: 2021-04-27 14:39:08
 * @LastEditors: yincheng
 * @LastEditTime: 2021-04-30 15:26:43
-->
<template>
  <div>
    <el-form-item v-if="showTypeSelect">
      <el-select
        :value="typeValue"
        style="width: 250px"
        @change="(value) => handleChange('type', value)"
      >
        <el-option :value="1" label="每日"></el-option>
        <el-option :value="2" label="每周"></el-option>
        <el-option :value="3" label="每月"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-form-item
        :label="typeLabel"
        label-width="50px"
        style="margin-bottom: 0"
      >
        <el-select
          v-if="typeValue === 2"
          :value="value.week"
          style="width: 90px; margin-right: 12px"
          @change="(value) => handleChange('week', value)"
        >
          <el-option
            v-for="item in WEEK_DAYS"
            :key="item.number"
            :value="item.number"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-select
          v-if="typeValue === 3"
          :value="value.day"
          style="width: 90px; margin-right: 12px"
          @change="(value) => handleChange('day', value)"
        >
          <el-option
            v-for="day in 31"
            :key="day"
            :value="day"
            :label="day + '号'"
          ></el-option>
        </el-select>
        <el-time-picker
          :value="[value.startTime, value.endTime]"
          value-format="HH:mm:ss"
          style="width: 372px"
          :clearable="false"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          @input="(value) => handleChange('times', value)"
        >
        </el-time-picker>
        <slot></slot>
      </el-form-item>
    </el-form-item>
  </div>
</template>
<script>
import { WEEK_DAYS } from "@/constants";

export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    type: {
      type: Number,
    },
    showTypeSelect: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      WEEK_DAYS,
    };
  },
  computed: {
    typeValue() {
      if (this.showTypeSelect) {
        return this.value.type;
      }
      return this.type;
    },
    typeLabel() {
      const typeMap = {
        1: "每日",
        2: "每周",
        3: "每月",
      };
      return typeMap[this.typeValue] || "";
    },
  },
  watch: {
    typeValue() {
      this.handleChange("type", this.typeValue);
    },
  },
  methods: {
    handleChange(key, value) {
      const newValue = { ...this.value };
      if (key === "times") {
        newValue.startTime = value[0];
        newValue.endTime = value[1];
      } else {
        newValue[key] = value;
      }
      this.$emit("input", newValue);
    },
  },
};
</script>
