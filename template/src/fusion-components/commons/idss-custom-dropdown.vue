<template>
  <el-dropdown
    v-bind="$attrs"
    v-on="$listeners"
    :hide-on-click="false"
    trigger="click"
    @visible-change="handleVisible">
    <!-- 标题 -->
    <span v-if="$scopedSlots.title">
      <slot name="title"></slot>
    </span>
    <span v-else class="el-dropdown-link" :class="{'is-active': active}">
      {{text}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>

    <!-- 下拉面板 -->
    <el-dropdown-menu slot="dropdown" class="dropdown-wrapper">
      <el-tooltip placement="top" v-model="limitWarning" :manual="true">
        <p slot="content">{{warningTips}}</p>
        <div :style="{'max-height': `${rows * 22}px`}" v-iscroll="scrollOption">
          <div>
            <!-- checkbox 列表 -->
            <el-checkbox-group v-model="checked" :max="max" :min="min">
              <ul ref="checkboxList" :style="{width: listWrapperWidth}">
                <li
                  :style="{'width': `${Math.round(100/ Number(cols))}%`}"
                  v-for="item in checkboxList"
                  :key="item.key">
                  <el-checkbox
                    :label="item.key"
                    :disabled="item.disabled"
                    @click.stop.native="() => handleCheckedTips($event, item.key)">{{item.name}}</el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>
          </div>
        </div>
      </el-tooltip>
      <!-- 按钮组 -->
      <div v-if="$scopedSlots.buttons">
        <slot name="buttons"></slot>
      </div>

      <div v-else class="button-block">
        <el-button type="primary" size="mini" @click="resetChecked">恢复默认</el-button>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { computeWid, charCodeLength } from './../util/base.js'
import { iscroll } from '../directives'
const DefaultProps = {
  key: 'key',
  name: 'name',
  disabled: 'disabled',
  checked: 'checked'
}
export default {
  name: 'idss-custom-dropdown',
  directives: {
    iscroll
  },
  props: {
    // 双向数据绑定
    value: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: Array,
    data: {
      type: Array,
      default () {
        return []
      }
    },
    dataProps: {
      type: Object,
      default () {
        return DefaultProps
      }
    },
    // 列数量
    cols: {
      type: Number,
      default: 2
    },
    // 名称
    text: {
      type: String,
      default: '自定义列'
    },
    // 可被勾选的 checkbox 的最大数量
    max: Number,
    // 可被勾选的 checkbox 的最小数量
    min: Number,
    // 可显示行数，超出部分出滚动条
    rows: Number,
    scrollOption: {
      type: Object,
      default () {
        // { fadeScrollbars: false }
        return {}
      }
    },
    accuratelyComputedWidth: Boolean
  },
  data () {
    return {
      checked: [],
      checkboxList: [],
      mergeDataProps: Object.assign(DefaultProps, this.dataProps),
      active: false,
      limitWarning: false,
      warningTips: '',
      listWrapperWidth: 0
    }
  },
  watch: {
    checked (val) {
      this.$emit('input', val)
    },
    value (newVal) {
      this.checked = newVal
    },
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        if (Array.isArray(val)) {
          this.init()
          this.accuratelyComputedWidth && this.accuratelyWrapperWidth()
        }
      }
    }
  },
  methods: {
    /**
     * 下拉面板显示或隐藏回调
     */
    handleVisible (isVisible) {
      this.active = isVisible === true
    },

    /**
     * 恢复默认
     */
    resetChecked () {
      this.checked = JSON.parse(JSON.stringify(this.originChecked))
    },

    /**
     * 选择事件
     */
    handleCheckedTips (event, key) {
      // 非input框
      if (!event.target || !event.target.className || !event.target.className.indexOf('el-checkbox__original')) return

      // 超过最大限制提示
      if (this.checked.length === this.max && !this.checked.includes(key)) {
        this.warningTips = `最多选择 ${this.max} 项`
        this.limitWarning = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.limitWarning = false
        }, 2000)
      }

      // 到达最小限制提示
      if (this.checked.length === this.min && this.checked.includes(key)) {
        this.warningTips = `至少选择 ${this.min} 项`
        this.limitWarning = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.limitWarning = false
        }, 2000)
      }
    },

    // 初始化
    init () {
      let { key, name, disabled, checked } = this.mergeDataProps
      // 属性传递方式具有一票否决权，不通过属性传递的话，可以通过data传值，但是原则是 单一控制，不merge
      let isPropsChecked = Array.isArray(this.value) && this.value.length
      !isPropsChecked && (this.checked = [])
      let isPropsDisabled = Array.isArray(this.disabled) && this.disabled.length
      // 数据赋值
      this.checkboxList = []
      let maxLengthName = ''
      let maxLength = 0
      this.data.forEach((item, index) => {
        // 求最长字段名
        let itemNameLength = (item[name] && charCodeLength(item[name])) || maxLength
        if (maxLength < itemNameLength) {
          maxLengthName = item[name]
          maxLength = itemNameLength
        }

        // checklist
        let checkboxItem = {
          'key': item[key],
          'name': item[name],
          'checked': isPropsChecked ? this.value.includes(item[key]) : !!item[checked],
          'disabled': isPropsDisabled ? this.disabled.includes(item[key]) : !!item[disabled]
        }
        this.checkboxList.splice(index, 1, checkboxItem)

        // checked 赋值
        if (checkboxItem.checked && !this.checked.includes(checkboxItem.key)) {
          this.checked.push(checkboxItem.key)
        }
      })
      // 保留初始值
      this.originChecked = JSON.parse(JSON.stringify(this.checked))

      // list 宽度计算
      this.listWrapperWidth = (Math.ceil(computeWid(maxLengthName, '14px Arial') || 0) + 40) * this.cols + 'px'
    },

    // 精确宽度计算
    accuratelyWrapperWidth () {
      let maxComputedWidth = 0
      maxComputedWidth = this.checkboxList.reduce((prev, current, index, array) => {
        let currentWidth = computeWid(current['name'], '14px Arial') || 0
        return prev > currentWidth ? prev : currentWidth
      }, 0)
      this.listWrapperWidth = (Math.ceil(maxComputedWidth + 40) * this.cols) + 'px'
    }
  }
}
</script>
<style scoped lang="postcss">
.el-dropdown-link {
  --custom-dropdown-title-font-size: var(--font-size-default, 12px);
  --custom-dropdown-title-color: var(--color-font-2, #6a7280);
  --custom-dropdown-title-color-actived: var(--color-font-default, #1890ff);

  font-size: var(--custom-dropdown-title-font-size);
  color: var(--custom-dropdown-title-color);
  cursor: pointer;
  outline: none;
  &:hover,
  &.is-active {
    color: var(--custom-dropdown-title-color-actived);
  }
}

.dropdown-wrapper {
  --custom-dropdown-checkbox-label-color: var(--color-font-5,#ffffff);
  --custom-dropdown-checkbox-label-color-actived: var(--color-font-6,#1890ff);
  --custom-dropdown-checkbox-label-color-disabled: var(--color-font-disabled,#c0c6cc);

  padding: 16px;
  box-shadow: var(--shadow-default,1px 2px 5px rgba(204,211,217,0.5));
  background-color: var(--color-bg-6,rgba(9,10,13,.8));
  & ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0;

    & li {
      height: 22px;
    }
    >>> .el-checkbox {
      .el-checkbox__label {
        color: var(--custom-dropdown-checkbox-label-color);
      }
    }
    >>> .el-checkbox.is-checked {
      .el-checkbox__input.is-checked {
        .el-checkbox__inner {
          border-color: var(--custom-dropdown-checkbox-label-color-actived);
        }
      }
      .el-checkbox__label {
        color: var(--custom-dropdown-checkbox-label-color-actived);
      }
    }
    >>> .el-checkbox.is-disabled {
      .el-checkbox__input.is-disabled {
        .el-checkbox__inner {
          border-color: var(--custom-dropdown-checkbox-label-color-disabled);
        }
      }
      .el-checkbox__label {
        color: var(--custom-dropdown-checkbox-label-color-disabled);
      }
    }
  }
  .button-block {
    text-align: right;
    margin-top: 5px;
  }
}
</style>
