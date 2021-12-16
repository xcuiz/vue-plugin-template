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
  <div class="hour-model">
    <div class="v-crontab-from-model">
      <el-radio-group v-model="radioHour" vertical>
        <div class="list-box">
          <el-radio label="everyHour">
            <span class="text">每一小时</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="intervalHour">
            <span class="text">每隔</span>
            <el-input-number
              v-model="intervalPerformVal"
              @change="onIntervalPerform"
              :min="0"
              :max="23">
            </el-input-number>
            <span class="text">小时执行 从</span>
            <el-input-number
              v-model="intervalStartVal"
              @change="onIntervalStart"
              :min="0"
              :max="23">
            </el-input-number>
            <span class="text">小时开始</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="specificHour">
            <span class="text">具体小时数(可多选)</span>
            <el-select
              size="mini"
              multiple
              placeholder="请选择具体小时数"
              v-model="specificHoursVal">
              <el-option
                v-for="item in selectHourList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="cycleHour">
            <span class="text">周期从</span>
            <el-input-number
              v-model="cycleStartVal"
              @change="onCycleStart"
              :min="0"
              :max="23">
            </el-input-number>
            <span class="text">到</span>
            <el-input-number
              v-model="cycleEndVal"
              @change="onCycleEnd"
              :min="0"
              :max="23">
            </el-input-number>
            <span class="text">小时</span>
          </el-radio>
        </div>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { selectList, isStr } from '../util/index'

export default {
  name: 'hour',
  data () {
    return {
      hourValue: '*',
      radioHour: 'everyHour',
      selectHourList: selectList['24'],
      intervalPerformVal: 5,
      intervalStartVal: 3,
      specificHoursVal: [],
      cycleStartVal: 1,
      cycleEndVal: 1
    }
  },
  props: {
    hourVal: String,
    value: {
      type: String,
      default: '*'
    }
  },
  model: {
    prop: 'value',
    event: 'hourValueEvent'
  },
  methods: {
    // Interval execution time（1）
    onIntervalPerform (val) {
      if (this.radioHour === 'intervalHour') {
        this.hourValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
      }
    },
    // Interval start time（2）
    onIntervalStart (val) {
      if (this.radioHour === 'intervalHour') {
        this.hourValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
      }
    },
    // Cycle start value
    onCycleStart (val) {
      if (this.radioHour === 'cycleHour') {
        this.hourValue = `${this.cycleStartVal}-${this.cycleEndVal}`
      }
    },
    // Cycle end value
    onCycleEnd (val) {
      if (this.radioHour === 'cycleHour') {
        this.hourValue = `${this.cycleStartVal}-${this.cycleEndVal}`
      }
    },
    // Reset every hour
    everyReset () {
      this.hourValue = '*'
    },
    // Reset interval hours
    intervalReset () {
      this.hourValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
    },
    // Reset specific hours
    specificReset () {
      if (this.specificHoursVal.length) {
        this.hourValue = this.specificHoursVal.join(',')
      } else {
        this.hourValue = '*'
      }
    },
    // Reset cycle hours
    cycleReset () {
      this.hourValue = `${this.cycleStartVal}-${this.cycleEndVal}`
    },
    /**
       * Parse parameter value
       */
    analyticalValue () {
      return new Promise((resolve, reject) => {
        let $hourVal = _.cloneDeep(this.value)
        // Interval hour
        let $interval = isStr($hourVal, '/')
        // Specific hours
        let $specific = isStr($hourVal, ',')
        // Cycle hour
        let $cycle = isStr($hourVal, '-')

        // Every hour
        if ($hourVal === '*') {
          this.radioHour = 'everyHour'
          this.hourValue = '*'
          return
        }

        // Positive integer (hour)
        if ($hourVal.length === 1 && _.isInteger(parseInt($hourVal)) ||
            $hourVal.length === 2 && _.isInteger(parseInt($hourVal))
        ) {
          this.radioHour = 'specificHour'
          this.specificHoursVal = [$hourVal]
          return
        }

        // Interval hour
        if ($interval) {
          this.radioHour = 'intervalHour'
          this.intervalStartVal = parseInt($interval[0])
          this.intervalPerformVal = parseInt($interval[1])
          this.hourValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
          return
        }

        // Specific hours
        if ($specific) {
          this.radioHour = 'specificHour'
          this.specificHoursVal = $specific
          return
        }

        // Cycle hour
        if ($cycle) {
          this.radioHour = 'cycleHour'
          this.cycleStartVal = parseInt($cycle[0])
          this.cycleEndVal = parseInt($cycle[1])
          this.hourValue = `${this.cycleStartVal}/${this.cycleEndVal}`
          return
        }
        resolve()
      })
    }
  },
  watch: {
    // Derived value
    hourValue (val) {
      this.$emit('hourValueEvent', val)
    },
    // Selected type
    radioHour (val) {
      switch (val) {
        case 'everyHour':
          this.everyReset()
          break
        case 'intervalHour':
          this.intervalReset()
          break
        case 'specificHour':
          this.specificReset()
          break
        case 'cycleHour':
          this.cycleReset()
          break
      }
    },
    // Specific hours
    specificHoursVal (arr) {
      this.hourValue = arr.join(',')
    }
  },
  beforeCreate () {
  },
  created () {
    this.analyticalValue().then(() => {
      console.log('Data structure parsing succeeded!')
    })
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
.hour-model {
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
