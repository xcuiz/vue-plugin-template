<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="extend-attr-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="extend-attr-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="属性名称:" prop="name">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.name"
              placeholder="请输入属性名称"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="属性编码:" prop="code">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.code"
              placeholder="请输入属性编码"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.code }}</span>
        </el-form-item>
        <el-form-item label="属性类型:" prop="propType">
          <div v-if="type !== 'detail'">
            <el-select
              v-model="formData.propType"
              placeholder="请输入属性编码"
              style="width: 100%"
              @change="propTypeChange"
            >
              <el-option
                v-for="{ name, code } of propTypeList"
                :key="code"
                :value="code"
                :label="name"
              ></el-option>
            </el-select>
          </div>
          <span v-else>{{ codeToName(formData.propType) }}</span>
        </el-form-item>
        <el-form-item
          v-if="typeToFields.includes('dictCode')"
          label="关联字典:"
          prop="dictCode"
          :required="formData.propType === 'dict'"
        >
          <div v-if="type !== 'detail'">
            <el-select
              v-model="formData.dictCode"
              placeholder="请输入关联字典"
              style="width: 100%"
            >
              <el-option
                v-for="{ name, code } of propDictsList"
                :key="code"
                :value="code"
                :label="name"
              ></el-option>
            </el-select>
          </div>
          <span v-else>{{ dictCodeToName(formData.dictCode) }}</span>
        </el-form-item>
        <el-form-item
          v-if="typeToFields.includes('propDefault')"
          label="默认值:"
          prop="propDefault"
        >
          <div v-if="type !== 'detail'">
            <el-input-number
              v-if="formData.propType === 'num'"
              v-model="formData.propDefault"
              placeholder="请输入默认值"
              maxlength="64"
              class="prop-len"
              :controls="false"
            ></el-input-number>
            <el-input
              v-else
              v-model="formData.propDefault"
              placeholder="请输入默认值"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.propDefault }}</span>
        </el-form-item>
        <el-form-item
          v-if="typeToFields.includes('propLen')"
          label="参数长度:"
          prop="propLen"
        >
          <div v-if="type !== 'detail'">
            <el-input-number
              v-model="formData.propLen"
              class="prop-len"
              placeholder="请输入参数长度"
              maxlength="64"
              :controls="false"
              step-strictly
            ></el-input-number>
          </div>
          <span v-else>{{ formData.propLen }}</span>
        </el-form-item>
        <el-form-item
          v-if="typeToFields.includes('propMin')"
          label="最小值:"
          prop="propMin"
        >
          <div v-if="type !== 'detail'">
            <div style="display: flex; justify-content: space-between">
              <el-input-number
                v-model="formData.propMin"
                placeholder="请输入最小值"
                maxlength="64"
                :controls="false"
                step-strictly
                class="pro-min-max"
              ></el-input-number>

              <div>
                最大值:
                <el-input-number
                  v-model="formData.propMax"
                  style="margin-left: 10px"
                  placeholder="请输入最大值"
                  maxlength="64"
                  :controls="false"
                  step-strictly
                  class="pro-min-max"
                ></el-input-number>
              </div>
            </div>
          </div>
          <span v-else
            >{{ formData.propMin
            }}<span style="margin-left: 150px"
              >最大值:
              <span style="margin-left: 5px">{{ formData.propMax }}</span></span
            ></span
          >
        </el-form-item>
        <el-form-item
          v-if="typeToFields.includes('propRegExp')"
          label="格式校验:"
          prop="propRegExp"
        >
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.propRegExp"
              placeholder="请输入格式校验"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.propRegExp }}</span>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.description"
              placeholder="请输入描述"
              maxlength="255"
              type="textarea"
              :rows="3"
            ></el-input>
          </div>
          <span v-else>{{ formData.description }}</span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="type !== 'detail'"
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
const DEFAULT_PROP_LEN = 10;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 10;

export default {
  name: "NewForm",
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

      propTypeList: [],
      propDictsList: [],

      // 哪些字段可以显示
      typeToFields: [],

      formData: {
        name: "",
        code: "",
        description: "",

        propType: "",
        propRegExp: "",
        propDefault: "",
        propLen: DEFAULT_PROP_LEN,
        propMin: DEFAULT_MIN,
        propMax: DEFAULT_MAX,
        dictCode: "",
      },

      rules: {
        name: [
          {
            required: true,
            message: "属性名称必填",
          },
        ],
        code: [
          {
            required: true,
            message: "属性编码必填",
          },
        ],
        propDefault: [
          {
            trgger: "blur",
            validator: (rule, value, callback) => {
              const { propMin, propMax, propType, propLen } = this.formData;

              if (propType === "num") {
                if (!(value >= propMin && value <= propMax)) {
                  return callback(new Error("默认值介于最小值和最大值之间"));
                }

                if (value.toString().length > propLen) {
                  return callback(new Error("默认值的长度不能超过参数长度"));
                }
              }

              if (propType === "input") {
                if (value.length > propLen) {
                  return callback(new Error("默认值的长度不能超过参数长度"));
                }
              }

              callback();
            },
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

      return map[this.type] + "扩展属性";
    },
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      await this.getDetail();
      await this.getPropTypeList();

      this.changeTypeToFields(this.formData.propType);

      this.getPropDictsList();
    },
    async getDetail() {
      if (!this.selectedId) {
        return;
      }

      this.loadingDetail = true;
      try {
        const result = await this.$request({
          url: `/gov/api/data/extend/detail/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const {
            name,
            code,
            description,
            propType,
            propRegExp,
            propDefault,
            propLen,
            propMin,
            propMax,
            dictCode,
          } = result;

          this.formData = {
            name,
            code,
            description,

            propType,
            propRegExp,
            propDefault,
            propLen,
            propMin,
            propMax,
            dictCode,
          };
        }
      } catch (e) {
      } finally {
        this.loadingDetail = false;
      }
    },
    async getPropTypeList() {
      try {
        const result = await this.$request({
          url: "/gov/api/data/extend/propTypes/select",
          method: "GET",
        });

        if (Array.isArray(result) && result.length > 0) {
          this.propTypeList = result;

          if (!this.formData.propType) {
            const { code } = result[0];
            this.formData.propType = code;

            this.propTypeChange(code);
          }
        }
      } catch (e) {}
    },
    async getPropDictsList() {
      try {
        const result = await this.$request({
          url: "/gov/api/data/extend/propDicts/select",
          method: "GET",
        });

        if (Array.isArray(result)) {
          this.propDictsList = result;
        }
      } catch (e) {}
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    async handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { type, formData, selectedId } = this;
          this.loading = true;

          const {
            name,
            code,
            description,
            propType,
            propRegExp,
            propDefault,
            propLen,
            propMin,
            propMax,
            dictCode,
          } = formData;

          let url = "/gov/api/data/extend/create";
          let method = "POST";
          let msg = "新增";
          if (type === "edit") {
            url = `/gov/api/asset/pool/${selectedId}`;
            method = "PUT";
            msg = "编辑";
          }
          try {
            await this.$request({
              url,
              method,
              data: {
                name,
                code,
                description,

                propType,
                propRegExp,
                propDefault,
                propLen,
                propMin,
                propMax,
                dictCode,
              },
            });

            this.$message.success(`${msg}扩展属性成功`);
            this.$emit("after-close");
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    changeTypeToFields(val) {
      if (val === "dict") {
        this.typeToFields = ["dictCode"];
      } else if (val === "num") {
        this.typeToFields = ["propDefault", "propLen", "propMin", "propMax"];
      } else if (val === "input") {
        this.typeToFields = ["propDefault", "propLen", "propRegExp"];
      }
    },
    propTypeChange(val) {
      this.changeTypeToFields(val);

      // 改变属性编码, 重置部分表单
      this.formData.dictCode = "";
      this.formData.propDefault = "";
      this.formData.propLen = DEFAULT_PROP_LEN;
      this.formData.propMin = DEFAULT_MIN;
      this.formData.propMax = DEFAULT_MAX;
      this.formData.propRegExp = "";

      this.$refs.form.clearValidate(["propDefault"]);
    },
    codeToName(val) {
      const find = this.propTypeList.find(({ code }) => code === val);

      if (find) {
        return find.name;
      }

      return "-";
    },
    dictCodeToName(val) {
      const find = this.propDictsList.find(({ code }) => code === val);

      if (find) {
        return find.name;
      }

      return "-";
    },
  },
};
</script>

<style lang="postcss">
.extend-attr-box {
  .prop-len {
    width: 100%;
    input {
      text-align: left;
    }
  }

  .pro-min-max {
    width: 170px;

    input {
      text-align: left;
    }
  }
}
</style>
