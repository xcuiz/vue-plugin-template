<template>
  <!-- <el-dialog
    custom
    :close-on-click-modal="false"
    :title="title"
    :visible="visible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="handleClose"
  > -->
  <div class="form-content">
    <section class="resourse-dialog">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源名称" prop="name">
              <el-input
                v-model="form.name"
                size="mini"
                maxlength="30"
                placeholder="请输入"
              ></el-input>
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
            <el-form-item label="资源池" prop="resourcePool">
              <el-select
                v-model="form.resourcePool"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="option in options.assetResourcePool"
                  :key="option.code"
                  :value="option.code"
                  :label="option.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="POD" prop="pod">
              <el-input
                v-model="form.pod"
                size="mini"
                maxlength="20"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务系统" prop="businessSysId">
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
            <el-form-item label="负责人" prop="owner">
              <el-input
                v-model="form.owner"
                size="mini"
                maxlength="30"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contact">
              <el-input
                v-model="form.contact"
                size="mini"
                maxlength="30"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="是否涉敏" prop="isSensitive">
              <el-radio-group v-model="form.isSensitive">
                <el-radio
                  v-for="option in options.assetSensitive"
                  :key="option.code"
                  :label="option.code"
                  >{{ option.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="业务地址" prop="ip">
              <el-input
                v-model="form.ip"
                size="mini"
                maxlength="30"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务端口号" prop="port">
              <el-input
                v-model="form.port"
                size="mini"
                maxlength="30"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否集群" prop="isCluster">
              <el-radio-group v-model="form.isCluster">
                <el-radio
                  v-for="option in options.isClusterOption"
                  :key="option.code"
                  :label="option.code"
                  >{{ option.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-show="form.isCluster === '1'" :span="24">
            <el-form-item label="集群IP信息">
              <form-table
                ref="tableChild"
                :child-table-data="form.clusterTable"
                @getChildTable="getChildTable"
              ></form-table>
            </el-form-item>
          </el-col>
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
            <el-form-item
              :label="
                form.storageMode === 'File' ? '文件传输协议' : '数据库类型'
              "
              prop="assetType"
            >
              <el-select
                v-model="form.assetType"
                size="mini"
                placeholder="请选择"
                @change="upDataExtConfigs()"
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

          <template v-show="form.extConfigs.length">
            <el-col
              v-for="(item, index) in form.extConfigs"
              :key="item.id"
              :span="12"
            >
              <el-form-item
                :label="item.cnName"
                :prop="'extConfigs.' + index + '.defaultValue'"
                :rules="item.rules"
                class="label-with"
              >
                <template v-if="item.configType === 'input'">
                  <el-input
                    v-model="item.defaultValue"
                    placeholder="请输入"
                  ></el-input>
                </template>
                <template v-if="item.configType === 'select'">
                  <el-select
                    v-model="item.defaultValue"
                    size="mini"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="option in item.selOptions"
                      :key="option.code"
                      :value="option.code"
                      :label="option.name"
                    ></el-option>
                  </el-select>
                </template>
                <template v-if="item.configType === 'date'">
                  <el-date-picker
                    v-model="item.defaultValue"
                    type="datetime"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </template>
                <template v-if="item.configType === 'file'">
                  <!-- <el-upload
                  ref="upload"
                  class="upload-demo"
                  :on-success="handleSuccess"
                  name="file"
                  :on-change="uploadChange"
                  :auto-upload="false"
                  action=""
                >
                  <el-button size="mini" type="primary">上传</el-button>
                </el-upload> -->
                </template>
              </el-form-item>
            </el-col>
            <el-col
              v-show="form.extConfigs && form.extConfigs.length"
              :span="24"
            >
              <el-form-item label="认证方式" prop="authType">
                <el-radio-group v-model="form.authType">
                  <el-radio
                    v-for="option in options.authTypeOption"
                    :key="option.code"
                    :label="option.code"
                    >{{ option.name }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template>
              <div
                v-show="
                  form.extConfigs &&
                  form.extConfigs.length &&
                  form.authType &&
                  form.authType === 'account'
                "
              >
                <el-col :span="12">
                  <el-form-item label="账号" prop="userName">
                    <el-input
                      v-model="form.userName"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="密码" prop="password">
                    <el-input
                      v-model="form.password"
                      type="password"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </div>
              <div
                v-show="
                  form.extConfigs &&
                  form.extConfigs.length &&
                  form.authType &&
                  form.authType === 'file'
                "
                class="auth-file"
              >
                <!-- :on-change="uploadChange" -->
                <!--  :auto-upload="false" -->
                <el-col :span="12">
                  <el-form-item label="帐号">
                    <el-input
                      v-model="form.authAcount"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="服务器主体">
                    <el-input
                      v-model="form.authService"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-for="load in authFileList" :key="load.code" :span="8">
                  <el-form-item :label="load.name">
                    <template>
                      <el-upload
                        ref="upload"
                        class="upload-demo"
                        name="file"
                        :file-list="load.fileList"
                        :data="{ name: form.name }"
                        :on-change="uploadChange"
                        :on-success="
                          (response) => {
                            return handleSuccess(response, load.code);
                          }
                        "
                        action="/gov/api/asset/list/fileUpload"
                      >
                        <el-button size="mini" type="primary">上传</el-button>
                      </el-upload>
                    </template>
                  </el-form-item>
                </el-col>
              </div>
            </template>
          </template>
          <el-col :span="24" style="100%">
            <el-form-item label="环境类型" prop="dbType">
              <el-radio-group v-model="form.dbType">
                <el-radio label="1">生产环境</el-radio>
                <el-radio label="0">非生产环境</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="100%">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
    </section>

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
  </div>
  <!-- </el-dialog> -->
</template>
<script>
import {
  getSinsitiveConfig,
  sinsitiveAddOrEdit,
  getSelectOptions,
  getReaourcePool,
  getSelDataTypeList,
  extendConfig,
  getSelectDept,
  getSelectBusinessSys,
  getSelectNetdistrictSel,
  getFormExtConfigList,
  getAuthType,
} from "../api";
import formTable from "./form-table-child";
import { PORT_RE, STR_RE } from "@/constants";
import { deepClone } from "@/components/common/js/util";
const formDefaultValue = {
  id: null,
  name: null,
  ip: null,
  port: null,
  assetType: null,
  storageMode: null,
  deptId: null,
  businessSysId: null,
  owner: null,
  netdistrictId: null,
  contact: null,
  isSensitive: null,
  isCluster: null,
  status: null,
  pod: null,
  isSample: false,
  resourcePool: null,
  // 返回是数组 提交是对象
  extConfigs: {},
  key: null,
  value: null,
  fileListParams: {},
  clusterTable: [],
  userName: "",
  authAcount: "",
  authService: "",
  authType: "",

  dbType: "",
};
export default {
  components: {
    formTable,
  },
  props: {
    id: {
      type: [String, Number],
    },
    name: {
      type: [String],
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
    const validateUserName = (rule, value, callback) => {
      if (this.form.authType === "account") {
        if (value != undefined && value != null) {
          callback();
        } else {
          callback(new Error("请输入"));
        }
      } else {
        callback();
      }
    };
    return {
      imageUrl: "",
      loading: {
        detail: false,
        submit: false,
      },
      form: {
        ...formDefaultValue,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: STR_RE,
            message: "不能包含空格或特殊字符",
          },
        ],
        owner: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: STR_RE,
            message: "不能包含空格或特殊字符",
          },
        ],
        authType: [
          {
            required: true,
            message: "请输入",
          },
        ],
        storageMode: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: STR_RE,
            message: "请选择存储类型",
          },
        ],
        assetType: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: STR_RE,
            message: "请选择存储类型",
          },
        ],
        contact: [
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确的手机号码或者座机号",
          },
        ],
        password: {
          required: this.type === "add" ? true : false,
          message: "请输入",
          validator: validateUserName,
        },
        userName: {
          required: true,
          message: "请输入",
          validator: validateUserName,
        },
        ip: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入ip");
              } else if (!this.form.port) {
                callback("请输入端口号");
              } else if (!PORT_RE.test(this.form.port)) {
                callback("请输入正确的端口号");
              } else {
                callback();
              }
            },
          },
        ],
        port: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: PORT_RE,
            message: "请输入正确的端口号",
          },
        ],
        isCluster: [
          {
            required: true,
            message: "请选择",
          },
        ],
        netdistrictId: [
          {
            required: true,
            message: "请选择",
          },
        ],
        dbType: [
          {
            required: true,
            message: "请选择",
          },
        ],
      },
      fileList: [],
      options: {
        assetResourcePool: [],
        assetStorageMode: [],
        assetStauts: [],
        assetSensitive: [],
        assetDataType: [],
        deptOptions: [],
        businessSys: [],
        netdistrictSel: [],
        isClusterOption: [
          { code: "1", name: "是" },
          { code: "0", name: "否" },
        ],
        authTypeOption: [],
      },
    };
  },
  computed: {
    authFileList() {
      const fileList = [
        { name: "keytab文件", code: "keytab", type: "file", fileList: [] },
        { name: "krb5conf文件", code: "krb5conf", type: "file", fileList: [] },
        { name: "jaas.conf", code: "jaas.conf", type: "file", fileList: [] },
        { name: "kerberos账号", code: "kerberos", type: "file", fileList: [] },
        {
          name: "core-site文件",
          code: "core-site",
          type: "file",
          fileList: [],
        },
        {
          name: "hdfs-site文件",
          code: "hdfs-site",
          type: "file",
          fileList: [],
        },
      ];
      if (
        this.form.storageMode === "BigData" &&
        this.form.assetType !== "Hdfs"
      ) {
        return fileList.splice(0, fileList.length - 2);
      } else {
        return fileList;
      }
    },
  },
  watch: {
    id(val) {
      // 编辑的时候重新获取数据
      if (val) {
        this.getDetail();
      }
    },
  },
  created() {
    if (this.id) {
      this.getDetail();
    }
    this.getSelectOptions();
  },
  methods: {
    resetFormFields() {
      const form = this.$refs.form;

      if (form) {
        form.resetFields();
      }
    },
    async getExtForm(extObj) {
      if (this.form.storageMode && this.form.assetType) {
        await extendConfig({
          storageMode: this.form.storageMode,
          assetType: this.form.assetType,
        }).then((res) => {
          let data = res.data;
          if (data) {
            if (extObj?.length) {
              data.forEach((item) => {
                let isFind = extObj.find((sItem) => {
                  return item.name == sItem.name;
                });
                if (isFind) {
                  item.defaultValue = isFind.defaultValue;
                }
              });
            }
            let resData = [];
            resData = data.map((item, index) => {
              let selOptions = [];
              let rules = [];
              if (item.isRequired === "1") {
                rules.push({
                  required: true,
                  message: `请输入${item.cnName}名称`,
                });
                // return { ...item };
              }
              if (item.length) {
                rules.push({
                  max: item.length,
                  message: `最大输入${item.length}字符`,
                });
              }
              if (item.regPattern) {
                rules.push({
                  pattern: new RegExp(item.regPattern),
                  message: `请输入正确的${item.cnName}名称`,
                });
              }

              if (item.interfaceName) {
                getFormExtConfigList(item.interfaceName).then((data) => {
                  this.$set(
                    this.form.extConfigs[index],
                    "selOptions",
                    data.data
                  );
                });
              }
              return { ...item, rules, selOptions, value: item.defaultValue };
            });
            this.$set(this.form, "extConfigs", resData);
            // this.form.extConfigs = resData;
          }
        });
      }
      await getAuthType({ storageMode: this.form.storageMode }).then((res) => {
        this.options.authTypeOption = res.data;
      });
    },
    async getDynamicFormList() {},
    upDataExtConfigs() {
      this.getExtForm();
    },
    async getSelectOptions() {
      const types = ["assetStorageMode", "assetStauts", "assetSensitive"];
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
        this.$set(this.options, "deptOptions", res);
      });
      //获取应用系统
      getSelectBusinessSys().then((res) => {
        this.$set(this.options, "businessSys", res);
      });
      //获取所属网络域
      getSelectNetdistrictSel().then((res) => {
        this.$set(this.options, "netdistrictSel", res);
      });
    },
    getDataType(str) {
      let data = { storageMode: str };
      this.form.extConfigs = [];
      this.form.authType = "";
      if (this.form.assetType) {
        this.form.assetType = "";
      }
      this.options.authType = [];

      getSelDataTypeList(data).then((res) => {
        this.$set(this.options, "assetDataType", res.data);
      });
    },
    async uploadChange(file, fileList) {
      if (fileList.length === 2) {
        fileList.shift();
      }
      // this.$refs["upload"].submit();
    },
    // getUploadName(name) {
    // },
    async handleSuccess(response, code) {
      if (response.status != "success") {
        this.$message.error(response.message);
      } else {
        // this.form.fileName = response.content.fileName;
        // this.form.filePath = response.content.filePath;
        this.form.fileListParams[code] = {
          fileName: response.content.fileName,
          filePath: response.content.filePath,
        };
      }
    },
    handleClose() {
      this.$refs.tableChild.formFlag = false;
      this.$emit("update:visible", false);
    },
    handleSubmit() {
      if (this.$refs.tableChild.formFlag) {
        const form = this.$refs.form;
        const tableChild = this.$refs.tableChild.$refs.childForm;
        Promise.all([form, tableChild].map(this.getFormPromise)).then((res) => {
          const validateResult = res.every((item) => !!item);
          if (validateResult) {
            // 通过
            this.checkSuccess();
          } else {
            // 未通过
          }
        });
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.checkSuccess();
          }
        });
      }
    },
    checkSuccess() {
      this.loading.submit = true;
      let form = deepClone(this.form);
      // 提交时时间字段置空
      form.createTime = null;
      form.foundTime = null;
      form.updateTime = null;
      this.$refs.tableChild.formFlag = false;
      sinsitiveAddOrEdit(form)
        .then(() => {
          this.$message.success("保存成功");
          // if (this.type === "edit") {
          //   this.$message.success("保存成功");
          this.$emit("success", this.id);
          // } else {
          //   this.$parent.getDetail(this.id);
          // }
          this.handleClose();
        })
        .finally(() => {
          this.loading.submit = false;
        });
    },
    getFormPromise(form) {
      return new Promise((resolve) => {
        form.validate((res) => {
          resolve(res);
        });
      });
    },
    getChildTable(data) {
      this.form.clusterTable = data;
    },
    setFormData(data) {
      this.form = {
        ...formDefaultValue,
        ...data,
      };
      this.getExtForm(this.form.extConfigs);
    },
    getAuthList(fileObj) {
      if (JSON.stringify(fileObj) !== "{}" && fileObj !== null) {
        let keys = Object.keys(fileObj);
        this.authFileList.forEach((item) => {
          let exits = keys.find((sitem) => sitem == item.code);
          if (exits) {
            item.fileList.push({
              name: fileObj[exits].fileName,
              url: fileObj[exits].filePath,
            });
          }
        });
      }
    },
    async getDetail() {
      this.loading.detail = true;
      await getSinsitiveConfig(this.id)
        .then((res) => {
          this.setFormData(res.data);
          // this.getDataType(this.form.storageMode);
          if (res.data) {
            let storageMode = res.data.storageMode;
            let data = { storageMode: storageMode };
            getSelDataTypeList(data).then((res) => {
              this.$set(this.options, "assetDataType", res.data);
            });
          }

          this.getAuthList(this.form.fileListParams);
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
  },
};
</script>
<style lang="postcss" scoped>
.form-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  form {
    height: calc(100vh - 150px);
    overflow-x: hidden;
    overflow-y: scroll;
    padding-right: 25px;
  }

  .dialog-footer {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
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
.label-with {
  >>> .el-form-item__label {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.auth-file {
  >>> .el-col:last-child {
    clear: both;
  }
}
</style>
