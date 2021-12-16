<template>
  <el-form>
    <el-radio-group v-model="form.type">
      <el-form-item style="margin-bottom: 18px">
        <el-radio label="day"></el-radio>
        <div>每</div>
        <el-select
          v-model="form.day.freq"
          :disabled="dayDisabled"
          size="mini"
          style="width: 90px"
        >
          <el-option
            v-for="num in 12"
            :key="num"
            :label="num"
            :value="num"
          ></el-option>
        </el-select>
        <div>天</div>
        <div style="width: 200px"></div>
        <el-form-item label="时间">
          <el-time-picker
            v-model="form.day.time"
            :disabled="dayDisabled"
            size="mini"
            :value-format="timeFormat"
          >
          </el-time-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item style="margin-bottom: 18px">
        <el-radio label="week"></el-radio>
        <div>每</div>
        <el-select
          v-model="form.week.freq"
          :disabled="weekDisabled"
          size="mini"
          style="width: 90px"
        >
          <el-option
            v-for="num in 12"
            :key="num"
            :label="num"
            :value="num"
          ></el-option>
        </el-select>
        <div>周</div>
        <WeekDaySelect
          v-model="form.week.week"
          :disabled="weekDisabled"
          size="mini"
          style="width: 200px" />
        <el-form-item label="时间">
          <el-time-picker
            v-model="form.week.time"
            :disabled="weekDisabled"
            size="mini"
            :value-format="timeFormat"
          >
          </el-time-picker> </el-form-item
      ></el-form-item>
      <el-form-item style="margin-bottom: 18px">
        <el-radio label="month"></el-radio>
        <div>每</div>
        <el-select
          v-model="form.month.freq"
          :disabled="monthDisabled"
          size="mini"
          style="width: 90px"
        >
          <el-option
            v-for="num in 12"
            :key="num"
            :label="num"
            :value="num"
          ></el-option>
        </el-select>
        <div>月</div>
        <el-select
          v-model="form.month.day"
          :disabled="monthDisabled"
          size="mini"
          style="width: 200px"
        >
          <el-option
            v-for="num in 31"
            :key="num"
            :label="num + '日'"
            :value="num"
          ></el-option>
        </el-select>
        <el-form-item label="时间">
          <el-time-picker
            v-model="form.month.time"
            :disabled="monthDisabled"
            size="mini"
            :value-format="timeFormat"
          >
          </el-time-picker> </el-form-item
      ></el-form-item>
      <el-form-item style="margin-bottom: 18px">
        <el-radio label="secondMonth"></el-radio>
        <div>每</div>
        <el-select
          v-model="form.secondMonth.freq"
          size="mini"
          style="width: 96px"
          :disabled="secondMonthDisabled"
        >
          <el-option
            v-for="num in 12"
            :key="num"
            :label="num"
            :value="num"
          ></el-option>
        </el-select>
        <div>月</div>
        <div>第</div>
        <el-select
          v-model="form.secondMonth.weekNum"
          size="mini"
          style="width: 86px"
          :disabled="secondMonthDisabled"
        >
          <el-option
            v-for="num in 4"
            :key="num"
            :label="num + '个'"
            :value="num"
          ></el-option>
        </el-select>
        <WeekDaySelect
          v-model="form.secondMonth.week"
          :disabled="secondMonthDisabled"
          size="mini"
          style="width: 80px" />
        <el-form-item label="时间">
          <el-time-picker
            v-model="form.secondMonth.time"
            :disabled="secondMonthDisabled"
            size="mini"
            :value-format="timeFormat"
          >
          </el-time-picker> </el-form-item
      ></el-form-item>
    </el-radio-group>
  </el-form>
</template>
<script>
import WeekDaySelect from "@/components/week-day-select";
import { cloneDeep } from "lodash";
const defaultValue = {
  type: null,
  day: {
    freq: null,
    time: null,
  },
  week: {
    freq: null,
    week: null,
    time: null,
  },
  month: {
    freq: null,
    day: null,
    time: null,
  },
  secondMonth: {
    freq: null,
    weekNum: null,
    week: null,
    time: null,
  },
};
export default {
  components: {
    WeekDaySelect,
  },
  props: {
    value: {
      type: Object,
      default: () => ({ ...defaultValue }),
    },
  },
  data() {
    return {
      timeFormat: "HH:mm:ss",
      form: cloneDeep({ ...defaultValue, ...(this.value || {}) }),
    };
  },
  computed: {
    dayDisabled() {
      return this.form.type && this.form.type !== "day";
    },
    weekDisabled() {
      return this.form.type && this.form.type !== "week";
    },
    monthDisabled() {
      return this.form.type && this.form.type !== "month";
    },
    secondMonthDisabled() {
      return this.form.type && this.form.type !== "secondMonth";
    },
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit("input", cloneDeep(newVal));
      },
      deep: true,
    },
  },
};
</script>
<style lang="postcss" scoped>
>>> .el-form-item__content {
  display: flex;
  align-items: center;

  label.el-radio {
    margin-right: 12px;
  }

  .el-radio__label {
    display: none;
  }
}
</style>
