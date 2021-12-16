<template>
  <div class="record-info-container">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      size="mini"
      label-width="100px"
      label-position="left"
    >
      <div class="info-header-title">{{ statusTitle }}信息</div>
      <div class="info-content">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属网络域:">
              {{ netdistrictName || "-" }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属业务系统:">
              {{ businessSysName || "-" }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属部门:" prop="deptName">
              {{ deptName || "-" }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="在线状态:" prop="status">
              {{ formData.status === "1" ? "在线" : "下线" }}
            </el-form-item> -->
            <el-form-item label="是否纳入4A:" prop="include4a">
              {{ formData.include4a === "1" ? "是" : "否" }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合作厂商:" prop="cooperateVendor">
              <el-input v-model="formData.cooperateVendor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式:" prop="adminContact">
              <el-input v-model="formData.adminContact"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统管理员:" prop="adminUser">
              <el-input v-model="formData.adminUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开发厂商:" prop="devVendor">
              <el-input v-model="formData.devVendor"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用管理员:" prop="appUser">
              <el-input v-model="formData.appUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${statusTitle}时间:`" prop="filingTime">
              {{ formData.filingTime || "-" }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${statusTitle}人:`" prop="filingUser">
              {{ formData.filingUser || "-" }}
            </el-form-item>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注:" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info-header-title">资产信息</div>
      <div class="info-content">
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务地址:" prop="ip">
              {{ formData.ip || "-" }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务端口:" prop="port">
              {{ formData.port || "-" }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="存储类型:" prop="storageMode">
              {{ formData.storageMode || "-" }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="存储字类型:" prop="assetType">
              {{ formData.assetType || "-" }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="mode === 'Field' ? '数据库名：' : '存储路径：'"
            >
              {{ mode === "Field" ? formData.dbName : formData.filePath }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字符集:" prop="charset">
              {{ formData.charset || "-" }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-button
                type="primary"
                :loading="loading"
                :disabled="loading"
                @click="toSave"
              >
                保存
              </el-button>
              <el-button @click="toCancel"> 取消 </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable no-empty */
import {
  getRechrdDetail,
  getSelectNetdistrictSel,
  getSelectBusinessSys,
  getSelectDept,
} from "../api";
export default {
  name: "RecordInfo",
  props: {
    assetId: {
      type: [Number, String],
      default: "",
    },
    statusTitle: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      formData: {
        netdistrictId: "",
        businessSysId: "",
        deptName: "",
        status: "1",
        include4a: "1",
        adminContact: "",
        adminUser: "",
        devVendor: "",
        appUser: "",
        filingTime: "",
        cooperateVendor: "",
        filingUser: "",

        ip: "",
        port: "",
        storageMode: "",
        assetType: "",
        dbOrFileName: "",
        charset: "",
        remark: "",
      },
      rules: {},
      loading: false,

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

      filingState: null,
    };
  },
  computed: {
    businessSysName() {
      const find = this.options.businessSys.find(
        ({ code }) => code === this.formData.businessSysId
      );
      if (find) {
        return find.name;
      }

      return "-";
    },
    netdistrictName() {
      const find = this.options.netdistrictSel.find(
        ({ code }) => code === this.formData.netdistrictId
      );

      if (find) {
        return find.name;
      }

      return "-";
    },
    deptName() {
      const find = this.options.deptOptions.find(
        ({ code }) => code === this.formData.deptId
      );

      if (find) {
        return find.name;
      }

      return "-";
    },
  },
  created() {
    this.getData();
    this.initOptions();

    const { filingState } = this.$route.query;
    this.filingState = filingState;
  },
  methods: {
    getData() {
      getRechrdDetail(this.assetId).then((res) => {
        this.formData = res;

        this.setDeptName();
      });
    },
    initOptions() {
      //获取所属网络域
      getSelectNetdistrictSel().then((res) => {
        this.options.netdistrictSel = res;
      });
      // 获取应用系统
      getSelectBusinessSys().then((res) => {
        this.options.businessSys = res;
      });
      //获取所属部门
      getSelectDept().then((res) => {
        this.options.deptOptions = res;

        this.setDeptName();
      });
    },
    setDeptName(arr, deptId) {
      if (Array.isArray(arr)) {
        let deptName = "";
        arr.forEach(({ code, name, children }) => {
          if (code === deptId) {
            deptName = name;
          }

          if (Array.isArray(children)) {
            children.forEach((child) => {
              if (child.code === deptId) {
                deptName = child.name;
              }
            });
          }
        });
        this.formData.deptName = deptName;
      }
    },
    toSave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const {
              adminContact,
              adminUser,
              devVendor,
              appUser,
              cooperateVendor,
              remark,
            } = this.formData;
            await this.$request({
              url: "/gov/api/asset/filing/record",
              method: "POST",
              data: {
                adminContact,
                adminUser,
                devVendor,
                appUser,
                cooperateVendor,
                remark,
                assetId: this.assetId,
                filingState: this.filingState,
              },
            });

            this.$message.success(`${this.statusTitle}成功`);

            this.$emit("update-data");
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    toCancel() {
      this.$router.back();
    },
  },
};
</script>

<style lang="postcss">
.record-info-container {
  padding: 0 20px;
  .info-header-title {
    border-left: 4px solid #4a90e2;
    color: #333;
    padding-left: 15px;
  }

  .info-content {
    padding: 0 20px;
    padding-top: 14px;

    .el-select,
    .el-input {
      width: 200px;
    }
  }
}
</style>
