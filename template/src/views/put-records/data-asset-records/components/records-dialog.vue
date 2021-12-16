<!--
 * @Author: your name
 * @Date: 2021-03-10 17:10:37
 * @LastEditTime: 2021-04-11 09:27:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\put-records\data-asset-records\components\records-dialog.vue
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    title="敏感数据资产备案"
    :visible="visible"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <section class="resourse-dialog">
      <el-form
        ref="form"
        v-loading="loading.detail"
        primary
        :model="form"
        :rules="rules"
        size="mini"
        label-width="160px"
        label-suffix=":"
      >
        <el-row>
          <el-col :span="24">
            <div class="divider">
              <span>备案属性</span>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="敏感资源名称" prop="name">
              <el-input
                v-model="form.name"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
          <el-form-item label="在线状态" prop="status">
            <el-select v-model="form.isStatus" size="mini" placeholder="请选择">
              <el-option
                v-for="option in options.status"
                :key="option.code"
                :value="option.code"
                :label="option.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
          <el-col :span="12">
            <el-form-item label="所属网络域" prop="netdistrictId">
              <el-select
                v-model="form.netdistrictId"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="option in options.netdistrictSel"
                  :key="option.code"
                  :value="option.code"
                  :label="option.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否纳入4A" prop="include4a">
              <el-select v-model="isInclude4a" size="mini" placeholder="请选择">
                <el-option
                  v-for="option in options.include4a"
                  :key="option.code"
                  :value="option.code"
                  :label="option.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属业务系统" prop="businessSysId">
              <el-select
                v-model="form.businessSysId"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="option in options.businessSys"
                  :key="option.code"
                  :value="option.code"
                  :label="option.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <idss-select-tree
                v-model="form.deptId"
                size="mini"
                node-key="code"
                :data="options.deptOptions"
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用管理员" prop="appUser">
              <el-input
                v-model="form.appUser"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="label-with"
              label="应用管理员联系方式"
              prop="appContact"
            >
              <el-input
                v-model="form.appContact"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统管理员" prop="adminUser">
              <el-input
                v-model="form.adminUser"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="label-with"
              label="系统管理员联系方式"
              prop="adminContact"
            >
              <el-input
                v-model="form.adminContact"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作厂商" prop="cooperateVendor">
              <el-input
                v-model="form.cooperateVendor"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开发厂商" prop="devVendor">
              <el-input
                v-model="form.devVendor"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产类型" prop="assetType">
              <el-input
                v-model="form.assetType"
                size="mini"
                maxlength="64"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" style="100%">
              <el-input
                v-model="form.remark"
                type="textarea"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="24" style="text-align: right; margin-top: 15px">
            <el-button size="mini" type="primary" @click="goRecord">
              备案
            </el-button>
          </el-col>

          <el-col :span="24">
            <el-tabs type="card" style="box-shadow: none; margin-top: 25px">
              <el-tab-pane label="基础属性">
                <el-col :span="12">
                  <el-form-item label="存储类型" prop="storageMode">
                    <el-select
                      v-model="form.storageMode"
                      size="mini"
                      placeholder="请选择"
                      @change="getDataType(form.storageMode)"
                    >
                      <el-option
                        v-for="option in options.assetStorageMode"
                        :key="option.code"
                        :value="option.code"
                        :label="option.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="数据库类型" prop="assetType">
                    <el-select
                      v-model="form.assetType"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="option in options.assetDataType"
                        :key="option.code"
                        :value="option.code"
                        :label="option.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="IP地址">
                    <el-input
                      v-model="form.ip"
                      size="mini"
                      maxlength="64"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="端口号">
                    <el-input
                      v-model="form.port"
                      size="mini"
                      maxlength="64"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="数据库名">
                    <el-input
                      v-model="form.dbName"
                      size="mini"
                      maxlength="64"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字符集">
                    <el-input
                      v-model="form.charset"
                      size="mini"
                      maxlength="64"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="敏感数据">
                <SensitiveInfo :table-data="tableData" :mode="form.mode" />
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </section>
  </el-dialog>
</template>

<script>
import SensitiveInfo from "./sensitive-info";
import {
  getRechrdDetail,
  getSelectOptions,
  getSelectNetdistrictSel,
  getSelectDept,
  getSelectBusinessSys,
  getSensitiveInfo,
  postRecord,
  getReaourcePool,
} from "../api";
const formDefaultValue = {
  name: null,
  businessSysId: null,
  type: null,
  netdistrictId: null,
  cooperateVendor: null,
  devVendor: null,
};
export default {
  components: {
    SensitiveInfo,
  },
  props: {
    id: {
      type: [String, Number],
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: {
        test: false,
        detail: false,
        submit: false,
      },
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "tableCode", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      options: {
        assetDataType: [],
        deptOptions: [],
        businessSys: [],
        netdistrictSel: [],
        status: [
          {
            code: 0,
            name: "下线",
          },
          {
            code: 1,
            name: "上线",
          },
        ],

        include4a: [
          {
            code: 0,
            name: "否",
          },
          {
            code: 1,
            name: "是",
          },
        ],
      },
      form: { ...formDefaultValue },
      rules: {
        name: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: "",
            message: "不能包含空格或特殊字符",
          },
        ],
        adminContact: [
          // {
          //   required: true,
          //   message: "请输入",
          // },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确的手机号码或者座机号",
          },
        ],
        appContact: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确的手机号码或者座机号",
          },
        ],
        netdistrictId: [
          {
            required: true,
            message: "请输入",
          },
        ],
        businessSysId: [
          {
            required: true,
            message: "请输入",
          },
        ],
        deptId: [
          {
            required: true,
            message: "请输入",
          },
        ],
        appUser: [
          {
            required: true,
            message: "请输入",
          },
        ],
        // adminUser: [
        //   {
        //     required: true,
        //     message: "请输入",
        //   },
        // ],
        cooperateVendor: [
          {
            required: true,
            message: "请输入",
          },
        ],
        devVendor: [
          {
            required: true,
            message: "请输入",
          },
        ],
      },
    };
  },
  computed: {
    filterFormData() {
      const global = _.pick(this.tableData, [
        "pageSize",
        "pageNum",
        "orderField",
        "orderType",
      ]);
      return {
        param: {
          filingId: this.id,
          mode: this.form.dbName,
          assetType: this.form.assetType,
        },
        global,
      };
    },
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
    isInclude4a() {
      return this.form.include4a === "是" ? 1 : 0;
    },
    isStatus() {
      return this.form.status === "是" ? 1 : 0;
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (this.$refs.form) {
          this.form = { ...formDefaultValue };
          this.$refs.form.resetFields();
        }

        this.getDetail();
      }
    },
  },
  created() {
    this.getSelectOptions();
  },
  methods: {
    async getDetail() {
      this.loading.detail = true;
      await getRechrdDetail(this.id)
        .then((res) => {
          this.$nextTick(() => {
            this.form = {
              ...formDefaultValue,
              ...res,
            };
          });

          // this.setFormData(res);
        })
        .finally(() => {
          this.loading.detail = false;
        });

      if (this.id && this.form.dbName) {
        getSensitiveInfo(this.filterFormData).then((res) => {
          this.tableData = { ...this.tableData, ...res };
        });
      }
    },
    goRecord() {
      let data = _.pick(this.form, [
        "name",
        "deptId",
        "netdistrictId",
        "status",
        "include4A",
        "businessSysId",
        "adminUser",
        "adminContact",
        "appUser",
        "appContact",
        "cooperateVendor",
        "devVendor",
        "id",
      ]);
      this.$refs.form.validate((valid) => {
        if (valid) {
          postRecord(data).then(() => {
            this.$message.success("备案成功");
            this.$emit("success");
            this.$emit("update:visible", false);
          });
        } else {
          return false;
        }
      });
    },
    async getSelectOptions() {
      const types = ["assetStorageMode"];
      types.forEach((type) => {
        getSelectOptions(type).then((res) => {
          this.$set(this.options, type, res.data);
        });
      });
      //获取资源池
      getReaourcePool().then((res) => {
        this.$set(this.options, "assetResourcePool", res);
      });
      //获取所属部门
      getSelectDept().then((res) => {
        this.options.deptOptions = res;
      });
      // 获取应用系统
      getSelectBusinessSys().then((res) => {
        this.options.businessSys = res;
      });
      //获取所属网络域
      getSelectNetdistrictSel().then((res) => {
        this.options.netdistrictSel = res;
      });
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="postcss" scoped>
.resourse-dialog {
  max-height: calc(70vh - 100px);
  padding: 10px;
  overflow: auto;
}
.el-form[primary] >>> {
  .el-input {
    width: 100%;
  }
  .el-textarea {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
.divider {
  padding-bottom: 5px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e2e2;
}
.label-with {
  >>> .el-form-item__label {
    /* width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
  }
}
</style>
