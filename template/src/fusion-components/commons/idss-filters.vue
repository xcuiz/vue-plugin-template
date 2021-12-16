<template>
  <!--
    tabindex="0" @focus.stop 说明
    当 filter 组件存在与 idss-widget title left 场景下：
    因为 el-tooltip，会给 div 增加 tabindex （默认是 0）
    父级元素（el-tooltip）具有了获取焦点的能力（div，具有 tabindex 属性，并且值为一个数字时）
    在这样的场景下，删除最后一个过滤项时，父级元素会获取焦点（浏览器默认行为，当前获取焦点的元素被删除后，焦点聚焦到了父级上？）
    这时父级元素会出现 outline 样式（element 控制的）
    此处阻止 el-tooltip 获取焦点，使其不会出现 outline
   -->
  <div class="idss-filters" tabindex="0" @focus.stop>
    <div class="idss-filters-select">
      <div class="filters-select-input">
        <el-select v-model="select" :size="size" placeholder="请选择">
          <el-option v-for="(item, key) in optionMap" :key="key" :label="item.name" :value="key"></el-option>
        </el-select>
        <div class="filters-select-container">
          <!-- element ui 的日期时间选择框 -->
          <el-date-picker
            v-if="valueType === 'dataPicker'"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :size="size"
            v-bind="filterItems[select].props || {}"
            v-model="params[select]"
            v-on="$listeners"
            @change='timeChange'>
          </el-date-picker>
          <!-- 封装的时间选择框 -->
          <div class="idss-filter-box" v-else-if="valueType === 'idssTimeSelect'">
            <time-select
              min-width="100%"
              :time.sync="params[select]"
              :size="size"
              v-bind="filterItems[select].props || {}"
              v-on="$listeners">
            </time-select>
          </div>
          <!-- 自定义树 -->
          <div class="idss-filter-box" v-else-if="valueType === 'idssSelectTree'">
            <select-tree
              ref='businessTree'
              :size="size"
              :data="filterItems[select]['dict']"
              v-bind="filterItems[select].props || {}"
              v-model="params[select]"
              v-on="$listeners"
              @check-change="checkChange">
            </select-tree>
          </div>
          <!-- 自定义具名插槽，name 为 filterItems 的 key -->
          <slot v-else :name="select" v-bind="{ params, item: filterItems[select] }">
            <!-- input 文本输入框 -->
            <el-input
              v-if="valueType === 'input'"
              clearable
              ref="inputRef"
              :size="size"
              v-model="params[select]"
              v-on="$listeners"
              @keydown.native.enter="confirmHandle">
            </el-input>
            <!-- 下拉列表 -->
            <el-select
              v-else-if="valueType === 'select'"
              collapse-tags
              stretch
              clearable
              :size="size"
              :multiple="filterItems[select].multiple"
              v-model="params[select]"
              v-bind="filterItems[select].props || {}"
              v-on="$listeners">
              <el-option
                v-for="(option, key) in dictMap[select]"
                :key="key"
                :value="key"
                :label="option">
              </el-option>
            </el-select>
          </slot>
        </div>
      </div>
      <el-button :size="size" type="primary" @click="confirmHandle">{{btnText}}</el-button>
    </div>
    <!-- 迭代展示 tag 标签 -->
    <template v-for="(value, key) in defaultParams">
      <!-- 封装的时间控件显示 -->
      <el-tag
        v-if="filterItems[key]&&filterItems[key]['type'] === 'idssTimeSelect'"
        class="idss-filter-tag"
        :key="key"
        :size="size"
        @click="tagClickHandle(key, value)">
        {{filterItems[key]['name']}}: {{idssTimeToString(value)}}
      </el-tag>
      <!-- data Picker 时间控件 -->
      <el-tag
        v-else-if="showDataPickerTag(filterItems[key]&&filterItems[key]['type'], value)" :key="key"
        class="idss-filter-tag"
        :size="size"
        closable
        @close="deleteTag(key)"
        @click="tagClickHandle(key, value)">
        {{filterItems[key]['name']}}: {{dataPickDisplay(value)}}
      </el-tag>
      <!-- 如果过滤项是个数组(下拉列表类型的过滤条件) -->
      <template v-else-if="Array.isArray(value)">
        <el-tag
          v-for="(subVal, $index) in value"
          closable
          class="idss-filter-tag"
          :key="key + subVal"
          :size="size"
          @close="deleteTag(key, subVal)"
          @click="tagClickHandle(key, value, subVal)">
          <template v-if='filterItems[key]'>
            <!-- tag 的具名插槽（数组） -->
            <slot
              :name="'tag-' + key"
              v-bind="{ item: filterItems[key], value: subVal, dictValue: dictMap[key][subVal], $index }">
              {{filterItems[key]['name']}}: {{dictMap[key][subVal]}}
            </slot>
          </template>
        </el-tag>
      </template>
      <!-- input 输入框 -->
      <el-tag
        v-else-if="value"
        class="idss-filter-tag"
        :key="key"
        :size="size"
        closable
        @close="deleteTag(key)"
        @click="tagClickHandle(key, value)">
        <template v-if='filterItems[key]'>
          <!-- tag 的具名插槽 -->
          <slot
            :name="'tag-' + key"
            v-bind="{ item: filterItems[key], value, dictValue: (dictMap[key] && dictMap[key][value]) || value }">
            {{filterItems[key]['name']}}: {{(dictMap[key] && dictMap[key][value]) || value}}
          </slot>
        </template>
      </el-tag>
    </template>
  </div>
</template>
<script>
import { formatDate } from 'fusion-utils'
import { merge } from '../util/base.js'
import { formatTimeToText } from '../util/format-time-to-text.js'
import TimeSelect from './time-select/idss-time-select.vue'
import SelectTree from './idss-select-tree.vue'
import ElSelect from 'element-ui/lib/select.js'
import 'element-ui/lib/theme-chalk/select.css'
import ElOption from 'element-ui/lib/option.js'
import 'element-ui/lib/theme-chalk/option.css'
import ElDatePicker from 'element-ui/lib/date-picker.js'
import 'element-ui/lib/theme-chalk/date-picker.css'
import ElButton from 'element-ui/lib/button.js'
import 'element-ui/lib/theme-chalk/button.css'
import ElTag from 'element-ui/lib/tag.js'
import 'element-ui/lib/theme-chalk/tag.css'
import ElInput from 'element-ui/lib/input'
import 'element-ui/lib/theme-chalk/input.css'

/**
 * @name 过滤器
 * @event {Function} submit 搜索按钮点击事件
 * @event {Function} timeChange  el-date-picker 组件的change事件
 * @event {Function} delete 关闭tag事件
 * @event {Function} checkChange el-tree组件的check-change事件
 */
export default {
  name: 'idss-filters',
  components: { TimeSelect, SelectTree, ElSelect, ElOption, ElDatePicker, ElButton, ElTag, ElInput },
  // 使用 model 配置覆盖了默认的 value 属性，event: 'update:default-params' 是为了与 :default-params.sync 表现一致
  model: {
    prop: 'default-params',
    event: 'update:default-params'
  },
  props: {
    filterItems: {
      /**
     * @propCnName 过滤项
     * @propIsApi
     */
      required: true,
      type: Object,
      default () {
        return {}
      }
    },
    defaultParams: {// @propDesc  默认参数集合名称
      type: Object,
      default () {
        return {}
      }
    },
    field: {// @propDesc  下拉条件中选中的字段
      type: String,
      default: ''
    },
    size: { // @propDesc  过滤器里元素的尺寸
      type: String,
      default: 'small'
    },
    autoFocus: { // @propDesc 控制是否自动获取焦点
      type: Boolean,
      default: true
    },
    btnText: {  // @propDesc 设置搜索按钮 显示的 文本内容
      type: String,
      default: '搜索'
    }
  },
  data () {
    return {
      select: '',
      // 时间组件的文本显示内容
      idssTimeSelectDisplay: '',
      // 参数列表中的字典，其中保证 value 的值为字典对象
      dictMap: {},
      params: {}
    }
  },
  computed: {
    // 过来条件值的类型，时间、下拉框、input 输入框
    valueType () {
      // 默认是 input 输入框
      if (!this.select) {
        return 'input'
      }
      return this.filterItems[this.select]['type'] || 'input'
    },
    // 过滤条件列表
    optionMap () {
      const map = {}
      for (let key in this.filterItems) {
        const val = this.filterItems[key]
        if (!val.hidden) {
          map[key] = val
        }
      }
      return map
    }
  },
  watch: {
    select (newVal) {
      if (newVal !== this.field) {
        this.$emit('update:field', newVal)
      }
      // 获取焦点
      this.inputFocus()
    },
    field: {
      immediate: true,
      handler (newVal) {
        if (!newVal && this.optionMap) {
          this.select = Object.keys(this.optionMap)[0] || ''
        } else {
          this.select = newVal
        }
      }
    },
    filterItems: {
      immediate: true,
      deep: true,
      handler () {
        for (let key in this.filterItems) {
          // 一般在 el-table 中 过滤器 的使用场景居多，所以这里默认 key name 为 el table 过滤器的字段名称
          let { dict, dictKey = 'value', dictName = 'text' } = this.filterItems[key]
          if (dict) {
            const result = this.dictToMap(dict, dictKey, dictName)
            this.$set(this.dictMap, key, result)
          }
        }
      }
    },
    defaultParams: {
      immediate: true,
      deep: true,
      handler (newVal) {
        this.params = merge(newVal)
      }
    }
  },
  methods: {
    checkChange (data, checked, indeterminate) {
      this.$emit('checkChange', data, checked, indeterminate, this.params[this.select])
    },
    dictToMap (dict, dictKey, dictName, temp = {}) {
      if (Array.isArray(dict)) {
        // 数组转换为 对象 字典
        dict.forEach(val => {
          // 还是数组的话 递归 @FIXME 考虑 children 属性是否可配置
          if (Array.isArray(val['children']) && val['children'].length > 0) {
            temp = { ...temp, ...this.dictToMap(val['children'], dictKey, dictName, temp) }
          } else {
            temp[val[dictKey]] = val[dictName]
          }
        })
        return temp
      } else if (typeof dict === 'object') {
        return dict
      }
    },
    date2String (val) {
      return formatDate.call(new Date(val), 'yyyy-MM-dd hh:mm:ss')
    },
    idssTimeToString (time) {
      return formatTimeToText(time)
    },
    // 搜索按钮点击事件
    confirmHandle () {
      this.$emit('update:default-params', this.params)
      this.$emit('submit', this.params, 'confirm')
    },
    // 判断是否显示 DataPicker 的 tag
    showDataPickerTag (type, value) {
      if (type !== 'dataPicker') {
        return false
      }
      // 点击 el-date-picker 上的清除按钮后 value 会变成 null
      if (!value) {
        return false
      }
      if (Array.isArray(value)) {
        return value.length > 0
      }

      // 字符串时
      return true
    },
    dataPickDisplay (value) {
      if (Array.isArray(value)) {
        return this.date2String(value[0]) + '-' + this.date2String(value[1])
      } else {
        return this.date2String(value)
      }
    },
    timeChange (time) { // 点击日历组件自带的清空时 置空为[]
      if (!time) {
        this.$set(this.params, this.select, [])
      }
      this.$emit('timeChange', time)
    },
    // tag 点击事件
    tagClickHandle (key, value, subValue) {
      if (this.select !== key) {
        // watch select 也会判断是否 inputFocus
        this.select = key
      } else {
        // 如果一致的时候（select watch 无法触发）在此处执行 inputFocus
        if (this.valueType === 'input') {
          // 输入框获取焦点
          this.inputFocus()
        }
      }
      this.$emit('tag-click', key, value, subValue)
    },
    deleteTag (key, subVal) {
      let deleteAfterValue
      if (subVal) {
        // 参数是数组格式的，剔除数组中对应的项
        deleteAfterValue = this.defaultParams[key].filter(val => val !== subVal)
      } else {
        deleteAfterValue = this.filterItems[key].default
        // 如果没有配置 default，则按默认的值
        if (deleteAfterValue === undefined) {
          // 清空 valueType === 'dataPicker' 置空为[] 其他为 空字符串
          deleteAfterValue = this.valueType === 'dataPicker' ? [] : ''
        }
      }
      // 删除后最新的 defaultParams
      const newParams = { ...this.defaultParams, [key]: deleteAfterValue }
      this.$emit('update:default-params', newParams)
      this.$emit('delete', { key, item: subVal })
      this.$emit('submit', newParams, 'deleteTag', { key, item: subVal })
    },
    // input 获取焦点
    async inputFocus () {
      if (!this.autoFocus) {
        return
      }
      await this.$nextTick()
      if (this.valueType === 'input') {
        this.$refs.inputRef && this.$refs.inputRef.focus()
      }
    }
  },
  mounted () {
    // 输入框获取焦点
    this.inputFocus()
  }
}
</script>
<style lang="postcss" scoped>
.idss-filters {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -8px;
  outline: none;

  & .idss-filters-select{
    display: flex;
    flex-shink: 0;
    font-weight: normal;
    margin-right: 8px;
    margin-bottom: 8px;

    & >>> .el-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: 0;
    }

    & .filters-select-input {
      display: flex;
      border: var(--guan-gray-1, #e8e0e6) solid 1px;
      border-right: none;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;

      &:focus-within{
        border: var(--blue-6, #0084cf) solid 1px;
        border-right: none;
      }

      & >>> .el-select {
        display: block;
      }
      & >>> .el-input__inner {
        border: none;
      }

      & .idss-filter-box {
        width: 100%;
        min-width: 280px;
        & >>> .idss-time-select-display {
          width: 100%;
        }
      }
    }

    & .filters-select-container {
      /* 使 container 的宽度达到最大 */
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: content;

      & > * {
        width: 100%;
      }
    }
  }

  & >>> .idss-filter-tag {
    margin-right: 8px;
    margin-bottom: 8px;

    &:hover {
      color: var(--red-5, #eb3d40);
      border-color: var(--red-2, #ffc2bd);
      background-color: var(--red-1, #ffe8e6);
      & .el-tag__close {
        color: var(--red-5, #eb3d40);
        background-color: var(--red-1, #ffe8e6);
      }
    }
  }

}
</style>
