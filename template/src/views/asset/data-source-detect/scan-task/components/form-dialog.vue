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
      <el-row :gutter="15">
        <el-form-item label="任务名称" prop="name">
          <el-col :span="18">
            <el-input
              v-model="form.name"
              size="mini"
              maxlength="64"
              placeholder="请输入"
            ></el-input>
          </el-col>
        </el-form-item>
        <!-- ipId 不为空时 表示从扫描模版管理新建的任务 需要隐藏扫描模版选择 -->
        <el-form-item v-if="!showIpSelect" label="扫描模版" prop="ipId">
          <el-col :span="18">
            <el-select v-model="form.ipId" clearable @change="handleTplChange">
              <el-option
                v-for="item in tpls"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="所属网络域" prop="netdistrictId">
          <el-col :span="18">
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
              :select="{
                disabled: isSelectedTpl,
              }"
            >
            </idss-select-tree>
          </el-col>
        </el-form-item>
        <el-form-item label="目标IP" prop="ipSection">
          <el-col :span="18">
            <el-input
              v-model="form.ipSection"
              :disabled="isSelectedTpl"
              size="mini"
              type="textarea"
              placeholder="可以输入多个以换行分隔的ip/IP段"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-popover width="200" trigger="hover">
              <idss-icon-svg slot="reference" class="" name="help" />
              <section width="">
                IP示例：
                <br />
                192.168.1.1
                <br />
                192.168.1.2/24
                <br />
                192.168.1.1-192.168.1.50
              </section>
            </el-popover>
          </el-col>
        </el-form-item>
        <el-form-item label="端口" prop="portGroup">
          <el-col :span="18">
            <el-input
              v-model="form.portGroup"
              type="textarea"
              placeholder="请输入端口号，多个端口以逗号“,”隔开。如：45,50-60,443 一次最多不能超过100个。未填视为扫描全部开放端口。"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <div style="height: 20px">
              <el-popover width="200" trigger="hover">
                <idss-icon-svg slot="reference" class="" name="help" />
                <section width="">未填视为扫描全部开放端口。</section>
              </el-popover>
            </div>
            <el-button type="text" @click="showPortGroupDialog"
              >端口组</el-button
            >
          </el-col>
          <!-- <el-input-number
              v-model="form.startPort"
              :controls="false"
              size="mini"
              class="port-input"
              :min="0"
              :max="form.endPort || form.endPort === 0 ? form.endPort : 65535"
            ></el-input-number>
            -
            <el-input-number
              v-model="form.endPort"
              :controls="false"
              size="mini"
              class="port-input"
              :min="form.startPort || 0"
              :max="65535"
            ></el-input-number> -->
        </el-form-item>
        <el-form-item label="资源类型" prop="assetType">
          <el-col :span="18">
            <el-select
              v-model="form.assetType"
              multiple
              :disabled="isSelectedTpl"
            >
              <el-option
                v-for="item in options.assetType"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              ></el-option>
            </el-select>
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
        <el-form-item label="探针名称" prop="probeId">
          <el-col :span="18">
            <el-select v-model="form.probeId" no-data-text="请先选择网络域">
              <el-option
                v-for="probe in options.probeList"
                :key="probe.code"
                :value="probe.code"
                :label="probe.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-popover width="200" trigger="hover">
              <idss-icon-svg slot="reference" class="" name="help" />
              <section width="">
                探针自动适配：根据网络域限制以及探针的实际负载，优先选择低负载探针。
                <br />
                负载指标主要包括：探针可用状态、内存使用率、CPU使用率等；
              </section>
            </el-popover>
          </el-col>
        </el-form-item>
      </el-row>
    </el-form>
    <PortGroupDialog
      v-bind.sync="portGroupDialog"
      @submit="handleSelectPortGroup"
    />
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
import CrontabSelect from "@/components/crontab-select";
import crontabRule from "@/components/crontab-select/rule";
import PortGroupDialog from "./port-group-dialog";
import {
  addJob,
  getJobDetail,
  updateJob,
  getProbes,
  getCommonSelectOptions,
  getIpList,
} from "../api";
const formDefaultValue = {
  name: null,
  ipId: null,
  netdistrictId: null,
  ipSection: null,
  assetType: [],
  executeCycle: undefined,
  crontab: {},
  probeId: null,
  portGroup: null,
};
export default {
  components: {
    CrontabSelect,
    PortGroupDialog,
  },
  props: {
    id: {
      type: [String, Number],
    },
    ipId: {
      type: [String, Number],
    },
    showIpSelect: {
      type: Boolean,
      default: false,
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
        netdistrictId: [
          {
            required: true,
            message: "请选择",
          },
        ],
        ipSection: [
          {
            required: true,
            message: "请输入",
          },
        ],
        executeCycle: [
          {
            required: true,
            message: "请选择",
          },
        ],
        crontab: [crontabRule],
        probeId: [
          {
            required: true,
            message: "请选择",
          },
        ],
      },
      options: {
        probeList: [],
        assetType: [],
        netdistrict: [],
      },
      netdistrictDialog: {
        id: null,
        visible: false,
      },
      portGroupDialog: {
        id: null,
        visible: false,
      },
      tpls: [],
    };
  },
  computed: {
    title() {
      const obj = {
        add: "新建",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.type] || "") + "扫描任务";
    },
    isSelectedTpl() {
      return Boolean(this.form.ipId);
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.form = { ...formDefaultValue };
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }

        if (this.ipId) {
          this.form.ipId = this.ipId;
          this.handleTplChange();
        }
        if (this.type !== "add") {
          this.getDetail();
        }
      }
    },
    "form.netdistrictId": {
      handler(newVal) {
        if (newVal) {
          this.getProbes();
        } else {
          this.options.probeList = [];
        }
      },
    },
  },
  created() {
    this.getTpl();
    this.getOptions();
  },
  methods: {
    getTpl() {
      getIpList().then((res) => {
        this.tpls = res;
      });
    },
    getProbes() {
      getProbes({
        netdistrictId: this.form.netdistrictId,
      })
        .then((res) => {
          this.options.probeList = res;
        })
        .catch(() => {});
    },
    getOptions() {
      const types = ["netdistrict", "assetType"];
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
          const func = this.type === "add" ? addJob : updateJob;
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
    getFormData() {
      const data = _.omit(this.form, ["crontab"]);

      const { crontab, assetType } = this.form;
      const executeConfig = JSON.stringify(crontab.executeConfig);
      return {
        ...data,
        ...crontab,
        executeConfig,
        assetType: assetType.join(","),
      };
    },
    setFormData(data) {
      const { assetType } = data;
      const basic = _.pick(data, [
        "name",
        "ipId",
        "netdistrictId",
        "executeCycle",
        "probeId",
        "ipSection",
        "portGroup",
      ]);
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
        assetType: assetType ? assetType.split(",") : [],
        crontab,
      };
    },
    getDetail() {
      this.loading.detail = true;
      getJobDetail(this.id)
        .then((res) => {
          this.setFormData(res);
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
    handleTplChange() {
      const current = _.find(this.tpls, { id: this.form.ipId }) || {};
      this.form.netdistrictId = current.netdistrictId;
      this.form.ipSection = current.ip;
      this.form.assetType = [current.assetType].filter(Boolean);
    },
    showPortGroupDialog() {
      this.portGroupDialog = {
        visible: true,
        id: null,
      };
    },
    handleSelectPortGroup(data) {
      this.form.portGroup = data.map((item) => item.ports).join(",");
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
  .port-input {
    width: calc(50% - 10px);
  }
}
</style>
