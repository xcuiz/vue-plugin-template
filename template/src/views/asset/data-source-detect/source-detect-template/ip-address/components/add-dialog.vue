<template>
  <el-dialog
    custom
    :title="title"
    :visible="visible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="form"
      v-loading="loading.detail"
      primary
      :model="form"
      :rules="rules"
      size="mini"
      label-width="120px"
      label-suffix=":"
    >
      <el-form-item label="模版名称" prop="name">
        <el-input
          v-model="form.name"
          size="mini"
          maxlength="64"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input
          v-model="form.ip"
          type="textarea"
          size="mini"
          maxlength="300"
          placeholder="可以输入多个以换行分隔的ip/IP段"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属网络域" prop="netdistrictId">
        <idss-select-tree
          v-model="form.netdistrictId"
          size="mini"
          node-key="code"
          :data="options.netdistrict"
          :tree="{
            'default-expand-all': true,
          }"
          :props="{
            label: 'name',
            children: 'children',
          }"
        >
        </idss-select-tree>
      </el-form-item>
      <el-form-item label="归属部门" prop="deptId">
        <idss-select-tree
          v-model="form.deptId"
          size="mini"
          node-key="code"
          :data="options.dept"
          :tree="{
            'default-expand-all': true,
          }"
          :props="{
            label: 'name',
            children: 'children',
          }"
        >
        </idss-select-tree>
      </el-form-item>
      <el-form-item label="归属应用" prop="businessSysId">
        <el-select v-model="form.businessSysId">
          <el-option
            v-for="item in options.businessSys"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="探测资源类型" prop="assetType">
        <el-select v-model="form.assetType" multiple>
          <el-option
            v-for="item in options.assetType"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        :loading="loading.submit"
        @click="handleSubmit"
        >确 定</el-button
      >
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addIp, getIp, updateIp, getCommonSelectOptions } from "../api";
const formDefaultValue = {
  name: null,
  ip: null,
  netdistrictId: null,
  businessSysId: null,
  assetType: [],
  deptId: null,
};
export default {
  props: {
    id: {
      type: [String, Number],
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
      loading: {
        detail: false,
        submit: false,
      },
      form: { ...formDefaultValue },
      rules: {
        name: [
          {
            required: true,
            message: "请输入",
          },
        ],
        ip: [
          {
            required: true,
            message: "请输入",
          },
        ],
        netdistrictId: [
          {
            required: true,
            message: "请选择",
          },
        ],
      },
      options: {
        netdistrict: [],
        dept: [],
        assetType: [],
        location: [],
        businessSys: [],
      },
    };
  },
  computed: {
    title() {
      const obj = {
        add: "新增",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.type] || "") + "扫描模版";
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (this.$refs.form) {
          this.form = { ...formDefaultValue };
          this.$refs.form.resetFields();
        }
        if (this.type !== "add") {
          this.getDetail();
        }
      }
    },
  },
  created() {
    this.getSelectOptions();
  },
  methods: {
    getSelectOptions() {
      const types = [
        "netdistrict",
        "dept",
        "assetType",
        "location",
        "businessSys",
      ];
      types.forEach((type) => {
        getCommonSelectOptions(type).then((res) => {
          this.$set(this.options, type, res);
        });
      });
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading.submit = true;
          const data = this.getFormData();
          const func = this.type === "add" ? addIp : updateIp;
          const args = this.type === "add" ? [data] : [this.id, data];
          func(...args)
            .then(() => {
              this.$message.success("保存成功");
              this.$emit("success");
              this.handleClose();
            })
            .finally(() => {
              this.loading.submit = false;
            });
        }
      });
    },
    getDetail() {
      this.loading.detail = true;
      getIp(this.id)
        .then((res) => {
          this.setFormData(res);
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
    getFormData() {
      const { assetType } = this.form;
      return {
        ...this.form,
        assetType: assetType.join(","),
      };
    },
    setFormData(data) {
      const { assetType } = data;
      this.form = {
        ...formDefaultValue,
        ...data,
        assetType: assetType ? assetType.split(",") : [],
      };
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

  .el-textarea {
    width: 100%;
  }
}
</style>
