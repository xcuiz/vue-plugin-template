<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="dictionary-manage-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="dictionary-manage-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="字典类型" prop="type">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.type"
              placeholder="请输入字典类型"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.type }}</span>
        </el-form-item>
        <el-form-item label="主键名" prop="code">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.code"
              placeholder="请输入主键名"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.code }}</span>
        </el-form-item>
        <el-form-item label="主键值" prop="value">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.value"
              placeholder="请输入主键值"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.value }}</span>
        </el-form-item>
        <el-form-item label="顺序" prop="sortNo">
          <div v-if="type !== 'detail'">
            <el-input-number
              v-model="formData.sortNo"
              class="sort-no"
              placeholder="请输入顺序"
              :step="1"
              step-strictly
              :controls="false"
            ></el-input-number>
          </div>
          <span v-else>{{ formData.sortNo }}</span>
        </el-form-item>
        <el-form-item label="父级编码" prop="parentId">
          <div v-if="type !== 'detail'">
            <el-select
              v-model="formData.parentId"
              placeholder="请输入父级编码"
              style="width: 100%"
            >
              <el-option
                v-for="{ code, name } of parentList"
                :key="code"
                :value="code"
                :label="name"
              ></el-option>
            </el-select>
          </div>
          <span v-else>{{ parentIdToName(formData.parentId) }}</span>
        </el-form-item>
        <el-form-item label="字典描述" prop="label">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.label"
              placeholder="请输入字典描述"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.label }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.remark"
              placeholder="请输入备注"
              maxlength="255"
              type="textarea"
              :row="3"
            ></el-input>
          </div>
          <span v-else>{{ formData.remark }}</span>
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

      parentList: [],

      formData: {
        // 类型
        type: "",
        // 字典码
        code: "",
        // 字典值
        value: "",
        // 排序
        sortNo: 1,
        // 字典描述
        label: "",
        // 备注
        remark: "",
        // 父级编码id
        parentId: "",
      },

      rules: {
        type: [
          {
            required: true,
            message: "字典类型必填",
          },
        ],
        code: [
          {
            required: true,
            message: "主键名必填",
          },
        ],
        value: [
          {
            required: true,
            message: "主键值必填",
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

      return map[this.type] + "字典";
    },
  },
  created() {
    this.getDetail();
    this.getDictionarySelect();
  },
  methods: {
    async getDetail() {
      if (!this.selectedId) {
        return;
      }

      this.loadingDetail = true;
      try {
        const result = await this.$request({
          url: `/gov/api/dictionary/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const { type, code, value, sortNo, label, remark, parentId } = result;

          this.formData = {
            type,
            code,
            value,
            sortNo,
            label,
            remark,
            parentId,
          };
        }
      } catch (e) {
      } finally {
        this.loadingDetail = false;
      }
    },
    async getDictionarySelect() {
      try {
        const result = await this.$request({
          url: "/gov/api/dictionary/getDictionarySelect",
          method: "GET",
        });

        if (Array.isArray(result)) {
          this.parentList = result;
        }
      } catch (e) {}
    },
    parentIdToName(val) {
      const { parentList } = this;

      if (Array.isArray(parentList)) {
        const find = parentList.find(({ code }) => code === val);

        if (find) {
          return find.name;
        }
      }

      return "-";
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
            type: formType,
            code,
            value,
            sortNo,
            label,
            remark,
            parentId,
          } = formData;

          let url = "/gov/api/dictionary/create";
          let method = "POST";
          let msg = "新增";
          if (type === "edit") {
            url = `/gov/api/dictionary/${selectedId}`;
            method = "PUT";
            msg = "编辑";
          }
          try {
            await this.$request({
              url,
              method,
              data: {
                type: formType,
                code,
                value,
                sortNo,
                label,
                remark,
                parentId,
              },
            });

            this.$message.success(`${msg}字典成功`);
            this.$emit("after-close");
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
.dictionary-manage-box {
  .sort-no {
    width: 100%;

    input {
      text-align: left;
    }
  }
}
</style>
