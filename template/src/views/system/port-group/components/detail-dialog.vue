<!--
 * @Author: yincheng
 * @Date: 2021-04-30 10:58:17
 * @LastEditors: yincheng
 * @LastEditTime: 2021-05-10 15:02:36
-->
<template>
  <el-dialog
    custom
    :title="title"
    :visible="visible"
    :modal-append-to-body="false"
    class="report-dialog"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="form"
      v-loading="loading.detail"
      size="mini"
      :model="form"
      :rules="type !== 'detail' ? rules : {}"
      label-width="100px"
    >
      <el-form-item label="端口组名称" prop="portGroupName">
        <div v-if="type !== 'detail'">
          <el-input
            v-model="form.portGroupName"
            placeholder="请输入"
            maxlength="64"
          ></el-input>
        </div>
        <span v-else>{{ form.portGroupName }}</span>
      </el-form-item>
      <el-form-item label="端口号" prop="ports">
        <div v-if="type !== 'detail'">
          <el-input
            v-model="form.ports"
            placeholder="请输入端口号，多个端口以逗号“，”隔开。如：45,50-60，443一次最多不能超过100个。"
            type="textarea"
            :rows="3"
          ></el-input>
        </div>
        <span v-else>{{ form.ports }}</span>
      </el-form-item>
      <el-form-item label="描述" prop="groupDesc">
        <div v-if="type !== 'detail'">
          <el-input
            v-model="form.groupDesc"
            placeholder="请输入"
            maxlength="255"
            type="textarea"
            :rows="3"
          ></el-input>
        </div>
        <span v-else>{{ form.groupDesc }}</span>
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
import { addPortGroup, getPortGroup, updatePortGroup } from "../api";

const formDefaultValue = {
  portGroupName: null,
  ports: null,
  groupDesc: null,
};
export default {
  props: {
    portGroupId: {
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
        portGroupName: [
          {
            required: true,
            message: "请输入端口组名称",
          },
        ],
        ports: [
          {
            required: true,
            message: "请输入端口",
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const ports = value.split(/\,|\，|-/);
              ports.forEach((_port) => {
                const port = Number(_port);
                if (
                  // Not a Number
                  Number.isNaN(port) ||
                  // 带小数点
                  parseInt(port) !== port ||
                  // 小于1
                  port < 1 ||
                  // 大于65535
                  port > 65535
                ) {
                  callback(`${_port} 端口格式错误`);
                  return;
                }
              });
              callback();
            },
          },
        ],
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
      return (obj[this.type] || "") + "端口组";
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
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading.submit = true;
          const data = this.form;
          const func = this.type === "add" ? addPortGroup : updatePortGroup;
          const args = this.type === "add" ? [data] : [this.portGroupId, data];
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
      getPortGroup(this.portGroupId)
        .then((res) => {
          this.form = res;
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
  },
};
</script>
<style lang="postcss">
.report-dialog {
  &.el-dialog__wrapper[custom] .el-dialog {
  }
  .idss-svg-icon {
    fill: #409eff;
  }
  .run-config-form-item {
    .el-select {
      width: 350px;
    }
  }
  .form-title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 18px;
    line-height: 28px;

    h3 {
      width: 108px;
      font-weight: bold;
      text-align: right;
    }
  }
}
.CodeMirror-hints {
  z-index: 3000 !important;
}
</style>
