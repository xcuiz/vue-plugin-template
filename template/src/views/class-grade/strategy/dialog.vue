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
        label-width="190px"
      >
        <article class="form-content-box">
          <el-form-item label="策略名称" prop="name">
            <el-input
              v-model="formData.name"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="适用范围" prop="rangeArea">
            <el-select v-model="formData.rangeArea" style="width: 100%">
              <el-option :value="1" label="通用"></el-option>
              <el-option :value="2" label="非结构化"></el-option>
              <el-option :value="3" label="结构化"></el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item label="元素组合方式" prop="elmgroupType">
            <el-select v-model="formData.elmgroupType" style="width: 100%">
              <el-option :value="1" label="无序组合"></el-option>
              <el-option :value="2" label="有序组合"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="(可选敏感元素)最小命中数" prop="minaimQty">
            <el-input-number v-model="formData.minaimQty" :min="0" />
          </el-form-item>
          <el-form-item
            label="敏感元素(必选)"
            prop="listSensitiveElementRequired"
          >
            <el-select
              v-model="formData.listSensitiveElementRequired"
              style="width: 100%"
              multiple
            >
              <el-option
                v-for="item in options.elementList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="敏感元素(可选)"
            prop="listSensitiveElementChoosable"
          >
            <el-select
              v-model="formData.listSensitiveElementChoosable"
              style="width: 100%"
              multiple
            >
              <el-option
                v-for="item in options.elementList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
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
import { strToArr } from "@/utils/common";
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
        rangeArea: "",
        classId: "",
        levelId: "",
        elmgroupType: "",
        minaimQty: null,
        listSensitiveElementChoosable: [],
        listSensitiveElementRequired: [],
        probeId: "",
        remark: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入策略名称",
          },
        ],
        rangeArea: [
          {
            required: true,
            message: "请选择适用范围",
          },
        ],
        elmgroupType: [
          {
            required: true,
            message: "请选择元素组合方式",
          },
        ],
        minaimQty: [
          {
            type: "number",
            required: true,
            message: "请输入最小命中元素数",
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
        elementList: [],
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
          title = "新增敏感策略";
          break;
        case "edit":
          title = "编辑敏感策略";
          break;
        default:
          title = "查看敏感策略";
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
      this.options.elementList = await this.$request({
        url: "/gov/api/strategy/sensitiveElement/getAllElements",
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
        url: `/gov/api/strategy/sensitiveConfig/${id}`,
        method: "GET",
      })
        .then((result) => {
          if (result) {
            this.formData = {
              ...pick(result, [
                "name",
                "rangeArea",
                "classId",
                "levelId",
                "elmgroupType",
                "minaimQty",
                "probeId",
                "remark",
              ]),
              listSensitiveElementChoosable: strToArr(
                result.listSensitiveElementChoosable
              ).map(Number),
              listSensitiveElementRequired: strToArr(
                result.listSensitiveElementRequired
              ).map(Number),
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
            listSensitiveElementChoosable: this.formData.listSensitiveElementChoosable.join(
              ","
            ),
            listSensitiveElementRequired: this.formData.listSensitiveElementRequired.join(
              ","
            ),
          };
          const config =
            this.type === "newly"
              ? {
                  method: "post",
                  url: "/gov/api/strategy/sensitiveConfig/add",
                  data,
                }
              : {
                  method: "put",
                  url: "/gov/api/strategy/sensitiveConfig/edit",
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
