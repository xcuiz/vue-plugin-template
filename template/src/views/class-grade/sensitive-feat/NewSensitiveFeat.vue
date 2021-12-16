<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="new-sensitive-feat-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="new-sensitive-feat-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="特征名称" prop="featureName">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.featureName"
              placeholder="请输入特征名称"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.featureName }}</span>
        </el-form-item>
        <el-form-item label="特征标识" prop="code">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.code"
              placeholder="请输入特征标识"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.code }}</span>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.description"
              placeholder="请输入描述"
              type="textarea"
              :rows="3"
              maxlength="255"
            ></el-input>
          </div>
          <span v-else>{{ formData.description }}</span>
        </el-form-item>
        <el-form-item label="规则关系" prop="ruleRelation">
          <div v-if="type !== 'detail'">
            <el-select
              v-model="formData.ruleRelation"
              placeholder="请输入规则关系"
              style="width: 100%"
            >
              <el-option
                v-for="rela of relationList"
                :key="rela.value"
                :value="rela.value"
                :label="rela.label"
              ></el-option>
            </el-select>
          </div>
          <span v-else>{{ formData.ruleRelation | relationFormatter }}</span>
        </el-form-item>
        <el-form-item
          v-for="(rule, index) of formData.strategyRule"
          :key="index"
          prop="strategyRule"
        >
          <div slot="label">
            <span>规则{{ index + 1 }}</span>
            <i
              v-show="
                formData.strategyRule.length - 1 === index && type !== 'detail'
              "
              class="el-icon-delete delete-rule-icon"
              @click="toDeleteRule"
            ></i>
          </div>
          <div class="rule-info">
            <div class="rule-item">
              <div class="rule-label">规则设定</div>
              <div class="rule-content">
                <div v-if="type !== 'detail'">
                  <el-radio-group
                    v-model="formData.strategyRule[index].ruleAttr"
                  >
                    <el-radio
                      v-for="{ label, value } of ruleAttrList"
                      :key="value"
                      :label="value"
                      >{{ label }}</el-radio
                    >
                  </el-radio-group>
                </div>
                <span v-else>{{
                  formData.strategyRule[index].ruleAttr | ruleAttrFormatter
                }}</span>
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-label">匹配方式</div>
              <div class="rule-content">
                <div v-if="type !== 'detail'">
                  <el-select
                    v-model="formData.strategyRule[index].matchType"
                    style="width: 100%"
                  >
                    <el-option label="正则" value="正则"></el-option>
                    <el-option label="包含" value="包含"></el-option>
                    <el-option label="等于" value="等于"></el-option>
                  </el-select>
                </div>
                <span v-else>{{ formData.strategyRule[index].matchType }}</span>
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-label">参数</div>
              <div class="rule-content">
                <div v-if="type !== 'detail'">
                  <el-input
                    v-model="formData.strategyRule[index].param"
                    placeholder="请输入参数"
                    type="textarea"
                    :row="3"
                  ></el-input>
                </div>
                <span v-else>{{
                  formData.strategyRule[index].param || "-"
                }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="type !== 'detail'" label="" prop="relation">
          <el-button @click="toAddRule">添加规则</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-show="type !== 'detail'"
        :loading="loading"
        size="small"
        type="primary"
        :disabled="loading"
        @click="handleSaveForm"
      >
        保 存
      </el-button>
      <el-button size="small" @click="closeDialog"> 取 消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
const relationList = [
  { label: "与", value: "0" },
  { label: "或", value: "1" },
];

const ruleAttrList = [
  {
    label: "字段名",
    value: 1,
  },
  {
    label: "字段注释",
    value: 2,
  },
  {
    label: "数据类型",
    value: 3,
  },
  {
    label: "数据内容",
    value: 4,
  },
  {
    label: "数据长度",
    value: 5,
  },
  {
    label: "已有规则",
    value: 6,
  },
];

export default {
  name: "NewSensitiveFeat",
  filters: {
    relationFormatter(val) {
      if (Array.isArray(relationList)) {
        const find = relationList.find(({ value }) => value === val);

        if (find) {
          return find.label;
        }
      }

      return "-";
    },
    ruleAttrFormatter(val) {
      if (Array.isArray(ruleAttrList)) {
        const find = ruleAttrList.find(({ value }) => value === val);

        if (find) {
          return find.label;
        }
      }

      return "-";
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedId: {
      type: [Number, String],
      default: null,
    },
    type: {
      // add, edit, detail
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,

      loadingDetail: false,

      relationList,
      ruleAttrList,

      formData: {
        featureName: "",
        code: "",
        description: "",
        type: "",
        strategyRule: [],
      },
      rules: {
        featureName: [
          {
            required: true,
            message: "特征名称必填",
          },
        ],
        code: [
          {
            required: true,
            message: "特征名称必填",
          },
        ],
        ruleRelation: [
          {
            required: true,
            message: "规则关系必填",
          },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      const map = {
        add: "添加",
        edit: "编辑",
        detail: "查看",
      };

      return map[this.type] + "特征规则";
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      if (!this.selectedId) {
        return;
      }
      this.loadingDetail = true;
      try {
        const result = await this.$request({
          url: `/gov/api/strategy/feature/detail/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const {
            featureName,
            code,
            description,
            type,
            strategyRule,
            ruleRelation,
          } = result;

          this.formData = {
            featureName,
            code,
            description,
            type,
            strategyRule: strategyRule ? JSON.parse(strategyRule) : [],
            ruleRelation,
          };
        }
      } catch (e) {
      } finally {
        this.loadingDetail = false;
      }
    },
    toAddRule() {
      this.formData.strategyRule.push({
        ruleAttr: 1,
        matchType: "正则",
        param: "",
      });
    },
    toDeleteRule() {
      this.formData.strategyRule.pop();
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    handleSaveForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const { formData, selectedId } = this;
          this.loading = true;

          const url = selectedId
            ? "/gov/api/strategy/feature/edit"
            : "/gov/api/strategy/feature/create";
          const body = {
            ...formData,
            strategyRule: JSON.stringify(formData.strategyRule),
          };

          if (selectedId) {
            body.id = selectedId;
          }

          try {
            await this.$request({
              url,
              method: "POST",
              data: body,
            });

            this.$message.success(`${selectedId ? "编辑" : "新增"}特征规则`);

            this.$emit("after-save", true);
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.new-sensitive-feat-box {
  max-height: 300px;
  overflow: auto;
  padding-right: 5px;

  .delete-rule-icon {
    cursor: pointer;
    margin-left: 5px;
  }

  .rule-info {
    padding-bottom: 5px;
    border-bottom: 1px solid #dcdfe6;

    .rule-item {
      display: flex;
      margin-bottom: 10px;
      .rule-label {
        width: 80px;
      }

      .rule-content {
        flex: 1;

        .el-radio-group {
          display: flex;
          flex-wrap: wrap;
          .el-radio {
            width: 25%;
            flex-shrink: 0;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>
