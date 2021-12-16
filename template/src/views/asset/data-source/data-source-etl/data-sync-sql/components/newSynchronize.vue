<template>
  <el-dialog
    custom
    :title="title"
    :close-on-click-modal="false"
    :visible="visible"
    @close="closeDialog"
  >
    <div class="synchronize-edit-container">
      <el-form
        ref="form"
        primary
        size="mini"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-suffix=":"
      >
        <div class="dataSource">
          <el-form-item label="名称" prop="syncName">
            <el-col :span="18">
              <el-input
                v-model="form.syncName"
                placeholder="请输入名称"
              ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="描述" prop="syncDesc">
            <el-col :span="18">
              <el-input
                v-model="form.syncDesc"
                type="textarea"
                placeholder="请输入描述"
                maxlength="200"
              ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item key="executeCycle" label="执行方式" prop="executeCycle">
            <el-col :span="18">
              <el-select v-model="form.executeCycle">
                <el-option value="02" label="周期执行"></el-option>
                <el-option value="01" label="立即执行"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item
            v-if="form.executeCycle === '02'"
            label="执行频率"
            prop="crontab"
          >
            <el-col :span="18">
              <CrontabSelect v-model="form.crontab" />
            </el-col>
          </el-form-item>

          <el-form-item label="执行SQL" prop="executeSql">
            <el-col :span="18">
              <el-input
                v-model="form.executeSql"
                type="textarea"
                placeholder="请输入执行SQL"
                maxlength="1024"
              ></el-input>
            </el-col>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        :loading="loading.submit"
        type="primary"
        @click="handleSubmit"
        >确定</el-button
      >
      <el-button size="small" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CrontabSelect from "@/components/crontab-select";
import crontabRule from "@/components/crontab-select/rule";
import { addSync, updateSync, getSync } from "../api/index.js";

export default {
  name: "ManageDataServer",
  components: {
    CrontabSelect,
  },
  props: {
    id: {
      type: [Number, String],
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      rules: {
        syncName: [
          {
            required: true,
            message: "请输入名称",
          },
        ],
        executeCycle: [
          {
            required: true,
            message: "请选择",
          },
        ],
        crontab: [crontabRule],
        executeSql: [
          {
            required: true,
            message: "请输入执行SQL",
          },
        ],
      },
      form: {
        syncName: "",
        syncDesc: "",
        executeSql: "",
        executeCycle: undefined,
        crontab: {},
      },
      value: "",
      loading: {
        submit: false,
      },
    };
  },
  computed: {
    isDetail() {
      return this.type === "check";
    },
    title() {
      return this.type === "check"
        ? "资源同步详情"
        : this.type === "add"
        ? "新建资源同步"
        : "资源同步编辑";
    },
  },
  watch: {
    id: {
      async handler(val) {
        if (!val) {
          return;
        }
        const res = await getSync(val);
        this.setFormData(res);
      },
      immediate: true,
    },
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit("update:visible");
    },
    getFormData() {
      const data = _.omit(this.form, ["crontab"]);

      const { crontab } = this.form;
      const executeConfig = JSON.stringify(crontab.executeConfig);
      return {
        ...data,
        ...crontab,
        executeConfig,
      };
    },
    setFormData(data) {
      const basic = _.omit(data, ["crontab"]);
      const crontab = _.pick(data, [
        "executeType",
        "executeCron",
        "executeConfig",
      ]);
      try {
        crontab.executeConfig = JSON.parse(crontab.executeConfig);
      } catch (error) {
        crontab.executeConfig = {};
      }
      this.form = {
        ...basic,
        crontab,
      };
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading.submit = true;
          const data = this.getFormData();
          const func = this.type === "add" ? addSync : updateSync;
          const args = this.type === "add" ? [data] : [this.id, data];
          func(...args)
            .then(() => {
              this.$message.success("保存成功");
              this.$emit("success");
              this.closeDialog();
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

<style lang="postcss" scoped>
.el-form[primary] >>> {
  .el-input {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
