<template>
  <div class="idss-time-select" :style="{'min-width': minWidth}">
    <el-popover
      :disabled="disabled"
      :placement="placement"
      ref="timePopover"
      width="520"
      v-model="timePopoverVisible"
      trigger="click"
      :popper-class="(isInDialog ? 'isInDialog ' : '') + 'idss-time-select-popover'">
      <el-tabs v-model="currentTabs" tab-position="left">
        <el-tab-pane v-if="noTimeRange" label="无需时间间隔" name="noTimeRange">
          <div>查询条件不依赖时间范围。</div>
        </el-tab-pane>
        <el-tab-pane label="快捷时间" name="quick">
          <el-row>
            <el-col :span="10">
              <div class="idss_time_select_quick_box quick_box_left">
                <el-button
                  :class="{actived: quickTime.activeKey === time.key }"
                  v-for="time in quickTime.abs"
                  :key="time.name"
                  type="text"
                  size="medium"
                  @click="quickSelect(time, 'absolute')">{{time.name}}</el-button>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="idss_time_select_quick_box quick_box_right">
                <el-button
                  :class="{actived: quickTime.activeKey === time.key }"
                  v-for="time in quickTime.last"
                  :key="time.name"
                  type="text"
                  size="medium"
                  @click="quickSelect(time, 'relative')">{{time.name}}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="相对时间间隔" name="relative">
          <span>从</span>
          <el-input-number
            v-model="oppositeTimeInterval"
            size="medium"
            style="width: 120px; margin-left: 8px;"
            :min="1"></el-input-number>
          <el-select
            v-model="oppositeTimeUnit"
            size="medium"
            style="width: 90px; margin-left: 8px;"
            :popper-class="(isInDialog ? 'isInDialog ' : '') + 'idss-time-select-unit-container'">
            <el-option
              v-for="(val, key) in oppositeTimeUnitArray"
              :key="key"
              :label="val"
              :value="key"></el-option>
          </el-select>
          <span style="margin-left: 8px;">前 - 现在</span>
        </el-tab-pane>
        <el-tab-pane label="绝对时间间隔" name="absolute">
          <el-form :model="absoluteForm" :rules="absoluteFormRule" ref="absolute" size="medium">
            <el-form-item label="开始时间" prop="start">
              <el-date-picker
                :popper-class="(isInDialog ? 'isInDialog ' : '') + 'idss-time-date-picker-container'"
                v-model="absoluteForm.start"
                :picker-options="absoluteStartOption"
                default-time="00:00:00"
                type="datetime"
                placeholder="选择开始日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="end">
              <el-date-picker
                :popper-class="(isInDialog ? 'isInDialog ' : '') + 'idss-time-date-picker-container'"
                v-model="absoluteForm.end"
                :picker-options="absoluteEndOption"
                default-time="23:59:59"
                type="datetime"
                :disabled="disableChangeEndTime"
                placeholder="选择结束日期时间"></el-date-picker>
              <el-button type="text" size="medium" @click="absoluteForm.end = new Date()">此刻</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <div class="idss-time-select__btns" v-show="currentTabs !== 'quick'">
          <el-button size="medium" @click="timePopoverVisible=false">取消</el-button>
          <!-- 这里的timeChanged()加上括号 是为了不接收默认的 event 参数  -->
          <el-button size="medium" type="primary" @click="timeChanged()">确认</el-button>
        </div>
      </el-tabs>
    </el-popover>
    <!-- 数据查询的时间条件 -->
    <div
      :class="disabled ? 'is-disabled' : ''"
      class="idss-time-select-display"
      v-popover:timePopover>
      <div class="idss-time-icon">
        <i class="el-icon-time"></i>
      </div>
      <el-tooltip
        :disabled="!isShowTooltip"
        :content="showTimeInterval"
        placement="bottom"
        effect="dark">
        <!-- <span ref="ipt">{{showTimeInterval}}</span> -->
        <el-input
          readonly
          data-ligang
          :size="size"
          v-model="showTimeInterval"
          ref="idssShowTimeRef"
          class="idss-show-time"></el-input>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import timeMixins from './idss-time-select.js'
import ElPopover from 'element-ui/lib/popover'
import 'element-ui/lib/theme-chalk/popover.css'
import ElSelect from 'element-ui/lib/select.js'
import 'element-ui/lib/theme-chalk/select.css'
import ElOption from 'element-ui/lib/option.js'
import 'element-ui/lib/theme-chalk/option.css'
import ElDatePicker from 'element-ui/lib/date-picker.js'
import 'element-ui/lib/theme-chalk/date-picker.css'
import ElButton from 'element-ui/lib/button.js'
import 'element-ui/lib/theme-chalk/button.css'
import ElTabs from 'element-ui/lib/tabs.js'
import 'element-ui/lib/theme-chalk/tabs.css'
import ElTabPane from 'element-ui/lib/tab-pane.js'
import 'element-ui/lib/theme-chalk/tab-pane.css'
import ElInput from 'element-ui/lib/input'
import 'element-ui/lib/theme-chalk/input.css'
import ElInputNumber from 'element-ui/lib/input-number'
import 'element-ui/lib/theme-chalk/input-number.css'
import ElTooltip from 'element-ui/lib/tooltip'
import 'element-ui/lib/theme-chalk/tooltip.css'
import ElForm from 'element-ui/lib/form'
import 'element-ui/lib/theme-chalk/form.css'
import ElFormItem from 'element-ui/lib/form-item'
import 'element-ui/lib/theme-chalk/form-item.css'
export default {
  name: 'idss-time-select',
  components: { ElPopover, ElSelect, ElOption, ElDatePicker, ElButton, ElTabs, ElTabPane, ElInput, ElTooltip, ElForm, ElFormItem, ElInputNumber },
  mixins: [timeMixins]
}
</script>
<style scoped lang="postcss">
  .idss-show-time {
   & >>> .el-input__inner {
      padding-left: 36px;
      font-size: 1.2rem;
      text-overflow: ellipsis;
    }
  }

 .idss-time-select-display {
  --time-select-font-color: var(--color-font-2,#6a7280);
  --time-select-border: var(--color-line-default,#D2D2D2) solid var(--line-size-default,#D2D2D2);
  --time-select-disabled-color: var(--color-font-disabled,#C0C4CC);
  --time-select-disabled-border-color: var(--color-line-default,#D2D2D2);
  --time-select-display-bg: var(--time-select-display-background,#FFFFFF);

  position: relative;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  background-color: var(--time-select-display-bg);
  color: var(--time-select-font-color);
  cursor: pointer;
  width: inherit;
  &.is-disabled {
    color: var(--time-select-disabled-color,#C0C4CC);
    cursor: no-drop;
  }
  & > span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & div.idss-time-icon {
    position: absolute;
    left: 8px;
    z-index: 1;
    display: inline-block;
    margin-right: 5px;
    padding-right: 5px;
    border-right: var(--time-select-border,#D2D2D2);
  }
}

  .idss-time-select-popover {
  --time-select-popover-bg: var(--time-select-display-background,#ffffff);
  --time-select-popover-border: var(--color-line-default,#D2D2D2) solid var(--line-size-default);
  --time-select-el-button-color: var(--color-font-2,#6a7280);
  --time-select-el-button-color-hover: var(--color-font-6,#1890ff);
  --time-select-el-tabs-item-border: var(--color-line-default,#D2D2D2) solid var(--line-size-m);
  --time-select-el-tabs-item-color-hover: var(--color-font-6,#1890ff);
  --time-select-el-tabs-item-color-active: var(--color-font-6,#1890ff);

  border: var(--time-select-popover-border);
  background-color: var(--time-select-popover-bg);

  & >>> .el-tabs__item {
    border-right: var(--time-select-el-tabs-item-border);
  }
  & >>> .el-tabs__item.is-active {
    color: var(--time-select-el-tabs-item-color-active);
  }

  & .idss_time_select_quick_box {
    display: flex;
    flex-wrap: wrap;

    & >>> .el-button {
      text-align: left;
      margin: 0 5px;
      color: var(--time-select-el-button-color);
    }

    & >>> .el-button:hover {
      color: var(--time-select-el-button-color-hover);
    }

    & >>> .el-button.actived {
      color: var(--time-select-el-button-color-hover);
    }
    &.quick_box_left >>> .el-button {
      width: 50px;
    }

    &.quick_box_right >>> .el-button {
      width: 70px;
    }
  }
  .el-date-editor--datetimerange {
    width: 100%;
  }
  .idss-time-select-popover-line {
    margin: 5px 0;
  }
}

 .idss-time-select__btns {
    margin-top: 10px;
    text-align: right;
  }
  .idss-time-date-picker-container {
    & .el-time-panel.el-popper {
      width: 156px;
    }
  }

  /* z-index 控制 */
  /* 在普通的组件内 */
  .idss-time-date-picker-container,
  .idss-time-select-unit-container,
  .idss-time-select-popover {
    z-index: var(--zindex-inner-popper,1700) !important;
  }

  /* 当 popover插入到body的情况下，且在dialog内，需要特殊处理 */
  .idss-time-select-popover.isInDialog,
  .idss-time-date-picker-container.isInDialog,
  .idss-time-select-unit-container.isInDialog {
    z-index: var(--zindex-top,5000) !important;
  }

</style>
