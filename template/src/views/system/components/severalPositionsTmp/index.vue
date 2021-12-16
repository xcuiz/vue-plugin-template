<!--
 * @Author: your name
 * @Date: 2020-06-24 18:04:20
 * @LastEditTime: 2020-08-05 09:56:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/system/components/severalPositionsTmp/index.vue
-->
<template>
  <div class="severalPos-container">
    <el-form
      ref="form"
      hide-required-asterisk
      size="mini"
      :disabled="disabled"
      :model="formData"
    >
      <section
        v-for="(item, index) in formData.lists"
        :key="index"
        class="group-content"
      >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              :label="typeName"
              label-width="70px"
              :prop="`lists.${index}.tableName`"
              :rules="[{ validator: checkLetter, trigger: 'change' }]"
            >
              <el-select
                v-model="item.tableName"
                @change="handleTableNameChange(index, item)"
              >
                <el-option
                  v-for="item in dicts"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="70px" label="时间范围">
              <el-select v-model="item.quickTime">
                <el-option
                  v-for="item in quickTimeList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="!disabled" :span="4" class="group_btn">
            <i class="el-icon-plus" @click="addGroupList"></i>
            <!-- <i class="el-icon-refresh-left"></i> -->
            <i
              v-if="index"
              class="el-icon-close"
              :class="{ visibleHide: !index }"
              @click="deleteGroupList(index)"
            >
            </i>
          </el-col>
        </el-row>
        <el-row v-if="!disabled && !item.execute.length">
          <el-form-item class="add_execute_btn" label-width="70px">
            <div @click="addExecute(item, index)">
              添加运算条件 <i class="el-icon-plus"></i>
            </div>
          </el-form-item>
        </el-row>
        <el-row v-for="(itemI, indexI) in item.execute" :key="indexI">
          <el-col :offset="1" :span="6">
            <el-form-item
              label-width="70px"
              label="运算符"
              :prop="`lists.${index}.execute.${indexI}.type`"
              :rules="[
                { required: true, message: '请选择运算符', trigger: 'change' },
              ]"
            >
              <el-select v-model="itemI.type" :disabled="!indexI">
                <el-option
                  v-for="item in ysfList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label-width="50px"
              label="字段"
              :prop="`lists.${index}.execute.${indexI}.columnName`"
              :rules="[
                {
                  required: true,
                  message: '请选择字段名称',
                  trigger: 'change',
                },
              ]"
            >
              <el-select
                v-model="itemI.columnName"
                @focus="handleFocus($event, item.tableName)"
                @change="handleResetValue(itemI)"
              >
                <el-option
                  v-for="item in wordList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label-width="30px"
              label="="
              :prop="`lists.${index}.execute.${indexI}.value`"
              :rules="[
                { required: true, message: '请选择运算值', trigger: 'change' },
              ]"
            >
              <el-autocomplete
                v-model="itemI.value"
                :fetch-suggestions="
                  (query, cb) => remoteMethod(query, cb, item, itemI)
                "
                placeholder="请输入内容"
              >
                <template slot-scope="{ item }">
                  <div v-idss-tooltip="item.value">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col v-if="!disabled" :span="3" class="execute_btn">
            <i class="el-icon-plus" @click="addExecute(item, index)"></i>
            <i
              class="el-icon-minus"
              @click="deleteExecute(item, index, itemI, indexI)"
            >
            </i>
          </el-col>
        </el-row>
      </section>
    </el-form>
  </div>
</template>

<script>
import { getFormPromise } from "@/utils/common.js";
export default {
  model: {
    prop: "lists",
    event: "eventChange",
  },
  props: {
    // 是否可编辑
    disabled: {
      type: Boolean,
      default: false,
    },
    // list数据源
    sources: {
      type: Array,
      default: () => [],
    },
    // 模块名称
    typeName: {
      type: String,
      default: "",
    },
    // 绑定值
    lists: {
      type: Array,
      default: () => [],
    },
    // 表名
    tableName: {
      type: String,
      default: "",
    },
    // 类型 es，ch
    type: {
      type: String,
      default: "ch",
    },
    // 表名字典项，源于上一步数据
    dicts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 值下拉框数据源--loading
      loading: {
        value: false,
        columnName: false,
      },
      formData: {
        lists: [],
      },
      sourceList: [],
      // 时间范围
      quickTimeList: [
        {
          key: "today",
          value: "当天",
        },
        {
          key: "7day",
          value: "近7天",
        },
        {
          key: "thismonth",
          value: "当月",
        },
      ],
      // 运算符下拉框
      ysfList: [
        {
          key: "or",
          value: "or",
        },
        {
          key: "and",
          value: "and",
        },
        {
          key: "not",
          value: "not",
        },
      ],
      // 字段源list
      wordList: [],
    };
  },
  watch: {
    lists: {
      handler(val) {
        this.formData.lists = val;
      },
      deep: true,
      immediate: true,
    },
    // 表单数据变化时同步
    "formData.lists": {
      handler(val) {
        this.$emit("eventChange", val);
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    // 请求值-下拉框数据源
    /**
     * @param {String} query 搜索值
     * @param {Object} 父节点对象
     * @param {Object} cObj 子节点对象
     */
    async remoteMethod(query, cb, pObj, cObj) {
      let arr = [];
      try {
        const res = await this.$request({
          url: `/gov/api/sys/roles/queryValueByTableAndCol`,
          method: "post",
          tag: "value",
          data: {
            tableName: pObj.tableName,
            columnName: cObj.columnName,
            type: this.type,
            queryValue: query,
          },
        });
        arr = res.map((item) => ({
          value: item.code,
          label: item.label,
        }));
        // this.sourceList = res
        cb(arr);
      } catch (error) {
        // this.sourceList = []
        cb(arr);
      }
    },
    /**
     * 效验表明是否重复
     */
    checkLetter(rule, value, callback) {
      // field: "actions.0.ipRegions.0.value"
      // 获取当前循环序列
      let _index = rule.field.split(".")[1];
      let arr = this.formData.lists.map((item) => item.tableName);
      // 数组中去除当前值
      arr.splice(_index, 1);
      if (!value) {
        callback(new Error("请选择表名!"));
      } else if (arr.includes(value)) {
        callback(new Error("表名重复!"));
      } else {
        callback();
      }
    },
    /**
     * 表名变化时候，字段重置为空
     * 因字段对应的数据源与表名强关联
     */
    handleTableNameChange(_index) {
      this.formData.lists[_index].execute.forEach((item) => {
        item.columnName = "";
        item.value = "";
      });
    },
    /**
     * @param {}
     */
    handleResetValue(itemI) {
      itemI.value = "";
    },
    /**
     * 下拉框展开时调用接口
     * @param {Object} evt event事件对象
     * @param {String} tableName  条目对应的表明
     */
    handleFocus(evt, tableName) {
      this.getWordList(tableName, this.type);
    },
    /**
     * 根据数仓集/索引集表名查询所属列
     * @param {String} 第三部/第五步表名
     * @param {String} 类型 ch，es
     */
    async getWordList(tableName, type = "ch") {
      try {
        const res = await this.$request({
          method: "post",
          url: "/gov/api/sys/roles/chAndEs/queryColByTable",
          data: {
            tableName: tableName,
            type: type,
          },
        });
        this.wordList = res || [];
      } catch (error) {
        this.wordList = [];
      }
    },
    // 添加组
    addGroupList() {
      this.formData.lists.push({
        tableName: "",
        quickTime: "",
        execute: [],
      });
    },
    // 删除组
    deleteGroupList(_index) {
      this.formData.lists.splice(_index, 1);
    },
    // 添加execute
    addExecute(group, _gIndex) {
      let tmp = {
        type: "",
        columnName: "",
        value: "",
      };
      // 初始化，添加第一条运算关系时，第一条运算符设为and
      // 删除时，同样保持第一条运算符为and
      if (!group.execute || !group.execute.length) {
        tmp = Object.assign(tmp, {
          type: "and",
        });
      }
      this.formData.lists[_gIndex].execute.push(tmp);
    },
    // 删除execute
    /**
     * @param {Object} group 父级
     * @param {Number} _gIndex 父级序号
     * @param {Object} execute 当前条目
     * @param {Number} _executeIdx 当前条目序号
     */
    deleteExecute(group, _gIndex, execute, _executeIdx) {
      this.formData.lists[_gIndex].execute.splice(_executeIdx, 1);
      if (group.execute && group.execute.length) {
        group.execute[0].type = "and";
      }
    },
    /**
     * 效验
     * // promise改造，返回resolve
     */
    handleValidator() {
      return getFormPromise(this.$refs["form"]);
    },
  },
};
</script>

<style scoped lang="postcss">
.severalPos-container {
  overflow: auto;
  .visibleHide {
    visibility: hidden;
    cursor: default;
  }
  .group-content {
    padding: 15px 15px 10px 0;
    margin-bottom: 10px;
    background-color: #f8f9fb;
    .el-form-item--mini.el-form-item {
      margin-bottom: 12px !important;
    }
    .add_execute_btn {
      color: var(--button-text-color);
      cursor: pointer;
    }
    .group_btn {
      text-align: right;
      margin-right: 10p;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }
    .execute_btn {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
