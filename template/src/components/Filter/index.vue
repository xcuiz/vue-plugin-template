<!--
 * @Author: your name
 * @Date: 2020-07-30 10:55:52
 * @LastEditTime: 2021-03-24 18:16:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/components/Filter/index.vue
-->
<template>
  <div class="filter-container">
    <div class="filter-container-content">
      <el-form
        :inline="true"
        :model="form"
        inline-message
        :rules="rules"
        @submit.native.prevent
      >
        <div class="filter-items">
          <el-form-item>
            <el-select
              v-model="form.filterType"
              size="mini"
              placeholder="请选择筛选条件"
              @change="handleFiltersChange"
            >
              <el-option
                v-for="item in filterOptions"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-form
        ref="form"
        :rules="rules"
        :inline="true"
        :model="form"
        @submit.native.prevent
      >
        <div>
          <!-- 时间控件 -->
          <el-form-item v-if="showType === 'datetime'">
            <el-date-picker
              v-model="form.filterValue"
              :clearable="false"
              size="mini"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              @blur="handleSyncInitValue"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 下拉框组件，单选、复选 -->
          <el-form-item
            v-else-if="showType === 'select' && cfilterOption.multiple"
          >
            <el-select
              key="0"
              v-model="form.filterValue"
              size="mini"
              :placeholder="'请选择' + cfilterOption['value']"
              :multiple="cfilterOption.multiple"
              :collapse-tags="cfilterOption.multiple"
              @remove-tag="handleSyncInitValue"
              @visible-change="handleMultipleVisibleChange"
            >
              <el-option
                v-for="item in selOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 单选 -->
          <el-form-item v-else-if="showType === 'select'">
            <el-select
              key="1"
              v-model="form.filterValue"
              size="mini"
              @change="handleSyncInitValue"
            >
              <el-option
                v-for="item in selOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-else-if="showType === 'select-tree'">
            <el-select
              ref="selectTreeBoxRef"
              v-model="selectTreeModel"
              multiple
              collapse-tags
              placeholder="按系统服务搜索"
              size="mini"
              popper-class="select-tree-filter"
              @visible-change="selectTreeBlur"
              @change="selectTreeChange"
            >
              <el-option value="1" style="height: auto">
                <el-tree
                  ref="selectTreeRef"
                  :data="selOptions"
                  :props="{ children: 'children', label: 'label' }"
                  show-checkbox
                  node-key="label"
                  :highlight-current="true"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 点时间控件 -->
          <el-form-item v-else-if="showType === 'moment'">
            <el-time-picker
              v-model="form.filterValue"
              :clearable="false"
              value-format="HH:mm:ss"
              placeholder="任意时间点"
              @blur="handleSyncInitValue"
            >
            </el-time-picker>
          </el-form-item>

          <!-- 手动输入时间-->
          <!-- 输入时间控件 -->
          <el-form-item v-else-if="showType === 'inputTime'">
            <el-input-number
              v-model="num"
              size="small"
              controls-position="right"
              class="input-number"
              :min="1"
            ></el-input-number>
            <el-select
              key="1"
              v-model="form.filterValue"
              size="mini"
              class="input-number"
            >
              <el-option
                v-for="item in selOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
            <el-button size="mini" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item v-else-if="showType === 'input'" prop="filterValue">
            <el-input
              v-model.trim="form.filterValue"
              :maxlength="maxlength"
              size="mini"
              :placeholder="placeholder"
              @keyup.enter.native="handleSyncInitValue"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="handleSyncInitValue"
              >
              </i>
            </el-input>
          </el-form-item>
          <span v-else>
            <!-- 区间 -->
            <numberRange
              v-model="form.filterValue"
              @change="numberRangeChange"
            ></numberRange>
          </span>
        </div>
      </el-form>
    </div>
    <div>
      <slot name="left"></slot>
    </div>
  </div>
</template>
<script>
const inputValidator = (rule, value, callback) => {
  if (value) {
    if (/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value) === false) {
      callback(new Error("不能以下划线为开头和结尾"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
export default {
  components: {
    numberRange: () => import("./numberRange.vue"),
  },
  props: {
    filterOptions: {
      type: Array,
      required: true,
    },
    // 一级下拉框值
    initType: {
      type: [String, Number],
      default: "1",
    },
    // 主下拉框选中，二级模块的值
    initValue: {
      type: [String, Array],
      required: false,
      default: "",
    },
  },
  data() {
    return {
      num: null,
      form: {
        filterType: "", // 默认一级值
        filterValue: "", // 默认二级值
      },
      cfilterOption: null,
      filterOption: "",

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      rules: {
        // filterValue:[{
        //   validator: inputValidator,
        //   trigger: 'blur',
        // }]
      },
      selectTreeModel: [],
    };
  },
  computed: {
    showType() {
      return this.cfilterOption ? this.cfilterOption.stype : "input";
    },
    placeholder() {
      return this.cfilterOption
        ? "请输入" + this.cfilterOption["value"]
        : "请输入" + this.filterOptions[0]["value"];
    },
    selOptions() {
      return this.cfilterOption.selOptions;
    },
    maxlength() {
      return (this.cfilterOption && this.cfilterOption.maxlength) || 500;
    },
  },
  watch: {
    "form.filterType"(nv, ov) {
      this.selectTreeModel = [];
      this.cfilterOption = _.find(this.filterOptions, { key: nv });
    },
  },
  created() {
    this.form.filterValue = this.initValue || "";
    this.form.filterType = this.initType || "";
  },
  methods: {
    /**
     * 获取当前的主下拉框数据
     */
    getCurrentOption() {
      return (
        this.filterOptions.find((item) => this.form.filterType === item.key) ||
        {}
      );
    },
    getDefaultVal() {
      let _data = this.getCurrentOption();
      return _data.stype == "input" ||
        (_data.stype == "select" && !_data.multiple)
        ? ""
        : [];
    },
    /**
     * 多选时，下拉框消失时，触发事件
     */
    handleMultipleVisibleChange(flag) {
      // console.log(flag)
      !flag && this.handleSyncInitValue();
    },
    // 同步二级值，二级改变后，才一起同步一级、二级数据
    async handleSyncInitValue() {
      const flag = await this.$refs.form.validate();
      if (flag) {
        this.$emit("update:init-type", this.form.filterType);
        this.$emit("update:init-value", this.form.filterValue);
      }
    },
    async search() {
      let arr = [];
      arr[0] = this.num.toString();
      arr[1] = this.form.filterValue;
      const flag = await this.$refs.form.validate();
      if (flag) {
        this.$emit("update:init-type", this.form.filterType);
        this.$emit("update:init-value", arr);
      }
    },
    /**
     * 一级下拉框变化时，值同步,change事件
     */
    handleFiltersChange(val) {
      // 二级默认值重置’‘|| [];
      this.$set(this.form, "filterValue", this.getDefaultVal());
      // this.filterValue = this.getDefaultVal();
      // this.$forceUpdate();
      // this.$emit('update:init-value', this.filterValue);
      this.$emit("type-change", val);
    },
    // 步数区间变化触发,触发复赋值操作
    numberRangeChange() {
      this.handleSyncInitValue();
    },
    selectTreeBlur() {
      const dom = this.$refs["selectTreeRef"];

      const nodes = dom.getCheckedNodes();
      const [labels, names] = this.getChildren(nodes);

      // 数据没有改变更新数据
      if (JSON.stringify(names) === JSON.stringify(this.form.filterValue)) {
        return;
      }

      this.selectTreeModel = labels;
      this.$set(this.form, "filterValue", names);
      this.$emit("update:init-type", this.form.filterType);
      this.$emit("update:init-value", names);
    },
    selectTreeChange(val) {
      const dom = this.$refs["selectTreeRef"];

      dom.setCheckedKeys(val);

      const nodes = dom.getCheckedNodes();
      const [labels, names] = this.getChildren(nodes);

      this.$set(this.form, "filterValue", names);
      this.$emit("update:init-value", names);
    },
    getChildren(nodes) {
      const labels = [];
      const names = [];
      nodes.forEach((item) => {
        const { label, name, children } = item;

        if (Array.isArray(children)) {
          return;
        } else {
          labels.push(label);
          names.push(name);
        }
      });
      return [labels, names];
    },
  },
};
</script>
<style lang="postcss" scoped>
.filter-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;

  .filter-container-content {
    display: flex;
    align-items: center;
  }

  >>> .el-form {
    display: inline-block;
  }
  .filter-items {
    .el-select {
      width: auto;
    }
    .el-input {
      width: auto;
    }
  }
  >>> .el-form--inline .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      line-height: inherit;
    }
  }
  .input-number {
    margin-right: 10px;
  }
  >>> .el-input--small .el-input__inner {
    height: 30px;
    line-height: 1;
  }
  >>> .el-select__tags-text {
    max-width: 55px;
  }
}
</style>

<style lang="postcss">
.select-tree-filter {
  .el-select-dropdown__item {
    padding: 0;

    .el-tree-node__label {
      color: #606266;
      font-weight: 400;
    }
  }
}
</style>
