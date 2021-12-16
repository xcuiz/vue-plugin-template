/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
  <div class="day-model">
    <div class="v-crontab-from-model">
      <el-radio-group v-model="radioDay" vertical>
        <div class="list-box">
          <el-radio label="everyDay">
            <span class="text">每一天</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="WkintervalWeek">
            <span class="text">每隔</span>
            <el-input-number
              v-model="WkintervalWeekPerformVal"
              @change="onWkintervalWeekPerform"
              :min="0"
              :max="7">
            </el-input-number>
            <span class="text">天执行 从</span>
            <el-select
              size="mini"
              placeholder="请选择具体小时数"
              v-model="WkintervalWeekStartVal">
              <el-option
                v-for="item in selectWeekList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
            <span class="text">开始</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="intervalDay">
            <span class="text">每隔</span>
            <el-input-number
              v-model="intervalDayPerformVal"
              @change="onIntervalDayPerform"
              :min="0"
              :max="31">
            </el-input-number>
            <span class="text">天执行 从</span>
            <el-input-number
              v-model="intervalDayStartVal"
              @change="onIntervalDayStart"
              :min="1"
              :max="31">
            </el-input-number>
            <span class="text">天开始</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="WkspecificWeek">
            <!--<span class="text">（周）</span>-->
            <span class="text">具体星期几(可多选)</span>
            <el-select size="mini" multiple placeholder="请选择具体周几" v-model="WkspecificWeekVal">
              <el-option
                v-for="item in selectSpecificWeekList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="specificDay">
            <span class="text">具体天数(可多选)</span>
            <el-select size="mini" multiple placeholder="请选择具体天数" v-model="WkspecificDayVal">
              <el-option
                v-for="item in selectSpecificDayList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="monthLastDays">
            <span class="text">在这个月的最后一天</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="monthLastWorkingDays">
            <span class="text">在这个月的最后一个工作日</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="monthLastWeeks">
            <span class="text">在这个月的最后一个</span>
            <el-select size="mini" placeholder="请选择具体周几" v-model="monthLastWeeksVal">
              <el-option
                v-for="item in monthLastWeeksList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="monthTailBefore">
            <el-input-number
              v-model="monthTailBeforeVal"
              @change="onMonthTailBefore"
              :min="0"
              :max="31">
            </el-input-number>
            <span class="text">在本月底前</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="recentlyWorkingDaysMonth">
            <span class="text">最近的工作日（周一至周五）至本月</span>
            <el-input-number
              v-model="recentlyWorkingDaysMonthVal"
              @change="onRecentlyWorkingDaysMonth"
              :min="0"
              :max="31">
            </el-input-number>
            <span class="text">日</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="WkmonthNumWeeks">
            <!--<span class="text">（周）</span>-->
            <span class="text">在这个月的第</span>
            <el-input-number
              v-model="WkmonthNumWeeksDayVal"
              @change="onWkmonthNumWeeksDay"
              :min="0"
              :max="31">
            </el-input-number>
            <el-select size="mini" placeholder="请选择具体周几" style="width: 200px"  v-model="WkmonthNumWeeksWeekVal">
              <el-option
                v-for="item in WkmonthNumWeeksWeekList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-radio>
        </div>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { selectList, isStr, isWeek } from '../util/index'

export default {
  name: 'day',
  data () {
    return {
      radioDay: 'everyDay',
      dayValue: '*',
      weekValue: '?',
      everyDayVal: '*',
      WkintervalWeekPerformVal: 2, // Every few days
      WkintervalWeekStartVal: 2, // What day of the week
      selectWeekList: _.map(_.cloneDeep(selectList['week']), v => {
        return {
          value: v.value,
          label: v.label
        }
      }),
      intervalDayPerformVal: 1, // Every other day
      intervalDayStartVal: 1, // From the day
      WkspecificWeekVal: [], // Specific day of the week
      selectSpecificWeekList: selectList['specificWeek'],
      WkspecificDayVal: [], // Specific day of the week
      selectSpecificDayList: selectList['day'],
      monthLastDaysVal: 'L',
      monthLastWorkingDays: 'LW',
      monthLastWeeksVal: '1L',
      monthLastWeeksList: _.map(_.cloneDeep(selectList['lastWeeks']), v => {
        return {
          value: v.value,
          label: v.label
        }
      }),
      monthTailBeforeVal: 1,
      recentlyWorkingDaysMonthVal: 1,
      WkmonthNumWeeksDayVal: 1,
      WkmonthNumWeeksWeekVal: 1,
      WkmonthNumWeeksWeekList: _.map(_.cloneDeep(selectList['week']), v => {
        return {
          value: v.value,
          label: v.label
        }
      })
    }
  },
  props: {
    dayVal: String,
    weekVal: String
  },
  methods: {
    // Every few weeks
    onWkintervalWeekPerform (val) {
      if (this.radioDay === 'WkintervalWeek') {
        this.dayValue = `?`
        this.weekValue = `${this.WkintervalWeekStartVal}/${this.WkintervalWeekPerformVal}`
      }
    },
    // Every other day
    onIntervalDayPerform (val) {
      if (this.radioDay === 'intervalDay') {
        this.dayValue = `${this.intervalDayStartVal}/${this.intervalDayPerformVal}`
      }
    },
    // From week day
    onIntervalDayStart (val) {
      if (this.radioDay === 'intervalDay') {
        this.dayValue = `${this.intervalDayStartVal}/${this.intervalDayPerformVal}`
      }
    },
    // By the end of this month
    onMonthTailBefore (val) {
      if (this.radioDay === 'monthTailBefore') {
        this.dayValue = `L-${this.monthTailBeforeVal}`
      }
    },
    // Last working day
    onRecentlyWorkingDaysMonth (val) {
      if (this.radioDay === 'recentlyWorkingDaysMonth') {
        this.dayValue = `${this.recentlyWorkingDaysMonthVal}W`
      }
    },
    // On the day of this month
    onWkmonthNumWeeksDay (val) {
      this.weekValue = `${this.WkmonthNumWeeksWeekVal}#${this.WkmonthNumWeeksDayVal}`
    },

    // Reset every day
    everyDayReset () {
      this.dayValue = _.cloneDeep(this.everyDayVal)
    },
    // Reset interval week starts from *
    WkintervalWeekReset () {
      this.weekValue = `${this.WkintervalWeekStartVal}/${this.WkintervalWeekPerformVal}`
    },
    // Reset interval days from *
    intervalDayReset () {
      this.dayValue = `${this.intervalDayStartVal}/${this.intervalDayPerformVal}`
    },
    // Specific week (multiple choices)
    WkspecificWeekReset () {
      this.weekValue = this.WkspecificWeekVal.length ? this.WkspecificWeekVal.join(',') : '*'
    },
    // Specific days (multiple choices)
    specificDayReset () {
      this.dayValue = this.WkspecificDayVal.length ? this.WkspecificDayVal.join(',') : '*'
    },
    // On the last day of the month
    monthLastDaysReset () {
      this.dayValue = _.cloneDeep(this.monthLastDaysVal)
    },
    // On the last working day of the month
    monthLastWorkingDaysReset () {
      this.dayValue = _.cloneDeep(this.monthLastWorkingDays)
    },
    // At the end of the month*
    monthLastWeeksReset () {
      this.dayValue = _.cloneDeep(this.monthLastWeeksVal)
    },
    // By the end of this month
    monthTailBeforeReset () {
      this.dayValue = `L-${this.monthTailBeforeVal}`
    },
    // Last working day (Monday to Friday) to this month
    recentlyWorkingDaysMonthReset () {
      this.dayValue = `${this.recentlyWorkingDaysMonthVal}W`
    },
    // On the day of this month
    WkmonthNumReset () {
      this.weekValue = `${this.WkmonthNumWeeksWeekVal}#${this.WkmonthNumWeeksDayVal}`
    }
  },
  watch: {
    dayValue (val) {
      this.$emit('on-day-value', val)
      // console.log('dayValue=>  ' + val)
    },
    weekValue (val) {
      this.$emit('on-week-value', val)
      // console.log('weekValue=>  ' + val)
    },
    // Selected type
    radioDay (val) {
      switch (val) {
        case 'everyDay':
          this.weekValue = '?'
          this.everyDayReset()
          break
        case 'WkintervalWeek':
          this.dayValue = '?'
          this.WkintervalWeekReset()
          break
        case 'intervalDay':
          this.weekValue = '?'
          this.intervalDayReset()
          break
        case 'WkspecificWeek':
          this.dayValue = '?'
          this.WkspecificWeekReset()
          break
        case 'specificDay':
          this.weekValue = '?'
          this.specificDayReset()
          break
        case 'monthLastDays':
          this.weekValue = '?'
          this.monthLastDaysReset()
          break
        case 'monthLastWorkingDays':
          this.weekValue = '?'
          this.monthLastWorkingDaysReset()
          break
        case 'monthLastWeeks':
          this.weekValue = '?'
          this.monthLastWeeksReset()
          break
        case 'monthTailBefore':
          this.weekValue = '?'
          this.monthTailBeforeReset()
          break
        case 'recentlyWorkingDaysMonth':
          this.weekValue = '?'
          this.recentlyWorkingDaysMonthReset()
          break
        case 'WkmonthNumWeeks':
          this.dayValue = '?'
          this.WkmonthNumReset()
          break
      }
    },
    WkintervalWeekStartVal (val) {
      if (this.radioDay === 'WkintervalWeek') {
        this.dayValue = `?`
        this.weekValue = `${val}/${this.WkintervalWeekPerformVal}`
      }
    },
    // Specific day of the week (multiple choice)
    WkspecificWeekVal (val) {
      if (this.radioDay === 'WkspecificWeek') {
        this.dayValue = `?`
        this.weekValue = val.join(',')
      }
    },
    // Specific days (multiple choices)
    WkspecificDayVal (val) {
      if (this.radioDay === 'specificDay') {
        this.weekValue = `?`
        this.dayValue = val.join(',')
      }
    },
    monthLastWeeksVal (val) {
      if (this.radioDay === 'monthLastWeeks') {
        this.weekValue = `?`
        this.dayValue = val
      }
    },
    WkmonthNumWeeksWeekVal (val) {
      if (this.radioDay === 'WkmonthNumWeeks') {
        this.dayValue = `?`
        this.weekValue = `${val}#${this.WkmonthNumWeeksDayVal}`
      }
    }
  },
  beforeCreate () {
  },
  created () {
    let $dayVal = _.cloneDeep(this.dayVal)
    let $weekVal = _.cloneDeep(this.weekVal)
    let isWeek1 = $weekVal.indexOf('/') !== -1
    let isWeek2 = $weekVal.indexOf('#') !== -1

    // Initialization
    if ($dayVal === '*' && $weekVal === '?') {
      console.log('Initialization')
      this.radioDay = 'everyDay'
      return
    }

    // week
    if (isWeek1 || isWeek2 || isWeek($weekVal)) {
      this.dayValue = `?`

      /**
         * Processing by sequence number (excluding days)
         * @param [
         * WkintervalWeek=>(/),
         * WkspecificWeek=>(TUE,WED),
         * WkmonthNumWeeks=>(#)
         * ]
         */
      let hanleWeekOne = () => {
        console.log('1/3')
        let a = isStr($weekVal, '/')
        this.WkintervalWeekStartVal = parseInt(a[0])
        this.WkintervalWeekPerformVal = parseInt(a[1])
        this.dayValue = `?`
        this.weekValue = `${this.WkintervalWeekPerformVal}/${this.WkintervalWeekStartVal}`
        this.radioDay = 'WkintervalWeek'
      }

      let hanleWeekTwo = () => {
        console.log('TUE,WED')
        this.WkspecificWeekVal = $weekVal.split(',')
        this.radioDay = 'WkspecificWeek'
      }

      let hanleWeekThree = () => {
        console.log('6#5')
        let a = isStr($weekVal, '#')
        this.WkmonthNumWeeksWeekVal = parseInt(a[0])
        this.WkmonthNumWeeksDayVal = parseInt(a[1])
        this.radioDay = 'WkmonthNumWeeks'
      }

      // Processing week
      if (isStr($weekVal, '/')) {
        hanleWeekOne()
      } else if (isStr($weekVal, '#')) {
        hanleWeekThree()
      } else if (isWeek($weekVal)) {
        hanleWeekTwo()
      }
    } else {
      this.weekValue = `?`

      /**
         * Processing by sequence number (excluding week)
         * @param [
         * everyDay=>(*),
         * intervalDay=>(1/1),
         * specificDay=>(1,2,5,3,4),
         * monthLastDays=>(L),
         * monthLastWorkingDays=>(LW),
         * monthLastWeeks=>(3L),
         * monthTailBefore=>(L-4),
         * recentlyWorkingDaysMonth=>(6W)
         * ]
         */
      const hanleDayOne = () => {
        console.log('*')
      }
      const hanleDayTwo = () => {
        console.log('1/1')
        let a = isStr($dayVal, '/')
        this.intervalDayStartVal = parseInt(a[0])
        this.intervalDayPerformVal = parseInt(a[1])
        this.radioDay = 'intervalDay'
      }
      const hanleDayThree = () => {
        console.log('1,2,5,3,4')
        this.WkspecificDayVal = $dayVal.split(',')
        this.radioDay = 'specificDay'
      }
      const hanleDayFour = () => {
        console.log('L')
        this.radioDay = 'monthLastDays'
      }
      const hanleDayFive = () => {
        console.log('LW')
        this.radioDay = 'monthLastWorkingDays'
      }
      const hanleDaySix = () => {
        console.log('3L')
        this.monthLastWeeksVal = $dayVal
        this.radioDay = 'monthLastWeeks'
      }
      const hanleDaySeven = () => {
        console.log('L-4')
        let a = isStr($dayVal, '-')
        this.monthTailBeforeVal = parseInt(a[1])
        this.radioDay = 'monthTailBefore'
      }
      const hanleDayEight = () => {
        console.log('6W')
        this.recentlyWorkingDaysMonthVal = parseInt($dayVal.slice(0, $dayVal.length - 1))
        this.radioDay = 'recentlyWorkingDaysMonth'
      }
      if ($dayVal === '*') {
        hanleDayOne()
      } else if (isStr($dayVal, '/')) {
        hanleDayTwo()
      } else if ($dayVal === 'L') {
        hanleDayFour()
      } else if ($dayVal === 'LW') {
        hanleDayFive()
      } else if ($dayVal.charAt($dayVal.length - 1) === 'L') {
        hanleDaySix()
      } else if (isStr($dayVal, '-')) {
        hanleDaySeven()
      } else if ($dayVal.charAt($dayVal.length - 1) === 'W') {
        hanleDayEight()
      } else {
        hanleDayThree()
      }
    }
  },
  beforeMount () {
  },
  mounted () {

  },
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  },
  destroyed () {
  },
  computed: {}
}
</script>

<style lang="postcss" scoped>
.day-model {
  >>> .el-input {
    width: auto;
  }
  .ans-radio-group-vertical {
    .ans-radio-wrapper {
      margin: 5px 0;
      display: inline-block;
    }
  }
}
</style>
