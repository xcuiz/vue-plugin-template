<template>
  <div class="filter-bar-container">
    <div>
      <!-- 选择时间 -->
      <!-- <TimeController /> -->
      <transition-group name="list-complete" class="filter-list-container">
        <template v-for="filter in selectedFilterList">
          <div :key="filter.code" class="list-item">
            <i
              class="el-icon-error"
              title="删除该过滤器"
              @click="deleteFilter(filter)"
            ></i>
            <template v-if="filter.type === 'input'">
              <el-input
                :key="filter.code"
                v-model="form[filter.code]"
                style="width: 186px"
                size="mini"
                :placeholder="filter.name"
                @keyup.enter.native="updateValue"
              >
                <i
                  slot="suffix"
                  class="el-icon-search el-input__icon"
                  @click="updateValue"
                ></i>
              </el-input>
            </template>
            <template v-if="filter.type === 'select'">
              <el-select
                :key="filter.code"
                v-model="form[filter.code]"
                style="width: 186px"
                size="mini"
                :placeholder="filter.name"
                :multiple="
                  filter.multiple === undefined ? true : filter.multiple
                "
                clearable
                filterable
                collapse-tags
                @change="updateValue"
              >
                <el-option
                  v-for="option in filter.options"
                  :key="option.code"
                  :label="option.name"
                  :value="option.code"
                ></el-option>
              </el-select>
            </template>
            <template v-if="filter.type === 'treeSelect'">
              <idss-select-tree
                :key="filter.code"
                v-model="form[filter.code]"
                style="width: 186px"
                size="mini"
                :placeholder="filter.name"
                multiple
                clearable
                filterable
                collapse-tags
                node-key="code"
                :data="filter.options"
                :select="{
                  multiple: true,
                  'collapse-tags': true,
                }"
                :tree="{
                  'show-checkbox': true,
                  'default-expand-all': true,
                }"
                :props="{
                  label: 'name',
                  children: 'children',
                }"
                @check="updateValue"
              >
              </idss-select-tree>
            </template>
            <template v-if="filter.type === 'date'">
              <el-date-picker
                :key="filter.code"
                v-model="form[filter.code]"
                :value="value[filter.code]"
                size="mini"
                style="width: 220px"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator=""
                :start-placeholder="filter.name"
                value-format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @blur="updateValue"
              >
              </el-date-picker>
            </template>
          </div>
        </template>
        <div key="filter-operators" class="list-complete-item">
          <AddFilter
            v-model="selectedFilters"
            :fields="fields"
            @item-click="handleItemClick"
          />
          <SavedFilters
            v-if="hasSaveFilter"
            :module-code="moduleCode"
            @go-to-save="handleGoToSave"
            @recover="handleRecover"
          />
          <el-popconfirm
            popper-class="filter-bar-clear-all-confirm"
            title="确定要删除所有过滤器吗？"
            @onConfirm="handleClearAllClick"
          >
            <div
              v-show="selectedFilters.length > 0"
              slot="reference"
              class="clear-all"
              title="清除全部过滤器"
            >
              清除全部
            </div>
          </el-popconfirm>
        </div>
        <!-- 添加过滤 -->
      </transition-group>
      <!-- 保存过滤条件对话框 -->
      <SaveDialog
        :visible="saveDialogVisible"
        :module-code="moduleCode"
        @cancel="saveDialogVisible = false"
        @save="handleSave"
      />
    </div>
  </div>
</template>
<script>
/* eslint-disable no-empty */
import AddFilter from "./add-filter";
import SavedFilters from "./saved-filters.vue";
import SaveDialog from "./save-dialog.vue";
import { VALUE_LIST_MIXIN } from "../common/js/mixins";
import { cloneDeep } from "lodash";

export default {
  name: "FilterBar",
  components: {
    AddFilter,
    SavedFilters,
    SaveDialog,
  },
  mixins: [VALUE_LIST_MIXIN],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    fields: {
      type: Array,
      default: () => [],
    },
    // 是否显示对过滤条件的增删查
    hasSaveFilter: {
      type: Boolean,
      default: true,
    },
    moduleCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      IS_DEFAULT: "1",
      // 是否显示保存对话框
      saveDialogVisible: false,
      // showExploreTime: false,
      // exploreTimeText: '', // 显示的文本
      selectedFilters: Object.keys(this.value),
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
      form: cloneDeep(this.value),
    };
  },
  computed: {
    selectedFilterList() {
      let result = [];
      this.fields.forEach((item) => {
        result = result.concat(
          item.children.filter((item) => {
            return this.selectedFilters.indexOf(item.code) !== -1;
          })
        );
      });
      return result;
    },
  },
  watch: {
    value(newVal) {
      this.selectedFilters = Object.keys(newVal);
      this.form = cloneDeep(this.value);
    },
    fields: {
      handler(newVal) {
        const defaultValue = {};
        newVal.forEach(({ children }) => {
          children.forEach((item) => {
            if (item.isDefault === this.IS_DEFAULT) {
              defaultValue[item.code] = this.form[item.code] || null;
            }
          });
        });
        this.form = defaultValue;
        this.selectedFilters = Object.keys(defaultValue);
        // this.updateValue();
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    // 清除全部
    handleClearAllClick() {
      this.selectedFilters = [];
      this.$emit("input", {});
      this.$notify({
        title: "清除成功",
        message: "已清除全部过滤器",
        type: "success",
      });
    },
    // 显示保存对话框
    handleGoToSave() {
      if (this.selectedFilters.length === 0) {
        this.$message({
          message: "当前没有可保存的过滤条件",
          type: "warning",
        });
        return;
      }
      this.saveDialogVisible = true;
    },
    // 保存当前所有的过滤条件
    async handleSave(saveForm) {
      const { name, desc } = saveForm;
      const conditions = [];
      this.selectedFilters.forEach((code) => {
        conditions.push({
          code,
          value: this.form[code],

          filterMode: null,
          startValue: null,
          endValue: null,
          valueList: null,
          operator: null,
        });
      });

      try {
        await this.$request({
          url: "/gov/api/common/savefiltercondition",
          method: "POST",
          data: {
            name,
            desc,
            type: this.moduleCode,
            conditions,
          },
        });

        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success",
        });
      } catch (e) {}
    },
    updateValue() {
      this.$emit("input", this.form);
    },
    handleItemClick({ code }) {
      this.$nextTick(() => {
        if (this.form[code] === undefined) {
          this.$set(this.form, code, null);
        }
      });
    },
    deleteFilter({ code }) {
      this.selectedFilters = this.selectedFilters.filter(
        (item) => item !== code
      );
      delete this.form[code];
      this.updateValue();
    },
    // 点击某已保存过滤条件，恢复
    async handleRecover(id) {
      try {
        const result = await this.$request({
          url: "/gov/api/common/conditiondetail",
          method: "POST",
          data: {
            id: id + "",
            type: this.moduleCode,
          },
        });

        if (Array.isArray(result)) {
          const selectedFilters = [];
          const form = {};
          result.forEach(({ code, value }) => {
            selectedFilters.push(code);
            form[code] = value;
          });
          this.selectedFilters = selectedFilters;
          this.form = form;

          this.updateValue();
        }
      } catch (e) {}
    },
  },
};
</script>
<style scoped lang="postcss">
.filter-list-container {
  > div {
    display: inline-flex;
  }
}
.list-complete-item {
  vertical-align: top;
  display: inline-block;

  &.animated {
    transition: all 0.5s;
  }
}

.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.list-complete-leave-active {
  position: absolute;
}

.filter-bar-container {
  position: relative;
  width: 100%;
  min-height: 28px;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;

  .mask {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /*.time-select-input {*/
  /*outline: none;*/
  /*width: 168px !important;*/
  /*}*/

  .multi-select-container,
  .score-select-container,
  .number-select-container,
  .add-filter-container,
  .time-select-container,
  .search-select-container,
  .saved-filters-container {
    margin-right: 10px;
    margin-bottom: 15px;
  }

  .clear-all {
    display: inline-block;
    font-size: var(--font-size-13);
    font-weight: 400;
    line-height: 24px;
    margin-top: 2px;
    color: #4a90ea;
    transition: all 0.1s;

    &:hover {
      cursor: pointer;
      font-weight: 500;
      color: #4783d8;
    }
  }
}
</style>
<style lang="postcss">
.filter-bar-clear-all-confirm {
  .el-popconfirm__action {
    margin-top: 10px;
  }
}
.list-item {
  margin-right: 10px;
  margin-bottom: 15px;
  position: relative;
  &:hover {
    > .el-icon-error {
      opacity: 1;
    }
  }

  > .el-icon-error {
    opacity: 0;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    padding: 3px;
    box-sizing: border-box;
    right: 0;
    color: #cecfd1;
    top: -18px;
    transition: all 0.3s;

    &:hover {
      color: orangered;
    }
  }
}
</style>
