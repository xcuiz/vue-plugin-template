<template>
  <div class="dynamic-form">
    <template v-for="(item, index) in list">
      <!-- schema 类型为组合模式，最终为数组嵌套的格式传递给后台 -->
      <template v-if="item.type !== 'schema' && !item[mergeFiledMap.inSchema]">
        <el-form-item
          :prop="labelPropPrefix + item[mergeFiledMap.name]"
          :label="`${item[mergeFiledMap.cnName]}：`"
          :rules="getRule(item)"
          :error="errors[item[mergeFiledMap.name]]"
          :key="index">
          <!-- input -->
          <el-input
            v-if="item[mergeFiledMap.type] === 'input' || item[mergeFiledMap.type] === 'password'"
            :type="item[mergeFiledMap.type]"
            :disabled="item[mergeFiledMap.disabled] === mergeFiledMap.disabledValue"
            :class="item.class"
            autocomplete="off"
            v-model.trim="form[item[mergeFiledMap.name]]"
            v-bind="getAttrObj(item)"
            v-on="getEventObj(item)"
            :key="`${item[mergeFiledMap.name]}_${index}_input`"
            :ref="item[mergeFiledMap.name]"></el-input>

          <!-- number, number 支持 number.float，默认是int数据 -->
          <el-input
            v-if="item[mergeFiledMap.type].indexOf('number') > -1"
            :disabled="item[mergeFiledMap.disabled] === mergeFiledMap.disabledValue"
            type="number"
            :class="item.class"
            auto-complete="off"
            v-model.number="form[item[mergeFiledMap.name]]"
            v-bind="getAttrObj(item, 'number')"
            v-on="getEventObj(item)"
            :key="`${item[mergeFiledMap.name]}_${index}_input`"
            :ref="item[mergeFiledMap.name]"></el-input>

          <!-- select -->
          <el-select
            v-else-if="item[mergeFiledMap.type] === 'select'"
            v-model="form[item[mergeFiledMap.name]]"
            style="width:100%"
            :class="item.class"
            :disabled="item[mergeFiledMap.disabled] === mergeFiledMap.disabledValue"
            :multiple="item[mergeFiledMap.multiple] === mergeFiledMap.multipleValue"
            collapse-tags
            v-bind="getAttrObj(item, 'select')"
            v-on="getEventObj(item)"
            :key="`${item[mergeFiledMap.name]}_${index}_select`"
            :ref="item[mergeFiledMap.name]">
            <el-option
              v-for="dict in dict[item.dictName]"
              :key="dict[mergeDictMap.key]"
              :label="dict[mergeDictMap.value]"
              :value="dict[mergeDictMap.key]">
            </el-option>
          </el-select>

          <!-- radio -->
          <el-radio-group
            v-else-if="item[mergeFiledMap.type] === 'radio'"
            v-model="form[item[mergeFiledMap.name]]"
            :class="item.class"
            v-bind="getAttrObj(item)"
            v-on="getEventObj(item)"
            :disabled="item[mergeFiledMap.disabled] === mergeFiledMap.disabledValue"
            :key="`${item[mergeFiledMap.name]}_${index}_radio`"
            :ref="item[mergeFiledMap.name]">
            <el-radio
              v-for="(dict, i) in dict[item.dictName]"
              :key="`radio_${i}`"
              :label="dict[mergeDictMap.key]">
              {{dict[mergeDictMap.value]}}
            </el-radio>
          </el-radio-group>

          <!-- checkbox -->
          <el-checkbox-group
            v-else-if="item[mergeFiledMap.type] === 'checkbox'"
            v-model="form[item[mergeFiledMap.name]]"
            :class="item.class"
            v-bind="getAttrObj(item, 'checkbox')"
            v-on="getEventObj(item)"
            :disabled="item[mergeFiledMap.disabled] === mergeFiledMap.disabledValue"
            :key="`${item[mergeFiledMap.name]}_${index}_checkbox`"
            :ref="item[mergeFiledMap.name]">
            <el-checkbox
              v-for="(dict, i) in dict[item.dictName]"
              :key="`radio_${i}`"
              :label="dict[mergeDictMap.key]">
              {{dict[mergeDictMap.value]}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 级联数据处理 -->
        <div
          v-if="item[mergeFiledMap.isRelatedField] === mergeFiledMap.isRelatedFieldValue &&
            relateList[item[mergeFiledMap.name]] &&
            relateList[item[mergeFiledMap.name]].length"
          class="form-item-relate"
          :key="`relate_${index}`">
          <idss-dynamic-form
            :isEdit="isEdit"
            :list="relateList[item[mergeFiledMap.name]]"
            :form="form"
            :errors="errors"
            :dictApiFn="dictApiFn"
            :relateApiFn="relateApiFn"
            :filedMap="filedMap"
            :dictMap="dictMap">
          </idss-dynamic-form>
        </div>
      </template>
      <!-- schema 组合类型 -->
      <div
        v-else-if="item.type === 'schema'"
        class="form-schema-box"
        :key="item[mergeFiledMap.name]">
        <!-- 外层 label -->
        <el-form-item
          style="width:100%"
          :prop="labelPropPrefix + item[mergeFiledMap.name]"
          :label="item.cnName"
          :rules="getRule(item)"
          :error="errors[item[mergeFiledMap.name]]">
          <el-button v-if="item[mergeFiledMap.multipleLine]" plain type="primary" @click="addSubformItem(item)">+</el-button>
        </el-form-item>
        <!-- schema 的子元素 -->
        <div v-for="(subform, subIndex) in _initSchemaFormValue(item)" :key="subIndex" style="display: flex;">
          <idss-dynamic-form
            :isEdit="isEdit"
            :list="schemaMap[item.name]"
            :form="subform"
            :label-prop-prefix="`${item.name}.${subIndex}.`"
            :errors="errors[item.name] && errors[item.name][subIndex]"
            :dictApiFn="dictApiFn"
            :relateApiFn="relateApiFn"
            :filedMap="filedMap"
            :dictMap="dictMap">
          </idss-dynamic-form>
          <el-form-item v-if="item[mergeFiledMap.multipleLine]" label-width="0">
            <el-button plain @click="removeSubformItem(item, subIndex)">-</el-button>
          </el-form-item>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// 字段匹配项映射表名
const FILE_MAP = {
  type: 'type', // 表单类型
  cnName: 'cnName', // 表单lable中文名
  name: 'name', // 字段名
  dict: 'dict', // 字典数据值
  required: 'required', // 是否必填项
  requiredValue: true,
  length: 'length', // 逗号分隔最大值 最小值长度
  disabled: 'disabled', // 是否可用
  disabledValue: true,
  multiple: 'multiple', // 是否多选
  multipleValue: true, // 是否多选默认值
  pattern: 'pattern', // 匹配正则项
  patternMessage: 'patternMessage', // 正则错误消息提示
  validator: 'validator', // 函数校验
  isRelatedField: 'isRelatedField', // 是否级联字段
  isRelatedFieldValue: true, // 是否级联字段默认值
  multipleLine: 'multipleLine',   // 当 type = schema 时，是否可以输入多行
  children: 'children',           // 当 type = schema 时，指定其子元素进行组合
  inSchema: 'inSchema',           // 指定此字段作为某个 schema 的子类型
  inSchemaValue: false
}
// 字典匹配值默认项
const DICT_MAP = {
  key: 'key',
  value: 'value',
  isDefault: 'isDefault',
  isDefaultValue: true
}
function noop () {}
export default {
  name: 'idss-dynamic-form',
  props: {
    // 是否编辑状态
    isEdit: {
      type: Boolean,
      default: false
    },
    // 动态表单的列表,支持attr，event
    list: {
      type: Array,
      default: () => ([])
    },
    form: {
      type: Object,
      default: () => ({})
    },
    errors: {
      type: Object,
      default: () => ({})
    },
    // 字典api函数调用，外部处理（用于处理api调用时，请求头等额外处理，故全量暴露）
    dictApiFn: {
      type: Function,
      default: noop
    },
    // 级联数据api函数调用，外部处理（用于处理api调用时，请求头等额外处理，故全量暴露）
    relateApiFn: {
      type: Function,
      default: noop
    },
    // 字段匹配项映射表名
    filedMap: {
      type: Object,
      default: () => (FILE_MAP)
    },
    // 字典数据字段名映射表
    dictMap: {
      type: Object,
      default: () => (DICT_MAP)
    },
    // form-item 的 prop 验证前缀（schema 下会出现嵌套的数据格式）
    labelPropPrefix: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 存储字典数据
      dict: {},
      dictRelateFiled: {}, // 存储字典数据名关联字段
      relateList: {}, // 级联数据关联的动态表单列表
      // 输入型文本
      inputTypes: ['password', 'input', 'number'],
      // 设置数值型配置
      numberCnNames: {
        number: '数值',
        integer: '整数',
        float: '浮点型'
      }
    }
  },
  watch: {
    list () {
      // 获取字典数据
      this.getDict()
    }
  },
  computed: {
    // 计算作为 schema 子元素的配置数据
    schemaMap () {
      // 缓存后最终返回的数据
      const schemaMap = {}
      const schemaList = []
      const schemaChildrens = {}

      // 将 schema 与 schema children 找到
      this.list.forEach(val => {
        if (val.type === 'schema') {
          schemaList.push(val)
          // init 空数组
          schemaMap[val.name] = []
        } else if (val[this.mergeFiledMap.inSchema]) {
          schemaChildrens[val.name] = Object.assign({}, val)
          // 将 inSchema 属性删除，在嵌套后，作为正常字段处理
          schemaChildrens[val.name][this.mergeFiledMap.inSchema] = false
        }
      })

      // 填充到 _schemaMap 中
      schemaList.forEach(val => {
        val.children.split(',').forEach(subVal => {
          schemaMap[val.name].push(schemaChildrens[subVal])
        })
      })

      return schemaMap
    },
    // 合并过的字段匹配项映射表名
    mergeFiledMap () {
      return Object.assign({}, FILE_MAP, this.filedMap)
    },
    mergeDictMap () {
      return Object.assign({}, DICT_MAP, this.dictMap)
    }
  },
  methods: {
    // 获取所有关联的字典,并获取
    async getDict () {
      const codeList = []
      // 处理字典数据
      this.$set(this, 'dict', {})
      // 存储字典数据名关联字段
      this.$set(this, 'dictRelateFiled', {})
      const relateFields = []
      // 获取所有字典code值
      this.list.forEach(item => {
        // 判断type是多选select和checkbox时，设置为数组
        if (((item[this.mergeFiledMap.type] === 'select' &&
          item[this.mergeFiledMap.multiple] === this.mergeFiledMap.multipleValue) ||
          item[this.mergeFiledMap.type] === 'checkbox') &&
          !this.form[item[this.mergeFiledMap.name]]) {
          this.$set(this.form, item[this.mergeFiledMap.name], [])
        }
        // 判断字典处理
        if (typeof item[this.mergeFiledMap.dict] === 'string' && item[this.mergeFiledMap.dict]) {
          // 设置获取字典的字典名(同时关联字段与字典名)
          item.dictName = item[this.mergeFiledMap.dict]
          if (!this.dictRelateFiled[item.dictName]) {
            this.$set(this.dictRelateFiled, item.dictName, [])
          }
          this.dictRelateFiled[item.dictName].push(item[this.mergeFiledMap.name])
          codeList.push(item[this.mergeFiledMap.dict])
        } else if (Array.isArray(item[this.mergeFiledMap.dict])) {
          // 设置获取字典的字典名
          item.dictName = item[this.mergeFiledMap.name]
          this.$set(this.dict, item.dictName, item[this.mergeFiledMap.dict])
          // 设置默认值
          this._setSingleDefaultData(this.dict[item.dictName], item.dictName)
        }
        // 记录需要获取级联数据的字段，后续整体触发级联数据处理
        if (item[this.mergeFiledMap.isRelatedField] === this.mergeFiledMap.isRelatedFieldValue) {
          relateFields.push(item[this.mergeFiledMap.name])
        }
      })
      // 需要获取字典数据是，请求字典api
      if (codeList.length && this.dictApiFn !== noop) {
        await this._getDictData(codeList)
      }
      await this.$nextTick()
      // 触发所有级联数据的级联请求
      relateFields.forEach(refName => {
        // 将当前数据传递给change事件
        this.$refs[refName].forEach(vm => {
          // 清除当前节点校验 @fixme 目前级联校验规则切换存在bug，会自动触发el-form自带校验闪现，需修复
          vm.$parent.clearValidate()
          vm.$emit('change', this.form[refName])
        })
      })
    },
    /**
     * 获取远程字典数据 @fixme 暂时只支持固定格式
     * @param {array} codeList 需要获取字典的code
     */
    async _getDictData (codeList) {
      const codes = Array.from(new Set(codeList))
      // 调用远程接口
      const data = await this._getRemoteApi('dict', codes)
      // 将字典默认值数据设置为默认项
      this._setAllDefaultValue(data)
      // 处理字典数据
      this.$set(this, 'dict', data)
    },
    /**
     * 调用远程接口(用于处理api调用时，请求头等额外处理，故全量暴露)
     * @param {string} type 远程接口类型 dict(字典接口) 和 relate（级联调研）
     * @param {any} param 需要处理的请求数据
     */
    async _getRemoteApi (type = 'dict', ...param) {
      const typeList = {
        // 字典
        dict: 'dictApiFn',
        // 级联校验
        relate: 'relateApiFn'
      }

      try {
        // 处理成功处理,将接口返回数据返回给接口处理
        const data = await this[typeList[type]](...param)
        return data || []
      } catch (err) {
        // 错误处理
        console.error(err)
      }
    },
    /**
     * 将字典默认值数据设置为默认项
     * @param {object} data 字典数据
     */
    _setAllDefaultValue (data) {
      // 处理默认数据（当form数据不存在时，处理默认数据）
      Object.entries(this.dictRelateFiled).forEach(([dictName, fileds = []]) => {
        // 获取该字典名的所有数据
        const list = data[dictName] || []
        // 查找默认数据index
        const defaultValueIndex = list.findIndex(item => item.isDefault === this.mergeDictMap['isDefaultValue'])
        if (defaultValueIndex > -1) {
          const defalutValue = list[defaultValueIndex][this.mergeDictMap['key']]
          fileds.forEach(name => {
            // 设置单个默认值
            this._setSingleDefaultData(list, name, defalutValue)
          })
        }
      })
    },
    /**
     * 设置单个默认值
     * @param {array} list 字典数据
     * @param {string} name 字段名
     */
    _setSingleDefaultData (list, name, defalutValue = '') {
      if (!defalutValue) {
        const defaultValueIndex = list.findIndex(item => item.isDefault === this.mergeDictMap['isDefaultValue'])
        if (defaultValueIndex > -1) {
          defalutValue = list[defaultValueIndex][this.mergeDictMap['key']]
        }
      }
      if (!defalutValue) return
      // 判断非编辑状态时，初始值处理
      if (!this.isEdit &&
        ((typeof this.form[name] !== 'boolean' && !this.form[name]) ||
        (Array.isArray(this.form[name]) && !this.form[name].length))) {
        this.$set(this.form, name, Array.isArray(this.form[name]) ? [defalutValue] : defalutValue)
      }
    },
    /**
     * 获取正则校验规则
     * @param {object} item 需要获取整的数据
     */
    getRule (item) {
      const rule = []
      // 用于匹配number.float number.integer number 以及其他
      let inputType = item[this.mergeFiledMap.type].split('.')[0]
      const isInput = this.inputTypes.indexOf(inputType) > -1
      // trigger方式处理
      const trigger = isInput ? 'blur' : 'change'
      let type = 'string'
      if ((inputType === 'select' &&
        item[this.mergeFiledMap.multiple] === this.mergeFiledMap.multipleValue) ||
        inputType === 'checkbox' ||
        inputType === 'schema') {
        // checbox 和多选下拉框是数组
        type = 'array'
      } else if (inputType === 'number') {
        // 默认int型
        type = item[this.mergeFiledMap.type].split('.')[1] || 'number'
        // 对数值型数据添加type处理提示
        rule.push({ type, trigger, message: `请输入${this.numberCnNames[type]}数据` })
      }
      // 必填项处理
      if (item[this.mergeFiledMap.required] === this.mergeFiledMap.requiredValue) {
        rule.push({
          type,
          required: true,
          trigger,
          message: `${isInput ? '请输入' : '请选择'}${item[this.mergeFiledMap.cnName]}`
        })
      }
      // 最大长度和最小长度处理
      const maxMinAttrs = this.getAttrObj(item, inputType)
      if (Object.keys(maxMinAttrs).length) {
        const max = isNaN(maxMinAttrs.max) ? undefined : maxMinAttrs.max
        const min = isNaN(maxMinAttrs.min) ? undefined : maxMinAttrs.min
        const tipsText = inputType === 'number' ? '值' : '长度'
        rule.push({
          type,
          max,
          min,
          trigger,
          message: `${tipsText}范围错误,${isNaN(min) ? '' : `最小${tipsText}:${min}`}${isNaN(max) ? '' : `最大${tipsText}:${max}`}`
        })
      }
      // 正则处理匹配
      if (typeof item[this.mergeFiledMap.pattern] === 'string') {
        rule.push({
          type,
          pattern: new RegExp(item[this.mergeFiledMap.pattern]),
          trigger,
          message: `输入正确的${item[this.mergeFiledMap.patternMessage] || item[this.mergeFiledMap.pattern]}`
        })
      }
      // 验证函数匹配
      if (typeof item[this.mergeFiledMap.validator] === 'function') {
        rule.push({
          type,
          validator: item[this.mergeFiledMap.validator],
          trigger
        })
      }
      return rule
    },
    /**
     * 获取所有组件长度处理,兼容属性和正则
     * @param {object} item 需要获取整的数据
     * @param {string} type 获取limit限制的类型 input checkbox select password
     */
    getAttrObj (item, type = 'input') {
      // 属性默认值
      const res = {
        placeholder: `请${type === 'select' ? '选择' : '输入'}${item[this.mergeFiledMap.cnName]}`
      }
      // 继承所有attr属性
      item.attrs && Object.assign(res, item.attrs)
      // length
      let lengthStr = item[this.mergeFiledMap.length]
      if (!lengthStr || !lengthStr.match(/^\d+(,\s*\d+)*$/)) return res
      lengthStr = lengthStr.replace(/\s/g, '')
      const stringType = {
        maxLength: ['maxLength', 'max'],
        minLength: ['minLength', 'min']
      }
      const typeList = {
        input: stringType,
        number: stringType,
        password: stringType,
        checkbox: {
          maxLength: ['max'],
          minLength: ['min']
        },
        select: {
          maxLength: ['multiple-limit', 'max'],
          minLength: ['min']
        },
        schema: {
          maxLength: ['max'],
          minLength: ['min']
        }
      }
      // 将length数据进行分隔，获取最大值，最小值，兼容一个数值时，
      const lenList = lengthStr.split(',').sort((a, b) => +a - +b)
      let minLength = lenList.slice(0, 1)[0]
      let maxLength = lenList.slice(lenList.length - 1, lenList.length)[0]
      // 处理最大值和最小值相同的情况
      minLength = minLength === maxLength ? undefined : minLength
      // 最小长度
      if (!isNaN(minLength) && typeList[type] && typeList[type].minLength) {
        typeList[type].minLength.forEach(name => {
          res[name] = +minLength
        })
      }
      // 最大长度
      if (!isNaN(maxLength) && typeList[type] && typeList[type].maxLength) {
        typeList[type].maxLength.forEach(name => {
          res[name] = +maxLength
        })
      }
      return res
    },
    /**
     * 获取所有组件events
     * @param {object} item 需要获取整的数据
     */
    getEventObj (item) {
      const res = {}
      const events = {}
      // 判断是否存在级联数据，级联数据控制event change事件，触发级联接口处理
      if (item[this.mergeFiledMap.isRelatedField] === this.mergeFiledMap.isRelatedFieldValue) {
        const change = item.events && item.events.change
        // 覆盖item的change事件，调用级联校验
        events.change = async (value) => {
          // 将form数据处理
          if (this.relateList[item[this.mergeFiledMap.name]]) {
            // 将原有form数据清除
            this.relateList[item[this.mergeFiledMap.name]].forEach(filed => {
              this.$delete(this.form, filed)
              this.$delete(this.errors, filed)
            })
            // 清除级联数据
            this.$delete(this.relateList, item[this.mergeFiledMap.name])
          }
          // 调用级联数据远程接口
          const data = await this._getRemoteApi('relate', value, item)
          // 将级联数据打入级联动态表单列表中
          this.$set(this.relateList, item[this.mergeFiledMap.name], data)
          // 调用自定义事件
          change && change(value, data)
        }
      }
      Object.assign(res, item.events, events)
      return res
    },
    // 初始化 schema 子元素的默认值
    // 当 multipleLine 为 true 时，只初始化一个空数组
    // 当 multipleLine 为 false 时，初始化一个长度的数组，并且对应的子元素默认值为 空字符串
    _initSchemaFormValue (item) {
      if (!this.form[item.name]) {
        let defalutValue
        // 如果是可以多行，则只初始化一个空数组，由 form 中的添加按钮追加数据，否则初始化一个长度的对象
        if (item[this.mergeFiledMap.multipleLine]) {
          defalutValue = []
        } else {
          const temp = {}
          item[this.mergeFiledMap.children].split(',').forEach(val => {
            temp[val] = ''
          })
          defalutValue = [temp]
        }
        this.$set(this.form, item[this.mergeFiledMap.name], defalutValue)
      }
      return this.form[item.name]
    },
    // 增加 schema 的子元素
    addSubformItem (item) {
      const temp = {}
      item[this.mergeFiledMap.children].split(',').forEach(val => {
        temp[val] = ''
      })
      this.form[item[this.mergeFiledMap.name]].push(temp)
    },
    // 删除对应的 schema 的子元素
    removeSubformItem (item, index) {
      this.form[item[this.mergeFiledMap.name]].splice(index, 1)
    }
  },
  created () {
    // 获取字典数据
    this.getDict()
  }
}
</script>
<style lang="postcss" scoped>
.form-schema-box {
  margin-bottom: 16px;
  padding-top: 16px;
  border: var(--border-default, 1px solid rgba(204, 211, 217, 0.5));

  & >>> .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }
}
</style>
