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
  <div class="second-model">
    <div class="v-crontab-from-model">
      <el-radio-group v-model="radioSecond" vertical>
        <div class="list-box">
          <el-radio label="everySecond">
            <span class="text">每一秒钟</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="intervalSecond">
            <span class="text">每隔</span>
            <el-input-number
              v-model="intervalPerformVal"
              @change="onIntervalPerform"
              :min="0"
              :max="59">
            </el-input-number>
            <span class="text">秒执行 从</span>
            <el-input-number
              v-model="intervalStartVal"
              @change="onIntervalStart"
              :min="0"
              :max="59">
            </el-input-number>
            <span class="text">秒开始</span>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="specificSecond">
            <span class="text">具体秒数(可多选)</span>
            <el-select
              size="mini"
              multiple
              placeholder="请选择具体秒数"
              v-model="specificSecondsVal">
              <el-option
                v-for="item in selectSecondList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-radio>
        </div>
        <div class="list-box">
          <el-radio label="cycleSecond">
            <span class="text">周期从</span>
            <el-input-number
              v-model="cycleStartVal"
              @change="onCycleStart"
              :min="0"
              :max="59">
            </el-input-number>
            <span class="text">到</span>
            <el-input-number
              v-model="cycleEndVal"
              @change="onCycleEnd"
              :min="0"
              :max="59">
            </el-input-number>
            <span class="text">秒</span>
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
  name: 'second',

  data () {
    return {
      secondValue: '*',
      radioSecond: 'everySecond',
      selectSecondList: selectList['60'],
      intervalPerformVal: 5,
      intervalStartVal: 3,
      specificSecondsVal: [],
      cycleStartVal: 1,
      cycleEndVal: 1
    }
  },
  props: {
    secondVal: String,
    value: {
      type: String,
      default: '*'
    }
  },
  model: {
    prop: 'value',
    event: 'secondValueEvent'
  },
  methods: {
    // Interval execution time（1）
    onIntervalPerform (val) {
      if (this.radioSecond === 'intervalSecond') {
        this.secondValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
      }
    },
    // Interval start time（2）
    onIntervalStart (val) {
      if (this.radioSecond === 'intervalSecond') {
        this.secondValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
      }
    },
    // Cycle start value
    onCycleStart (val) {
      if (this.radioSecond === 'cycleSecond') {
        this.secondValue = `${this.cycleStartVal}-${this.cycleEndVal}`
      }
    },
    // Cycle end value
    onCycleEnd (val) {
      if (this.radioSecond === 'cycleSecond') {
        this.secondValue = `${this.cycleStartVal}-${this.cycleEndVal}`
      }
    },
    // Reset every second
    everyReset () {
      this.secondValue = '*'
    },
    // Reset interval seconds
    intervalReset () {
      this.secondValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
    },
    // Reset specific seconds
    specificReset () {
      if (this.specificSecondsVal.length) {
        this.secondValue = this.specificSecondsVal.join(',')
      } else {
        this.secondValue = '*'
      }
    },
    // Reset cycle seconds
    cycleReset () {
      this.secondValue = `${this.cycleStartVal}-${this.cycleEndVal}`
    },
    /**
       * Parse parameter value
       */
    analyticalValue () {
      return new Promise((resolve, reject) => {
        let $secondVal = _.cloneDeep(this.value)
        // Interval seconds
        let $interval = isStr($secondVal, '/')
        // Specific seconds
        let $specific = isStr($secondVal, ',')
        // Cycle second
        let $cycle = isStr($secondVal, '-')

        // Every second
        if ($secondVal === '*') {
          this.radioSecond = 'everySecond'
          this.secondValue = '*'
          return
        }

        // Positive integer (seconds)
        if ($secondVal.length === 1 && _.isInteger(parseInt($secondVal)) ||
            $secondVal.length === 2 && _.isInteger(parseInt($secondVal))
        ) {
          this.radioSecond = 'specificSecond'
          this.specificSecondsVal = [$secondVal]
          return
        }

        // Interval seconds
        if ($interval) {
          this.radioSecond = 'intervalSecond'
          this.intervalStartVal = parseInt($interval[0])
          this.intervalPerformVal = parseInt($interval[1])
          this.secondValue = `${this.intervalStartVal}/${this.intervalPerformVal}`
          return
        }

        // Specific seconds
        if ($specific) {
          this.radioSecond = 'specificSecond'
          this.specificSecondsVal = $specific
          return
        }

        // Cycle second
        if ($cycle) {
          this.radioSecond = 'cycleSecond'
          this.cycleStartVal = parseInt($cycle[0])
          this.cycleEndVal = parseInt($cycle[1])
          this.secondValue = `${this.cycleStartVal}-${this.cycleEndVal}`
          return
        }
        resolve()
      })
    }
  },
  watch: {
    // Value change reparse structure
    value () {
      this.analyticalValue().then(() => {
        console.log('数据结构解析成功！')
      })
    },
    // Derived value
    secondValue (val) {
      this.$emit('secondValueEvent', val)
    },
    // Selected type
    radioSecond (val) {
      switch (val) {
        case 'everySecond':
          this.everyReset()
          break
        case 'intervalSecond':
          this.intervalReset()
          break
        case 'specificSecond':
          this.specificReset()
          break
        case 'cycleSecond':
          this.cycleReset()
          break
      }
    },
    // Specific seconds
    specificSecondsVal (arr) {
      this.secondValue = arr.join(',')
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
.second-model {
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
