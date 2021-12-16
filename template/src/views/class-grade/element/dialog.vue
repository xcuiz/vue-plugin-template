<template>
  <el-dialog
    v-loading="loading.detail"
    :close-on-click-modal="false"
    custom
    :title="currentTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    @close="closeDialog"
  >
    <article class="editPage">
      <!-- 编辑 -->
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="130px"
      >
        <article class="form-content-box">
          <el-form-item label="元素名称" prop="name">
            <el-input
              v-model="formData.name"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="内容识别方式" prop="recotype">
            <el-select v-model="formData.recotype" style="width: 100%">
              <el-option :value="1" label="基于内容"></el-option>
              <el-option :value="2" label="基于字段名"></el-option>
              <el-option :value="3" label="内容字段都命中"></el-option>
              <el-option :value="4" label="内容优先"></el-option>
              <el-option :value="5" label="字段优先"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用范围" prop="rangeArea">
            <el-select v-model="formData.rangeArea" style="width: 100%">
              <el-option :value="1" label="通用"></el-option>
              <el-option :value="2" label="非结构化"></el-option>
              <el-option :value="3" label="结构化"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="formData.recotype && formData.recotype !== 2">
            <el-form-item label="内容匹配模式" prop="contentType">
              <el-select v-model="formData.contentType" style="width: 100%">
                <el-option :value="0" label="不识别"></el-option>
                <el-option :value="1" label="正则表达式"></el-option>
                <el-option :value="2" label="关键字"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容匹配规则" prop="contentValue">
              <el-input v-model="formData.contentValue" placeholder="请输入" />
            </el-form-item>
          </template>
          <template v-if="formData.recotype && formData.recotype !== 1">
            <el-form-item label="字段匹配模式" prop="columnType">
              <el-select v-model="formData.columnType" style="width: 100%">
                <el-option :value="0" label="不识别"></el-option>
                <el-option :value="1" label="正则表达式"></el-option>
                <el-option :value="2" label="关键字"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字段匹配规则" prop="columnValue">
              <el-input v-model="formData.columnValue" placeholder="请输入" />
            </el-form-item>
          </template>
          <el-form-item label="所属分类" prop="classId">
            <el-select v-model="formData.classId" style="width: 100%">
              <el-option
                v-for="item in options.classList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属分级" prop="levelId">
            <el-select v-model="formData.levelId" style="width: 100%">
              <el-option
                v-for="item in options.levelList"
                :key="item.id"
                :value="item.id"
                :label="item.gradeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最大字段长度" prop="contentMaxLength">
            <el-input-number v-model="formData.contentMaxLength" :min="0" />
          </el-form-item>
          <el-form-item label="命中百分比" prop="aimPercent">
            <el-input-number
              v-model="formData.aimPercent"
              :min="0"
              :max="100"
            />
          </el-form-item>
          <el-form-item label="所属探针" prop="probeId">
            <el-select v-model="formData.probeId" style="width: 100%">
              <el-option
                v-for="item in options.probeList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入"
              maxlength="128"
            >
            </el-input>
          </el-form-item>
        </article>
      </el-form>
    </article>
    <!-- 确定按钮 -->
    <span v-show="isEdit" slot="footer" class="dialog-footer">
      <el-button
        size="small"
        :loading="loading.submit"
        type="primary"
        @click="handleSaveForm"
      >
        保 存
      </el-button>
      <el-button size="small" @click="closeDialog"> 取 消 </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { pick } from "lodash";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 信件id
    selectId: {
      type: [String, Number],
      default: "",
    },
    // 页面类型（新增、编辑、查看）newly,edit,examine
    type: {
      type: String,
      default: "newly",
    },
  },
  data() {
    return {
      formData: {
        name: "",
        recotype: 1,
        rangeArea: 1,
        contentType: 0,
        contentValue: "",
        columnType: 0,
        columnValue: "",
        classId: "",
        levelId: "",
        contentMaxLength: 0,
        aimPercent: 0,
        probeId: "",
        remark: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入元素名称",
          },
        ],
        recotype: [
          {
            type: "number",
            required: true,
            message: "请选择内容识别方式",
          },
        ],
        rangeArea: [
          {
            type: "number",
            required: true,
            message: "请选择适用范围",
          },
        ],
        contentType: [
          {
            type: "number",
            required: true,
            message: "请选择内容匹配模式",
          },
        ],
        contentValue: [
          {
            required: true,
            message: "请输入内容匹配规则",
          },
        ],
        columnType: [
          {
            type: "number",
            required: true,
            message: "请选择字段匹配模式",
          },
        ],
        columnValue: [
          {
            required: true,
            message: "请选择字段匹配规则",
          },
        ],
        contentMaxLength: [
          {
            type: "number",
            required: true,
            message: "请输入最小命中元素数",
          },
        ],
        aimPercent: [
          {
            type: "number",
            required: true,
            message: "请输入命中百分比",
          },
        ],
        probeId: [
          {
            required: true,
            message: "请选择所属探针",
          },
        ],
      },
      options: {
        classList: [],
        levelList: [],
        probeList: [],
      },
      loading: {
        detail: false,
        submit: false,
      },
    };
  },
  computed: {
    // newly,edit,examine
    currentTitle() {
      let title = "";
      switch (this.type) {
        case "newly":
          title = "新增敏感元素";
          break;
        case "edit":
          title = "编辑敏感元素";
          break;
        default:
          title = "查看敏感元素";
      }
      return title;
    },
    // 判断是否为编辑页面
    isEdit() {
      return this.type === "newly" || this.type === "edit";
    },
  },
  watch: {
    selectId: {
      handler(val) {
        val && this.loadDetail(val);
      },
      immediate: true,
    },
  },
  created() {
    this.getOptions();
  },
  methods: {
    async getOptions() {
      this.options.classList = await this.$request({
        url: "/gov/api/strategy/sensitiveClassify/getAllClassify",
        method: "get",
      });
      this.options.levelList = await this.$request({
        url: "/gov/api/strategy/grade/getAllGrades",
        method: "get",
      });
      this.options.probeList = await this.$request({
        url: "/gov/api/probe/listAll",
        method: "get",
      });
    },
    loadDetail(id) {
      this.loading.detail = true;
      this.$request({
        url: `/gov/api/strategy/sensitiveElement/${id}`,
        method: "GET",
      })
        .then((result) => {
          if (result) {
            this.formData = {
              ...pick(result, [
                "name",
                "recotype",
                "rangeArea",
                "contentType",
                "contentValue",
                "columnType",
                "columnValue",
                "classId",
                "levelId",
                "contentMaxLength",
                "aimPercent",
                "probeId",
                "remark",
              ]),
            };
          }
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible");
    },
    /**
     * 编辑
     */
    handleEdit() {
      this.$emit("update:type", "edit");
    },
    /**
     * 保存表单
     */
    handleSaveForm() {
      this.$refs.form.validate((res) => {
        if (res) {
          this.loading.submit = true;
          const data = {
            ...this.formData,
          };
          const config =
            this.type === "newly"
              ? {
                  method: "post",
                  url: "/gov/api/strategy/sensitiveElement/add",
                  data,
                }
              : {
                  method: "put",
                  url: "/gov/api/strategy/sensitiveElement/edit",
                  data: {
                    ...data,
                    id: this.selectId,
                  },
                };

          this.$request(config)
            .then(() => {
              this.$message.success("保存成功");
              this.closeDialog();

              this.$emit("update-list");
            })
            .finally(() => {
              this.loading.submit = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.form-content-box {
  padding-right: 5px;
}
</style>
