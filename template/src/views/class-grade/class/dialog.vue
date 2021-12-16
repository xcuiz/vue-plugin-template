<template>
  <el-dialog
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
        label-width="90px"
      >
        <article class="form-content-box">
          <el-form-item label="分类名称" prop="name">
            <el-input
              v-model="formData.name"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类级别" prop="classLevel">
            <el-select v-model="formData.classLevel" style="width: 100%">
              <el-option :value="1" label="一级类别"></el-option>
              <el-option :value="2" label="二级类别"></el-option>
              <el-option :value="3" label="三级类别"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属分类" prop="parentId">
            <el-select v-model="formData.parentId" style="width: 100%">
              <el-option
                v-for="item in parentCodeList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属探针" prop="probeId">
            <el-select v-model="formData.probeId" style="width: 100%">
              <el-option
                v-for="item in probes"
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
      <el-button size="small" type="primary" @click="handleSaveForm">
        保 存
      </el-button>
      <el-button size="small" @click="closeDialog"> 取 消 </el-button>
    </span>
  </el-dialog>
</template>

<script>
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
        classLevel: "",
        parentId: "",
        remark: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入分类名称",
          },
        ],
        classLevel: [
          {
            required: true,
            message: "请选择分类级别",
          },
        ],
        probeId: [
          {
            required: true,
            message: "请选择探针",
          },
        ],
      },
      parentCodeList: [],
      classLevel: 1,
      probes: [],
    };
  },
  computed: {
    // newly,edit,examine
    currentTitle() {
      let title = "";
      switch (this.type) {
        case "newly":
          title = "新增敏感分类";
          break;
        case "edit":
          title = "编辑敏感分类";
          break;
        default:
          title = "查看敏感分类";
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
    this.queryParentCode();
    this.getProbes();
  },
  methods: {
    getProbes() {
      this.$request({
        url: "/gov/api/probe/listAll",
        method: "get",
      }).then((res) => {
        this.probes = res;
      });
    },
    async queryParentCode() {
      const result = await this.$request({
        url: "/gov/api/strategy/sensitiveClassify/getAllClassify",
        method: "GET",
      });

      this.parentCodeList = result;
    },
    async loadDetail(id) {
      const result = await this.$request({
        url: `/gov/api/strategy/sensitiveClassify/${id}`,
        method: "GET",
      });

      if (result) {
        const { parentId, name, classLevel, probeId, remark } = result;

        this.formData = {
          parentId,
          name,
          classLevel,
          remark,
          probeId,
        };
      }
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
          this.type === "newly"
            ? this.addForm()
            : this.updateForm(this.selectId);
        }
      });
    },
    async addForm() {
      try {
        await this.$request({
          method: "POST",
          url: "/gov/api/strategy/sensitiveClassify/add",
          data: this.formData,
        });

        this.$message.success("保存成功");

        this.closeDialog();

        this.$emit("update-list");
      } catch (e) {
        // this.$message.error("保存失败");
      }
    },
    updateForm(id) {
      this.$request({
        method: "put",
        url: "/gov/api/strategy/sensitiveClassify/edit",
        data: {
          ...this.formData,
          id,
        },
      }).then(() => {
        this.$message.success("保存成功");

        this.closeDialog();

        this.$emit("update-list");
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
